import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Sprout } from "lucide-react";
import { getCategories } from "../data/categories";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import Hero from "../components/hero/Hero";
import useDocumentTitle from "../hooks/useDocumentTitle";
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
  const parentCategories = categories.filter((c) => !c.parent_id);
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

      {/* Parent categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        <button
          onClick={() => handleParentClick("")}
          className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-pill border ${
            selectedParent === ""
              ? "bg-leaf-500 border-leaf-500 text-white"
              : "bg-surface border-border text-body hover:border-leaf-400"
          }`}
        >
          {COPY.categoryAll}
        </button>
        {parentCategories.map((c) => (
          <button
            key={c.slug}
            onClick={() => handleParentClick(c.slug)}
            className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-pill border transition-colors ${
              selectedParent === c.slug
                ? "bg-leaf-500 border-leaf-500 text-white"
                : "bg-surface border-border text-body hover:border-leaf-400"
            }`}
          >
            {c.name}
          </button>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-card shadow-card animate-pulse"
            >
              <div className="aspect-square bg-leaf-100/60 rounded-t-card" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-leaf-100 rounded w-3/4" />
                <div className="h-3 bg-leaf-100 rounded w-1/2" />
                <div className="h-4 bg-leaf-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
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
