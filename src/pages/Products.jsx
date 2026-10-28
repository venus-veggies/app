import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Sprout } from "lucide-react";
import { getCategories } from "../data/products";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import CategoryTile from "../components/product/CategoryTile";
import Hero from "../components/hero/Hero";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { COPY, tpl } from "../config/copy";

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);

  const [categories, setCategories] = useState([]);
  const [catError, setCatError] = useState(null);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const { products, loading, error } = useProducts({
    search: query,
    category: selectedParent,
    subcategory: selectedSub,
  });

  useDocumentTitle("Shop");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCatError(COPY.productsLoadingError));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Derive parent and child categories
  const parentCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // Business priority: Vegetables = 1, Fruits = 2, everything else = 99
      const aPriority = aName.includes("vegetable")
        ? 1
        : aName.includes("fruit")
          ? 2
          : 99;
      const bPriority = bName.includes("vegetable")
        ? 1
        : bName.includes("fruit")
          ? 2
          : 99;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Fallback to alphabetical for the rest
      return a.name.localeCompare(b.name);
    });
  const selectedParentId = parentCategories.find(
    (c) => c.slug === selectedParent,
  )?.id;
  const subCategories = categories.filter(
    (c) => c.parent_id === selectedParentId,
  );

  const availableProducts = products.filter((product) =>
    product.variants?.some((v) => v.status === "active"),
  );

  const handleParentClick = (slug) => {
    setSelectedParent(slug === selectedParent ? "" : slug);
    setSelectedSub(""); // reset sub when parent changes
  };

  return (
    <div>
      <Hero />

      {/* Mobile search */}
      <div className="md:hidden flex items-center gap-2 bg-surface rounded-pill px-3.5 py-2.5 border border-border mb-4">
        <Search size={17} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={COPY.searchPlaceholder}
          className="bg-transparent text-sm outline-none placeholder:text-muted w-full"
        />
        <SlidersHorizontal size={16} className="text-muted shrink-0" />
      </div>

      {/* Parent categories — photo tiles */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-4 -mx-4 px-4 pb-2">
        <CategoryTile
          name={COPY.categoryAll}
          isActive={selectedParent === ""}
          onClick={() => handleParentClick("")}
        />
        {parentCategories.map((c) => (
          <CategoryTile
            key={c.slug}
            name={c.name}
            imageUrl={c.image_url}
            isActive={selectedParent === c.slug}
            onClick={() => handleParentClick(c.slug)}
          />
        ))}
      </div>

      {/* Subcategories (only when parent selected and has children) */}
      {selectedParent && subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <button
            onClick={() => setSelectedSub("")}
            className={`shrink-0 text-xs font-medium px-3 py-1 rounded-pill border ${
              selectedSub === ""
                ? "bg-leaf-100 border-leaf-500 text-leaf-700"
                : "bg-surface border-border text-body hover:border-leaf-400"
            }`}
          >
            All
          </button>
          {subCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedSub(c.slug)}
              className={`shrink-0 text-xs font-medium px-3 py-1 rounded-pill border transition-colors ${
                selectedSub === c.slug
                  ? "bg-leaf-100 border-leaf-500 text-leaf-700"
                  : "bg-surface border-border text-body hover:border-leaf-400"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {catError && <p className="text-sm text-red-500 mb-3">{catError}</p>}

      {/* Product grid states */}
      {loading ? (
        <LoadingSkeleton variant="product-card" />
      ) : error ? (
        <div className="text-center py-16 text-muted">
          <p className="font-medium text-body">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-leaf-700 text-sm mt-2 underline"
          >
            {COPY.reloadPage}
          </button>
        </div>
      ) : availableProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {availableProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-16 text-muted">
          <Sprout size={32} className="mb-3 text-leaf-400" />
          <p className="font-medium text-body">
            {tpl(COPY.noProductsMatch, { query })}
          </p>
          <p className="text-sm">{COPY.noProductsHint}</p>
        </div>
      )}
    </div>
  );
}
