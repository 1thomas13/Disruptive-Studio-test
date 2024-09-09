import { useEffect, useState } from 'react';
import { apiClientWithToken } from '../../utils';
import { normalizeImageUrl } from '../../utils';
import { IContentItem } from '../../interface';
import Modal from '.';

export const ContentModal = ({ isModalOpen, setIsModalOpen, contentId }: { isModalOpen: boolean, setIsModalOpen: (arg: boolean) => void, contentId: string | null }) => {
  const [content, setContent] = useState<IContentItem | null>(null);

  useEffect(() => {
    if (contentId) {
      (async () => {
        try {
          const response = await apiClientWithToken(`/content/${contentId}`);
          setContent(response.data);
        } catch (error) {
          alert(error)
          console.error('Error fetching content:', error);
        }
      })();
    }
  }, [contentId]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="p-6 relative ">
        {content ? (
          <>
            <h3 className="text-xl font-medium leading-6 text-gray-800 capitalize" id="modal-title">
              {content.name}
            </h3>
            <div className="mt-4">
              <p className="mb-2"><strong>Descripción:</strong> {content.description}</p>

              {content.urls && content.urls.length > 0 && (
                <div className="mb-2">
                  <strong>URLs:</strong>
                  <ul>
                    {content.urls.map((url: string, index: number) => (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline block">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.files && content.files.length > 0 && (
                <div className="mb-2">
                  <strong>Archivos:</strong>
                  <ul>
                    {content.files.map((file: string) => (
                      <li key={file}>
                        <a href={normalizeImageUrl(file)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mb-2"><strong>Créditos:</strong> {content.creator.username}</p>
              <p className="mb-2"><strong>Categoría:</strong> {content.category.name}</p>
              <img
                src={normalizeImageUrl(content.category.imageUrl)}
                alt={content.category.name}
                className="h-auto mt-4 w-20"
              />
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </Modal>
  );
};
