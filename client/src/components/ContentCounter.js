import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3000', {
    transports: ['websocket'],
});
const ContentCounter = ({ selectedCategory, categoryName }) => {
    const [counts, setCounts] = useState(null);
    useEffect(() => {
        const handleCountsUpdate = (data) => {
            console.log('Received counts update:', data);
            setCounts(data);
        };
        socket.on('countsUpdate', handleCountsUpdate);
        socket.emit('requestCounts', selectedCategory);
        return () => {
            socket.off('countsUpdate', handleCountsUpdate);
        };
    }, [selectedCategory]);
    return (_jsxs("div", { className: "block", children: [_jsxs("div", { className: "flex flex-wrap gap-4 mt-2 mb-2", children: [_jsxs("div", { className: "bg-slate-500 text-white p-1 px-2 rounded-md", children: [_jsx("span", { className: "font-bold", children: counts ? counts.imagesCount : '+0' }), " images"] }), _jsxs("div", { className: "bg-slate-500 text-white p-1 px-2 rounded-md", children: [_jsx("span", { className: "font-bold", children: counts ? counts.linksCount : '+0' }), " links"] }), _jsxs("div", { className: "bg-slate-500 text-white p-1 px-2 rounded-md", children: [_jsx("span", { className: "font-bold", children: counts ? counts.filesCount : '+0' }), " files"] })] }), selectedCategory ? (_jsxs(_Fragment, { children: ["Con la categoria: ", _jsx("span", { className: "font-bold uppercase", children: categoryName })] })) : ('Con todas las Categorias')] }));
};
export default ContentCounter;
