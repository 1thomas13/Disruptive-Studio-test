import { useState } from 'react'
import { apiClientWithToken } from '../../utils';
import Modal from '.';
interface FormValues {
  name: string;
  description?: string;
  type: 'url' | 'image' | 'document';
  fileExtension?: string;
  domain?: string;
}

export const TypeOfContentForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    type: 'url',
    fileExtension: '',
    domain: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    if (name === 'type') {
      setFormValues({
        ...formValues,
        type: value as 'url' | 'image' | 'document',
        fileExtension: value === 'document' ? formValues.fileExtension : '',
        domain: value === 'url' ? formValues.domain : '',
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      await apiClientWithToken.post('/contentType',
        { ...formValues, isUrl: formValues.type === 'url', isImage: formValues.type === 'image', isDocument: formValues.type === 'document' }
      )
      setIsModalOpen(false)
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert(error)
    }
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Crear Tipo de Contenido
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
          Crear Tipo de Contenido
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Name"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripcion (optional)
            </label>
            <input
              id="description"
              name="description"
              value={formValues.description || ''}
              onChange={handleChange}
              placeholder="Description"
              className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>

          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="block text-sm font-medium text-gray-700">Tipo</legend>
            <div className="flex items-center space-x-4 mt-2">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="url"
                  checked={formValues.type === 'url'}
                  onChange={handleChange}
                  className="mr-2"
                />
                URL
              </label>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="image"
                  checked={formValues.type === 'image'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Image
              </label>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="document"
                  checked={formValues.type === 'document'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Document
              </label>
            </div>
          </fieldset>

          {formValues.type === 'document' && (
            <div>
              <label htmlFor="fileExtension" className="block text-sm font-medium text-gray-700">
                Extension del archivo  (optional) ej: csv, txt, etc...<br />
              </label>
              <input
                type="text"
                id="fileExtension"
                name="fileExtension"
                value={formValues.fileExtension || ''}
                onChange={handleChange}
                placeholder="File Extension"
                className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </div>
          )}

          {formValues.type === 'url' && (
            <div>
              <label htmlFor="dominio" className="block text-sm font-medium text-gray-700">
                Domain ej: https://www.youtube.com/
              </label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formValues.domain || ''}
                onChange={handleChange}
                placeholder="dominio"
                className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </div>
          )}

          <button
            type="submit"
            className="px-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  )
}
