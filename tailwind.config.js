<<<<<<< HEAD
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
=======
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.js",
      "./resources/**/*.vue",
>>>>>>> 1bb71edf16ce6da59b21651bdf421317d768b6e8
    ],

    theme: {
      extend: {},
    },
<<<<<<< HEAD

    plugins: [forms],
};
=======
    plugins: [],
  }
>>>>>>> 1bb71edf16ce6da59b21651bdf421317d768b6e8
