export interface GetAllArticlesAPI {
  data: IArticle[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface Metadata {
  duration: string;
  views: string;
  uploadDate: string;
  source: string;
  icon: string;
}

export interface IArticle {
  _id: string;
  baseUrl: string;
  url: string;
  title: string;
  dateText: string;
  date: Date;
  teaser: string;
  generatedTeaser: string;
  type: string;
  originalContent: string;
  __v: number;
  generatedContent: string;
  image?: string;
  imageLocal?: string;
  googleImage?: string;
  metadata?: Metadata;
}
