"use client";

import React from "react";
import Button from "@/components/common/Button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-type-400 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Please try again.
              </p>
              {this.state.error && (
                <details className="text-left mb-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error details
                  </summary>
                  <p className="mt-2 text-xs text-error-400 font-mono bg-gray-50 p-2 rounded">
                    {this.state.error.message}
                  </p>
                </details>
              )}
            </div>
            <Button
              text="Return to Dashboard"
              onClick={this.handleReset}
              defaultClassName="w-full bg-jila-400 text-white py-3 rounded-lg"
              hoverClassName="bg-jila-300"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
