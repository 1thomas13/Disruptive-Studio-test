import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { Layout } from "./components/Layout";
const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(Layout, {}), children: _jsx(Route, { index: true, element: _jsx(Home, {}) }) }) }) }));
};
export default App;
