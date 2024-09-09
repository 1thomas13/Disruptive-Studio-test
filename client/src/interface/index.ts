export interface ICreator {
  _id: string;
  username: string;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  __v: number;
  contentTypes: string[]; 
}

export interface IContentType {
  _id: string;
  name: string;
  isUrl: boolean;
  isDocument: boolean;
  isImage: boolean;
  fileExtension: string;
  domain: string;
  description: string;
}
export interface IContentItem {
  _id: string;
  name: string;
  imageUrl: string;
  category: ICategory;
  creator: ICreator;
  username: string;
  description: string;
  urls: string[];
  files: string[];
}