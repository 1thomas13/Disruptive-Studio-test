import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiClientWithToken } from '../../utils';
import { normalizeImageUrl } from '../../utils';
import Modal from '.';
export const ContentModal = ({ isModalOpen, setIsModalOpen, contentId }) => {
    const [content, setContent] = useState(null);
    useEffect(() => {
        if (contentId) {
            (async () => {
                try {
                    const response = await apiClientWithToken(`/admin/contents/${contentId}`);
                    setContent(response.data);
                }
                catch (error) {
                    console.error('Error fetching content:', error);
                }
            })();
        }
    }, [contentId]);
    return (_jsx(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), children: _jsx("div", { className: "p-6", children: content ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-xl font-medium leading-6 text-gray-800 capitalize", id: "modal-title", children: content.name }), _jsxs("div", { className: "mt-4", children: [_jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", content.description] }), content.urls && content.urls.length > 0 && (_jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "URLs:" }), _jsx("ul", { children: content.urls.map((url, index) => (_jsx("li", { children: _jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 underline", children: url }) }, index))) })] })), content.files && content.files.length > 0 && (_jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Archivos:" }), _jsx("ul", { children: content.files.map((file) => (_jsx("li", { children: _jsx("a", { href: normalizeImageUrl(file), target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 underline", children: file }) }, file))) })] })), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Cr\u00E9ditos:" }), " ", content.creator.username] }), _jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "Categor\u00EDa:" }), " ", content.category.name] }), _jsx("img", { src: normalizeImageUrl(content.category.imageUrl), alt: content.category.name, className: "h-auto mt-4 w-20" })] })] })) : (_jsx("p", { children: "Cargando..." })) }) }));
};
