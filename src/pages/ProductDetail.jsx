import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Truck, Leaf as LeafIcon, Hand } from "lucide-react";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { ProduceBadge } from "../components/product";
import { getProducts } from "../data/products";
import { useProduct } from "../hooks/useProduct";
import { useAddToCart } from "../hooks/useAddToCart";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

const FACTS = [
  { icon: LeafIcon, label: COPY.farmFresh },
  { icon: Hand, label: COPY.handPicked },
  { icon: Truck, label: COPY.sameDayDelivery },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const addToCart = useAddToCart();

  const { product, loading, error } = useProduct(slug);

  useEffect(() => {
    if (product?.variants) {
      const active = product.variants.filter((v) => v.status === "active");
      if (active.length > 0) setSelectedVariant(active[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product?.category?.slug) {
      getProducts({ category: product.category.slug, perPage: 5 }).then(
        ({ products }) => {
          setRelated(products.filter((r) => r.slug !== slug).slice(0, 4));
        },
      );
    }
  }, [product, slug]);

  useDocumentTitle(product ? product.name : "Product");

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse space-y-4">
        <div className="h-64 md:h-72 bg-leaf-100 rounded-card mx-auto max-w-md" />
        <div className="h-6 bg-leaf-100 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-leaf-100 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="mb-3">{COPY.productNotFound}</p>
        <Button variant="outline" onClick={() => navigate(ROUTES.home)}>
          {COPY.backToShop}
        </Button>
      </div>
    );
  }

  const activeVariants =
    product.variants?.filter((v) => v.status === "active") ?? [];
  const price = selectedVariant ? parseFloat(selectedVariant.current_price) : 0;
  const unit = selectedVariant?.display_label ?? "";
  const tagName = product.tags?.[0]?.name;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addToCart(
      {
        slug: product.slug,
        name: product.name,
        image_url: product.image_url,
        price,
        variant: selectedVariant,
      },
      qty,
    );
  };

  return (
    <div className="pb-6">
      <SubPageHeader title={product.name} backTo={ROUTES.shop} />

      <div className="relative -mx-4 -mt-4 md:mx-0 md:mt-0 md:rounded-card overflow-hidden h-64 md:h-72 bg-leaf-100/60">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-leaf-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
        {tagName && (
          <ProduceBadge
            label={tagName}
            tone="leaf"
            size={60}
            className="absolute bottom-3 left-4"
          />
        )}
      </div>

      <div className="mt-5">
        <p className="type-eyebrow mb-1">{product.category?.name ?? ""}</p>
        <h1 className="type-hero mb-1">{product.name}</h1>
        <p className="type-caption mb-3">{unit}</p>

        <div className="flex items-center gap-3 mb-4">
          <span className="type-price-lg">₹{price}</span>
        </div>

        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeVariants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`text-sm px-3 py-1 rounded-pill border ${
                  selectedVariant?.id === v.id
                    ? "bg-leaf-500 text-white border-leaf-500"
                    : "bg-surface border-border text-body"
                }`}
              >
                {v.display_label} – ₹{parseFloat(v.current_price)}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-6">
          {FACTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 bg-leaf-100 rounded-card py-3"
            >
              <Icon size={18} className="text-leaf-700" />
              <span className="text-[11px] font-medium text-leaf-900">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm font-medium text-ink">
            {COPY.quantityLabel}
          </span>
          <QuantityStepper value={qty} onChange={setQty} min={1} />
        </div>
      </div>

      <div className="fixed bottom-[var(--bottomnav-height)] md:bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border p-3 safe-bottom">
        <div className="max-w-6xl mx-auto">
          {activeVariants.length > 0 ? (
            <Button className="w-full py-3" onClick={handleAdd}>
              Add {qty > 1 ? `${qty} ` : ""}to cart · ₹{price * qty}
            </Button>
          ) : (
            <div className="text-center text-sm text-tomato-600 bg-tomato-100 rounded-btn py-3">
              Currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
