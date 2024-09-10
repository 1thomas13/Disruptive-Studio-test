import { normalizeImageUrl } from '../utils';
import { IContentItem } from '../interface';

interface ICardProps {
  element: IContentItem;
  handleCardClick: (id: string) => void;
}

function Card({ element, handleCardClick }: ICardProps) {
  const imageUrl = normalizeImageUrl(element.category.imageUrl);

  return (
    <div
      onClick={() => handleCardClick(element._id)}
      key={element._id}
      className="flex items-end cursor-pointer overflow-hidden bg-cover rounded-lg h-80 border shadow-xl"
      style={{
        backgroundImage: `url("${encodeURI(imageUrl)}")`
      }}
    >
      <div className="w-full px-8 py-2 overflow-hidden rounded-b-lg backdrop-blur-sm bg-gray-800/75">
        <h2 className="text-xl font-semibold capitalize text-white">
          {element.name}
        </h2>
        <p className="text-lg tracking-wider uppercase text-blue-300">
          {element.category.name}
        </p>
        <p className="text-lg tracking-wider text-blue-300">
          Créditos: {element.creator.username}
        </p>
      </div>
    </div>
  );
}

export default Card;
