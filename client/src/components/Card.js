import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { normalizeImageUrl } from '../utils';
export const Card = ({ element, handleCardClick }) => {
    return (_jsx("div", { onClick: () => handleCardClick(element._id), className: "flex items-end cursor-pointer overflow-hidden bg-cover rounded-lg h-80 border shadow-xl", style: { backgroundImage: `url(${normalizeImageUrl(element.category.imageUrl)})` }, children: _jsxs("div", { className: "w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/75", children: [_jsx("h2", { className: " text-xl font-semibold  capitalize text-white", children: element.name }), _jsx("p", { className: "text-lg tracking-wider uppercase text-blue-300", children: element.category.name }), _jsxs("p", { className: " text-lg tracking-wider  text-blue-300", children: ["creditos: ", element.creator.username] })] }) }, element._id));
};
