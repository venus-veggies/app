import { Component } from "react";
import { Button } from "./ui/Button";
import { COPY } from "../config/copy";

// Change this to your actual support email
const SUPPORT_EMAIL = "support@venusveggies.com";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const subject = encodeURIComponent("App error report");
      const body = encodeURIComponent(
        `Error: ${error?.message}\n\nComponent stack: ${errorInfo?.componentStack}`,
      );
      const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

      return (
        <div className="flex flex-col items-center text-center py-20 px-4">
          <h1 className="type-hero mb-2">{COPY.errorBoundaryTitle}</h1>
          <p className="text-muted mb-5">{COPY.errorBoundaryDescription}</p>

          <p className="text-sm text-body mb-6 max-w-md">
            If the problem continues, please contact{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-leaf-700 underline"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            or report the issue below — we’ll get back to you quickly.
          </p>

          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>
              {COPY.reloadPage}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(mailto, "_self")}
            >
              Report issue
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
