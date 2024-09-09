import { IContentItem } from '../interface'
import { normalizeImageUrl } from '../utils'
interface ICardProps {
  element: IContentItem;
  handleCardClick: (id: string) => void;
}

export const Card: React.FC<ICardProps> = ({ element, handleCardClick }) => {
  return (
    <div
      onClick={() => handleCardClick(element._id)}
      key={element._id}
      className="flex items-end cursor-pointer overflow-hidden bg-cover rounded-lg h-80 border shadow-xl"
      style={{ backgroundImage: `url(${normalizeImageUrl(element.category.imageUrl)})` }}
    >
      <div className="w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/75">
        <h2 className=" text-xl font-semibold  capitalize text-white">
          {element.name}
        </h2>
        <p className="text-lg tracking-wider uppercase text-blue-300">
          {element.category.name}
        </p>
        <p className=" text-lg tracking-wider  text-blue-300">
          creditos: {element.creator.username}
        </p>
      </div>
    </div>
  )
}
