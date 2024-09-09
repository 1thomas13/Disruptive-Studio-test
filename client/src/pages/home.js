import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ContentCounter from "../components/ContentCounter";
import { apiClient } from "../utils";
import { ContentModal } from "../components/modal/ContentModal";
import { Card } from "../components/Card";
function Home() {
    const [content, setContent] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    useEffect(() => {
        (async () => {
            const [content, categories] = await Promise.all([apiClient('/content'), apiClient('/categories')]);
            setContent(content.data);
            setFilteredContent(content.data);
            setCategories(categories.data);
        })();
    }, []);
    useEffect(() => {
        const filtered = content.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!selectedCategory)
                return item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) || matchesSearch;
            const matchesCategory = selectedCategory ? item.category._id === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
        setFilteredContent(filtered);
    }, [searchTerm, selectedCategory, content]);
    const handleCardClick = (id) => {
        setSelectedContent(id);
        setModalOpen(true);
    };
    return (_jsx(_Fragment, { children: _jsxs("main", { children: [_jsx(ContentModal, { contentId: selectedContent, isModalOpen: modalOpen, setIsModalOpen: setModalOpen }), _jsxs("section", { className: "relative w-full max-w-6xl px-5 py-4 mx-auto rounded-md", children: [_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-3", children: _jsx("svg", { className: "w-5 h-5 text-gray-400", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("input", { type: "text", className: "w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", placeholder: "Buscar tem\u00E1tica o nombre de contenido", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("select", { className: "ml-4 py-3 pl-4 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), children: [_jsx("option", { value: "", children: "Todas las categor\u00EDas" }), categories.map(category => (_jsx("option", { value: category._id, children: category.name }, category._id)))] })] }), _jsx("div", { className: "rounded-md bg-slate-200 text-w font-medium p-4 mt-4", children: _jsx(ContentCounter, { selectedCategory: selectedCategory, categoryName: categories?.find(category => category._id === selectedCategory)?.name || '' }) }), _jsx("section", { className: "bg-white", children: _jsx("div", { className: "container px-6 pb-10 mx-auto", children: _jsx("div", { className: "grid grid-cols-1 gap-8 mt-4 xl:gap-12 lg:grid-cols-3", children: filteredContent.length > 0 && filteredContent.map(element => (_jsx(Card, { element: element, handleCardClick: handleCardClick }))) }) }) })] })] }) }));
}
export default Home;
