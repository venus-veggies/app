import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Sprout } from "lucide-react";
import { getCategories } from "../data/categories";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import Hero from "../components/hero/Hero";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { COPY, tpl } from "../config/copy";

export default function Products() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [catError, setCatError] = useState(null);

  const { products, loading, error } = useProducts({
    search: query,
    category: selectedCategory,
  });

  useDocumentTitle("Shop");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCatError(COPY.productsLoadingError));
  }, []);

  return (
    <div>
      <Hero />

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

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory("")}
          className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-pill border ${
            selectedCategory === ""
              ? "bg-leaf-500 border-leaf-500 text-white"
              : "bg-surface border-border text-body hover:border-leaf-400"
          }`}
        >
          {COPY.categoryAll}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSelectedCategory(c.slug)}
            className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-pill border transition-colors ${
              selectedCategory === c.slug
                ? "bg-leaf-500 border-leaf-500 text-white"
                : "bg-surface border-border text-body hover:border-leaf-400"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
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
