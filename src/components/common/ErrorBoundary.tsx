import { Component, ErrorInfo, ReactNode, useState, useEffect } from "react";
import "../../styles/_errorBoundary.scss";

interface Props {
  children: ReactNode;
  message?: string;
}

interface ErrorState {
  hasError: boolean;
  error?: Error;
}

// UI Component
const ErrorBoundaryUI: React.FC<Props> = ({ children, message }) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
  });

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setErrorState({
        hasError: true,
        error: error.error,
      });
      console.error("Uncaught error:", error);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (errorState.hasError) {
    return (
      <div className="error-boundary">
        <h1>Something went wrong</h1>
        <p>{errorState.error?.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  if (message) {
    return (
      <div className="error-boundary">
        <h1>Notice</h1>
        <p>{message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  if (!children) {
    return (
      <div className="error-boundary">
        <h1>Something went wrong</h1>
        <p>No content available</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return <>{children}</>;
};

// Error Boundary Wrapper (this is what we export and use)
class ErrorBoundary extends Component<Props, ErrorState> {
  public state: ErrorState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    return (
      <ErrorBoundaryUI message={this.props.message}>
        {this.state.hasError ? null : this.props.children}
      </ErrorBoundaryUI>
    );
  }
}

export default ErrorBoundary;
