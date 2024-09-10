import axios from 'axios';

export const apiClient = axios.create({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  baseURL: (import.meta.env.VITE_API_URL  as string),
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

export const apiClientWithToken = axios.create({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClientWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const normalizeImageUrl = (imageUrl: string) => {
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const baseUrl = import.meta.env.VITE_API_URL;

  const normalizedPath = encodeURI(imageUrl.replace(/\\/g, '/'));

  return `${baseUrl}/${normalizedPath}`;
};