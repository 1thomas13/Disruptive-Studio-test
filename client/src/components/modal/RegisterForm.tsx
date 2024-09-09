import { useState } from 'react';
import Modal from '.';
import { apiClient } from '../../utils';

interface FormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const RegisterForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post('users', formData);

      alert('regitration successful. Please Login');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al registrar', error);
      alert(error);
    }
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Soy Lector o Creador de contenido
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
          User Registration
        </h3>
        <form className="mt-4" onSubmit={handleSubmit}>
          <label htmlFor="username" className="text-sm text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="block w-72 px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          />

          <label htmlFor="email" className="block mt-3 text-sm text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="user@email.xyz"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          />

          <label htmlFor="password" className="block mt-3 text-sm text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          />

          <label htmlFor="role" className="block mt-3 text-sm text-gray-700">
            Rol
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full px-4 py-3 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          >
            <option value="user">User</option>
            <option value="creator">creator</option>
          </select>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          >
            Registrarme
          </button>
        </form>
      </Modal>
    </div>
  );
};
