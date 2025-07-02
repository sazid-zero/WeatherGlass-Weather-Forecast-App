import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Suppress ResizeObserver loop errors
var resizeObserverErrorHandler = function (e) {
    if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        return false;
    }
};
window.addEventListener('error', resizeObserverErrorHandler);
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
            console.log('SW registered: ', registration);
        })
            .catch(function (registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
createRoot(document.getElementById("root")).render(_jsx(App, {}));
