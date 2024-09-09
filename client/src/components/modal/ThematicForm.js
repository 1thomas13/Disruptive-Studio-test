import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiClientWithToken } from '../../utils';
import Modal from '.';
export const ThematicForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contentTypes, setContentTypes] = useState([]);
    const [availableContentTypes, setAvailableContentTypes] = useState([]);
    const [image, setImage] = useState(null);
    useEffect(() => {
        const fetchContentTypes = async () => {
            try {
                const response = await apiClientWithToken.get('/admin/content-types');
                setAvailableContentTypes(response.data);
            }
            catch (error) {
                console.error('Error fetching content types:', error);
            }
        };
        fetchContentTypes();
    }, [isModalOpen]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('contentTypes', JSON.stringify(contentTypes));
            if (image)
                formData.append('image', image);
            await apiClientWithToken.post('/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsModalOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            console.error('Error creating category:', error);
            alert(error.message);
        }
    };
    const handleContentTypeChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setContentTypes([...contentTypes, value]);
        }
        else {
            setContentTypes(contentTypes.filter((id) => id !== value));
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file)
            setImage(file);
    };
    return (_jsxs("div", { className: "relative flex justify-center", children: [_jsx("button", { onClick: () => setIsModalOpen(!isModalOpen), className: "px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80", children: "Crear Tematica" }), _jsxs(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(!isModalOpen), children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-800 capitalize", id: "modal-title", children: "Crear Tematica" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: name, onChange: (e) => setName(e.target.value), placeholder: "Name", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("textarea", { id: "description", name: "description", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Description", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Content Types" }), _jsx("div", { className: "mt-2 space-y-2", children: availableContentTypes.map((contentType) => (_jsx("div", { children: _jsxs("label", { className: "inline-flex items-center", children: [_jsx("input", { type: "checkbox", value: contentType._id, onChange: handleContentTypeChange, className: "text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: contentType.name })] }) }, contentType._id))) })] }), _jsx("label", { htmlFor: "image", className: "block text-sm font-medium text-gray-700", children: "Image" }), _jsx("input", { type: "file", id: "image", name: "image", accept: "image/*", onChange: handleImageChange, className: "block w-full mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" }), _jsx("button", { type: "submit", className: "w-full px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", children: "Crear Tematica" })] })] })] }));
};
