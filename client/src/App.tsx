import { useState } from "react";
import Modal from "./components/Modal";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        className="w-full bg-center bg-cover md:h-[18rem] h-[24rem]"
      >
        <div className="flex p-12 gap-24 items-center justify-center text-center w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white lg:text-4xl">Accede a los mejores contenidos</h1>
            <RegisterForm />
            <LoginForm />
          </div>
        </div>
      </section>
      <main>

        <section className="relative w-full max-w-6xl px-5 py-4 mx-auto rounded-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <input
              type="text"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md  focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Buscar tematica o nombre de contenido"
            />
          </div>
          <div className="rounded-md bg-slate-200 text-w font-medium p-4 mt-4">
            <div className="block ">Existen:</div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="bg-slate-500 text-white p-1 px-2 rounded-md"><span className="font-bold">+100</span> imágenes</div>
              <div className="bg-slate-500 text-white p-1 px-2 rounded-md"><span className="font-bold">+100</span> videos</div>
              <div className="bg-slate-500 text-white p-1 px-2 rounded-md"><span className="font-bold">+100</span> textos</div>
            </div>
            con esta tematica
          </div>
          <section className="bg-white">
            <div className="container px-6 pb-10 mx-auto">
              <div className="grid grid-cols-1 gap-8 mt-4 xl:gap-12 lg:grid-cols-3">
                <div
                  className="flex items-end overflow-hidden bg-cover rounded-lg h-80"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621111848501-8d3634f82336?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1565&q=80')" }}
                >
                  <div className="w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/60">
                    <h2 className="mt-2 text-xl font-semibold  capitalize text-white">
                      Best website collections
                    </h2>
                    <p className="mt-2 text-lg tracking-wideruppercase text-blue-400">
                      Website
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-end overflow-hidden bg-cover rounded-lg h-80"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80')" }}
                >
                  <div className="w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/60">
                    <h2 className="mt-2 text-xl font-semibold capitalize text-white">
                      Block of Ui kit collections
                    </h2>
                    <p className="mt-2 text-lg tracking-wider uppercase text-blue-400">
                      Ui kit
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-end overflow-hidden bg-cover rounded-lg h-80"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80')" }}
                >
                  <div className="w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/60">
                    <h2 className="mt-2 text-xl font-semibold capitalize text-white">
                      Block of Ui kit collections
                    </h2>
                    <p className="mt-2 text-lg tracking-wider uppercase text-blue-400">
                      Ui kit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main >
    </>
  );
}

export default App
