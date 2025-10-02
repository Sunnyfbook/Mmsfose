import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadSEOData } from "@/services/seoService";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

// Preload SEO data and then render the app
preloadSEOData().then((seoData) => {
  root.render(<App seoData={seoData} />);
}).catch((error) => {
  console.error('Error preloading SEO data, rendering app without it:', error);
  // Still render the app even if preloading fails
  root.render(<App seoData={null} />);
});