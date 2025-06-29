import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress ResizeObserver loop errors
const resizeObserverErrorHandler = (e: ErrorEvent) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    return false;
  }
};

window.addEventListener('error', resizeObserverErrorHandler);

createRoot(document.getElementById("root")!).render(<App />);
