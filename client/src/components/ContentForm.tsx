import { useMemo, useEffect, useState } from 'react'
import Modal from './Modal';
import { apiClientWithToken } from '../utils';
import useUserStore from '../store';
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
interface Category {
  _id: string;
  name: string;
}

interface ContentType {
  _id: string;
  name: string;
  isUrl: boolean;
  isDocument: boolean;
  isImage: boolean;
  fileExtension: string;
  domain: string;
  description: string;
}

export const ContentForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    urls: [] as string[],
    files: [] as File[],
    category: '',
  });
  const [availableContentTypes, setAvailableContentTypes] = useState<ContentType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUrlAllowed, setIsUrlAllowed] = useState(false);
  const [isFileAllowed, setIsFileAllowed] = useState(false);
  const [isImageAllowed, setIsImageAllowed] = useState(false);
  const [rawUrls, setRawUrls] = useState('');
  const { user: userData } = useUserStore((state) => state)

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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchContentTypesForCategory = async (categoryId: string) => {
    try {
      const response = await apiClientWithToken.get(`/admin/${categoryId}/content-types`);
      const contentTypes = response.data as ContentType[];
      setAvailableContentTypes(contentTypes);
      setIsUrlAllowed(contentTypes.some(type => type.isUrl));
      setIsFileAllowed(contentTypes.some(type => type.isDocument));
      setIsImageAllowed(contentTypes.some(type => type.isImage));
    } catch (error) {
      console.error('Error fetching content types:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawUrls(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormValues({ files: filesArray });
    }
  };

  const disabledField = useMemo(() => {
    if (formValues.files.length > 0) return 'url';
    if (rawUrls) return 'file';
    return null;
  }, [formValues.files, rawUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const urls = rawUrls.split(',').map(url => url.trim()).filter(url => url !== '');
    setFormValues(prevValues => ({ ...prevValues, urls }));

    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('category', formValues.category);
    formData.append('urls', JSON.stringify(urls));
    formData.append('creator', userData?.id);

    if (formValues.files.length > 0) {
      formValues.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      if (formValues.urls && formValues.urls.length > 0) {
        const contentType = availableContentTypes.find((type: ContentType) => type.isUrl)
        if (contentType?.domain) {
          const isValid = formValues.urls.every((url) => url.includes(contentType.domain))
          if (!isValid) throw new Error(`Invalid Format to be ${contentType.domain}`)
        }
      }

      if (formValues.files && formValues.files.length > 0) {
        const allowImages = availableContentTypes.some(type => type.isImage);
        const documentContentType = availableContentTypes.find(type => type.isDocument);

        const filesAreValid = Array.from(formValues.files).every(file => {
          const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

          if (allowImages && IMAGE_EXTENSIONS.includes(fileExtension)) return true
          if (documentContentType?.fileExtension) return documentContentType.fileExtension.includes(fileExtension);
          if (!documentContentType?.fileExtension) return true
          return false
        });

        if (!filesAreValid) throw Error(`Some files do not meet the allowed extensions.`)
      }

      await apiClientWithToken.post('/admin/contents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsModalOpen(false)
      setIsUrlAllowed(false);
      setIsFileAllowed(false);
      setIsImageAllowed(false);
    } catch (error: any) {
      alert(error.message)
      console.error('Error creating content:', error.message);
    }
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Crear Contenido
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
          Crear Contenido
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>

          {isUrlAllowed && (
            <div>
              <label htmlFor="urls" className="block text-sm font-medium text-gray-700">
                URLs (separadas por comas)
              </label>
              <input
                type="text"
                id="urls"
                name="urls"
                value={rawUrls}
                onChange={handleUrlsChange}
                placeholder="Ingresa URLs separadas por comas"
                disabled={disabledField === 'url'}
                className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </div>
          )}

          {(isFileAllowed || isImageAllowed) && (
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700">
                Archivos/Imágenes
                <span className='text-xs block'>Si quieres agregar varias archivos arrastralos aqui:</span>
              </label>
              <input
                type="file"
                id="file"
                name="file"
                multiple
                onChange={handleFileChange}
                className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                disabled={disabledField === 'file'}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          >
            Crear Contenido
          </button>
        </form>
      </Modal>
    </div >
  )
}
