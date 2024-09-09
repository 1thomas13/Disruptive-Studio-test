import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl = import.meta.env.VITE_API_URL;

const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -'/api'.length) : apiUrl;

const socket = io(baseUrl, {
  transports: ['websocket'],
});

interface ICount {
  imagesCount: number;
  linksCount: number;
  filesCount: number
}

const ContentCounter: React.FC<{ selectedCategory: string | null, categoryName: string }> = ({ selectedCategory, categoryName }) => {
  const [counts, setCounts] = useState<ICount | null>(null);

  useEffect(() => {
    const handleCountsUpdate = (data: ICount) => {
      setCounts(data);
    };

    socket.on('countsUpdate', handleCountsUpdate);
    socket.emit('requestCounts', selectedCategory);

    return () => {
      socket.off('countsUpdate', handleCountsUpdate);
    };
  }, [selectedCategory]);

  return (
    <div className="block">
      <div className="flex flex-wrap gap-4 mt-2 mb-2">
        <div className="bg-slate-500 text-white p-1 px-2 rounded-md">
          <span className="font-bold">{counts ? counts.imagesCount : '+0'}</span> images
        </div>
        <div className="bg-slate-500 text-white p-1 px-2 rounded-md">
          <span className="font-bold">{counts ? counts.linksCount : '+0'}</span> links
        </div>
        <div className="bg-slate-500 text-white p-1 px-2 rounded-md">
          <span className="font-bold">{counts ? counts.filesCount : '+0'}</span> files
        </div>
      </div>
      {selectedCategory ? (
        <>Con la categoria: <span className="font-bold uppercase">{categoryName}</span></>
      ) : (
        'Con todas las Categorias'
      )}
    </div>
  );
};

export default ContentCounter;
