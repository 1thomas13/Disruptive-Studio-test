import useUserStore from "../store";
import { Outlet } from 'react-router-dom';
import { useEffect } from "react";
import { apiClient } from "../utils";
import { ThematicForm } from "./modal/ThematicForm";
import { TypeOfContentForm } from "./modal/TypeOfContentForm";
import { ContentForm } from "./modal/ContentForm";
import { RegisterForm } from "./modal/RegisterForm";
import { LoginForm } from "./modal/LoginForm";

export const Layout = () => {
  const { user: userData, setUser } = useUserStore((state) => state)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token && userData === null) {
        try {
          const response = await apiClient.get('/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [setUser, userData]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <section
      className="w-full bg-center bg-cover md:h-[18rem] h-[24rem]"
    >
      <div className="flex p-12 gap-24 items-center justify-center text-center w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white lg:text-4xl">
            {!userData ? 'Accede a los mejores contenidos' : `Bienvenido ${userData?.username}`}
          </h1>
          {userData?.role && <>
            {(userData?.role === 'admin') && <ThematicForm />}
            {(userData?.role === 'admin') && <TypeOfContentForm />}
            {(userData?.role === 'admin' || userData?.role === 'creator') && <ContentForm />}
            <button
              onClick={handleLogout}
              className="block m-auto px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-800 rounded-md hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              Cerrar sesión
            </button>
          </>}
          {!userData && <>
            <RegisterForm />
            <LoginForm />
          </>}
        </div>
      </div>
      <Outlet />
    </section>
  )
}

