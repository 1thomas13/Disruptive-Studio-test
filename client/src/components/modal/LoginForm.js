import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import useUserStore from '../../store';
import { apiClient } from '../../utils';
import Modal from '.';
export const LoginForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useUserStore((state) => state.setUser);
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await apiClient.post('users/login', { email, password });
            setUser({ ...res.data.user, token: res.data.token });
            localStorage.setItem('token', res.data.token);
            setIsModalOpen(false);
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    };
    return (_jsxs("div", { className: "relative flex justify-center", children: [_jsx("button", { onClick: () => setIsModalOpen(!isModalOpen), className: "px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80", children: "Login" }), _jsxs(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(!isModalOpen), children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-800 capitalize", id: "modal-title", children: "Login" }), _jsxs("form", { className: "mt-4 w-72", onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "email", className: "text-sm text-gray-700", children: "Email" }), _jsx("input", { type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), id: "email", required: true, placeholder: "user@email.xyz", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" }), _jsx("label", { htmlFor: "password", className: "block mt-3 text-sm text-gray-700", children: "Password" }), _jsx("input", { type: "password", name: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "Password", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" }), _jsx("button", { type: "submit", className: "w-full px-4 py-2 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", children: "Login" })] })] })] }));
};
