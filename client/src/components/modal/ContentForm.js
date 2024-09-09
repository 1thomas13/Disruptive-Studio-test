import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useEffect, useState } from 'react';
import useUserStore from '../../store';
import { apiClientWithToken } from '../../utils';
import Modal from '.';
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const ContentForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        urls: [],
        files: [],
        category: '',
    });
    const [availableContentTypes, setAvailableContentTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isUrlAllowed, setIsUrlAllowed] = useState(false);
    const [isFileAllowed, setIsFileAllowed] = useState(false);
    const [isImageAllowed, setIsImageAllowed] = useState(false);
    const [rawUrls, setRawUrls] = useState('');
    const { user: userData } = useUserStore((state) => state);
    useEffect(() => {
        fetchCategories();
    }, [isModalOpen]);
    useEffect(() => {
        if (formValues.category) {
            fetchContentTypesForCategory(formValues.category);
        }
    }, [formValues.category]);
    const fetchCategories = async () => {
        try {
            const response = await apiClientWithToken.get('/categories');
            setCategories(response.data);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const fetchContentTypesForCategory = async (categoryId) => {
        try {
            const response = await apiClientWithToken.get(`/admin/${categoryId}/content-types`);
            const contentTypes = response.data;
            setAvailableContentTypes(contentTypes);
            setIsUrlAllowed(contentTypes.some(type => type.isUrl));
            setIsFileAllowed(contentTypes.some(type => type.isDocument));
            setIsImageAllowed(contentTypes.some(type => type.isImage));
        }
        catch (error) {
            console.error('Error fetching content types:', error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const handleUrlsChange = (e) => {
        setRawUrls(e.target.value);
    };
    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormValues({ ...formValues, files: filesArray });
        }
    };
    const disabledField = useMemo(() => {
        if (formValues.files.length > 0)
            return 'url';
        if (rawUrls)
            return 'file';
        return null;
    }, [formValues.files, rawUrls]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const urls = rawUrls.split(',').map(url => url.trim()).filter(url => url !== '');
        setFormValues(prevValues => ({ ...prevValues, urls }));
        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('description', formValues.description);
        formData.append('category', formValues.category);
        formData.append('urls', JSON.stringify(urls));
        const userId = userData?.id || '';
        formData.append('creator', userId);
        if (formValues.files.length > 0) {
            formValues.files.forEach((file) => {
                formData.append('files', file);
            });
        }
        try {
            if (formValues.urls && formValues.urls.length > 0) {
                const contentType = availableContentTypes.find((type) => type.isUrl);
                if (contentType?.domain) {
                    const isValid = formValues.urls.every((url) => url.includes(contentType.domain));
                    if (!isValid)
                        throw new Error(`Invalid Format to be ${contentType.domain}`);
                }
            }
            if (formValues.files && formValues.files.length > 0) {
                const allowImages = availableContentTypes.some(type => type.isImage);
                const documentContentType = availableContentTypes.find(type => type.isDocument);
                const filesAreValid = Array.from(formValues.files).every(file => {
                    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
                    if (allowImages && IMAGE_EXTENSIONS.includes(fileExtension))
                        return true;
                    if (documentContentType?.fileExtension)
                        return documentContentType.fileExtension.includes(fileExtension);
                    if (!documentContentType?.fileExtension)
                        return true;
                    return false;
                });
                if (!filesAreValid)
                    throw Error(`Some files do not meet the allowed extensions.`);
            }
            await apiClientWithToken.post('/admin/contents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsModalOpen(false);
            setIsUrlAllowed(false);
            setIsFileAllowed(false);
            setIsImageAllowed(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            alert(error.message);
            console.error('Error creating content:', error.message);
        }
    };
    return (_jsxs("div", { className: "relative flex justify-center", children: [_jsx("button", { onClick: () => setIsModalOpen(!isModalOpen), className: "px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80", children: "Crear Contenido" }), _jsxs(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(!isModalOpen), children: [_jsx("h3", { className: "text-lg font-medium leading-6 text-gray-800 capitalize", id: "modal-title", children: "Crear Contenido" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Categor\u00EDa" }), _jsxs("select", { id: "category", name: "category", value: formValues.category, onChange: handleChange, className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", required: true, children: [_jsx("option", { value: "", children: "Selecciona una categor\u00EDa" }), categories.map((category) => (_jsx("option", { value: category._id, children: category.name }, category._id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Nombre" }), _jsx("input", { type: "text", id: "name", name: "name", value: formValues.name, onChange: handleChange, placeholder: "Nombre", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Descripci\u00F3n" }), _jsx("input", { id: "description", name: "description", value: formValues.description, onChange: handleChange, placeholder: "Descripci\u00F3n", className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" })] }), isUrlAllowed && (_jsxs("div", { children: [_jsx("label", { htmlFor: "urls", className: "block text-sm font-medium text-gray-700", children: "URLs (separadas por comas)" }), _jsx("input", { type: "text", id: "urls", name: "urls", value: rawUrls, onChange: handleUrlsChange, placeholder: "Ingresa URLs separadas por comas", disabled: disabledField === 'url', className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" })] })), (isFileAllowed || isImageAllowed) && (_jsxs("div", { children: [_jsxs("label", { htmlFor: "files", className: "block text-sm font-medium text-gray-700", children: ["Archivos/Im\u00E1genes", _jsx("span", { className: 'text-xs block', children: "Si quieres agregar varias archivos arrastralos aqui:" })] }), _jsx("input", { type: "file", id: "file", name: "file", multiple: true, onChange: handleFileChange, className: "block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", disabled: disabledField === 'file' })] })), _jsx("button", { type: "submit", className: "w-full px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40", children: "Crear Contenido" })] })] })] }));
};
