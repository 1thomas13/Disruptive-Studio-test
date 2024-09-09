import { useEffect, useState } from 'react'
import { apiClientWithToken } from '../../utils';
import Modal from '.';
interface ContentType {
  _id: string;
  name: string;
}

export const ThematicForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [availableContentTypes, setAvailableContentTypes] = useState<ContentType[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await apiClientWithToken.get('/contentType');
        setAvailableContentTypes(response.data);
      } catch (error) {
        console.error('Error fetching content types:', error);
      }
    };

    fetchContentTypes();
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('contentTypes', JSON.stringify(contentTypes));
      if (image) formData.append('image', image);

      await apiClientWithToken.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsModalOpen(false)
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(error.message)
    }
  };

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setContentTypes([...contentTypes, value]);
    } else {
      setContentTypes(contentTypes.filter((id) => id !== value));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Crear Tematica
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
          Crear Tematica
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content Types</label>
            <div className="mt-2 space-y-2">
              {availableContentTypes.map((contentType) => (
                <div key={contentType._id}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={contentType._id}
                      onChange={handleContentTypeChange}
                      className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{contentType.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          >
            Crear Tematica
          </button>
        </form>
      </Modal>
    </div>
  )
}
