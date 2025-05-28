import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
    ],

    safelist: [
        "task-card",
        "edit-delete",
        "edit-btn",
        "delete-btn",
        "btn",
        "project-card",
    ],

    theme: {
        fontFamily: {
            sans: ["Satoshi", "sans-serif"], // Setel font default menjadi Satoshi
        },
        extend: {},
    },

    plugins: [forms],
};
