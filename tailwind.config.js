import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./public/**/*.js",
    ],

    theme: {
        fontFamily: {
            sans: ["Satoshi", "sans-serif"], // Setel font default menjadi Satoshi
        },
        extend: {},
    },

    plugins: [forms],
};
