import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <h1 className="type-hero mb-2">{COPY.notFoundTitle}</h1>
      <p className="text-muted mb-5">{COPY.notFoundDescription}</p>
      <Link to={ROUTES.home}>
        <Button>{COPY.backToShop}</Button>
      </Link>
    </div>
  );
}
