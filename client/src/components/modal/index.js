import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null;
    return (_jsxs("div", { children: [_jsx("div", { className: "fixed inset-0 z-10 bg-black bg-opacity-50", onClick: onClose }), _jsx("div", { className: "fixed inset-0 z-20 flex items-end justify-center overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: _jsx("div", { className: "flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0", children: _jsxs("div", { className: "relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle", children: [children, _jsx("div", { className: "mt-4 sm:flex sm:items-center sm:-mx-2", children: _jsx("button", { type: "button", onClick: onClose, className: "w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mx-2 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40", children: "Cerrar" }) })] }) }) })] }));
};
export default Modal;
