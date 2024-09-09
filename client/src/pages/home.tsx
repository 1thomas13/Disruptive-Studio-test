import { useEffect, useState } from "react";
import ContentCounter from "../components/ContentCounter";
import { apiClient } from "../utils";
import { ContentModal } from "../components/modal/ContentModal";
import { ICategory, IContentItem } from "../interface";
import Card from "../components/Card";

function Home() {
  const [content, setContent] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredContent, setFilteredContent] = useState<IContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [content, categories] = await Promise.all([apiClient('/content'), apiClient('/categories')])
      console.log(content, categories)
      setContent(content.data)
      setFilteredContent(content.data);
      setCategories(categories.data)
    })();
  }, []);

  useEffect(() => {
    const filtered = content.filter((item: IContentItem) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!selectedCategory) return item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) || matchesSearch
      const matchesCategory = selectedCategory ? item.category._id === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    setFilteredContent(filtered);
  }, [searchTerm, selectedCategory, content]);

  const handleCardClick = (id: string) => {
    setSelectedContent(id);
    setModalOpen(true);
  };

  return (
    <>
      <main>
        <ContentModal contentId={selectedContent} isModalOpen={modalOpen} setIsModalOpen={setModalOpen} />
        <section className="relative w-full max-w-6xl px-5 py-4 mx-auto rounded-md">
          <div className="flex">
            <div className="relative flex-1">
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
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                placeholder="Buscar temática o nombre de contenido"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="ml-4 py-3 pl-4 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-md bg-slate-200 text-w font-medium p-4 mt-4">
            <ContentCounter selectedCategory={selectedCategory} categoryName={categories?.find(category => category._id === selectedCategory)?.name || ''} />
          </div>
          <section className="bg-white">
            <div className="container px-6 pb-10 mx-auto">
              <div className="grid grid-cols-1 gap-8 mt-4 xl:gap-12 lg:grid-cols-3">
                {filteredContent.length > 0 && filteredContent.map(element => (
                  <Card element={element} handleCardClick={handleCardClick} />
                ))}
              </div>
            </div>
          </section>
        </section>
      </main >
    </>
  );
}

export default Home
