import { Component, type ErrorInfo, type ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portfolio failed to render", error, info);
  }
  render() {
    if (this.state.error)
      return (
        <main role="alert" style={{ padding: 40, color: "white" }}>
          <h1>The portfolio couldn’t load.</h1>
          <p>Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </main>
      );
    return this.props.children;
  }
}
