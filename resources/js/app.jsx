import "./bootstrap";
import { createInitialLayout, createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const appName = "Pemilu OSIS";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        AOS.init({
            duration: 800,
            once: true,
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#2563eb",
    },
});
