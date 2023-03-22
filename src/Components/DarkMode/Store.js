import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from '../DarkMode/DarkModeSlice';

export const Store = configureStore({
    reducer: {
        darkMode: darkModeReducer
    }
});