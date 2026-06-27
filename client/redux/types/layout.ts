export interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface Category {
  _id?: string;
  title: string;
}

export interface BannerImage {
  public_id: string;
  url: string;
}

export interface Layout {
  _id: string;
  type: string;
  faq: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

export interface GetLayoutResponse {
  success: boolean;
  layout: Layout;
}

export interface UpdateLayoutResponse {
  success: boolean;
  message: string;
}

export interface LayoutPayload {
  type: "Banner" | "FAQ" | "Categories";
  image?: string;
  title?: string;
  subTitle?: string;
  faq?: FaqItem[];
  categories?: Category[];
}
