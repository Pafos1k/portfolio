import { createRoot } from "react-dom/client";
import { App } from "./App";
import { createPortfolioPage } from "./compatibility/createPortfolioPage";
import "./styles/exported.css";

async function start() {
  const container = document.getElementById("main");
  if (!container) throw new Error("Missing portfolio root");
  const page = await createPortfolioPage(window.location.pathname);
  createRoot(container).render(<App page={page} />);
}
void start().catch((error) => {
  console.error("Portfolio startup failed", error);
  const container = document.getElementById("main");
  if (container)
    container.textContent =
      "The portfolio could not load. Please refresh the page.";
});
