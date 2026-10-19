import type { ReactNode } from "react";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
export function App({ page }: { page: ReactNode }) {
  return <ErrorBoundary>{page}</ErrorBoundary>;
}
