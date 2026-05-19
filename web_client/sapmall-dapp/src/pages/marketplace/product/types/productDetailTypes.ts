export interface ProductSkuView {
  id: number;
  skuCode: string;
  price: number;
  stock: number;
  saleCount: number;
  indexs: string;
  images: string[];
  title?: string;
}

export interface ProductSpuView {
  id: number;
  code: string;
  name: string;
  description: string;
  category1Id: number;
  category1Code: string;
  category2Id: number;
  category2Code: string;
  category3Id: number;
  category3Code: string;
  brand: string;
  price: number;
  realPrice: number;
  totalSales: number;
  totalStock: number;
  status: number;
  images: string[];
}

export interface ProductDetailContentView {
  detailHtml: string;
  packingList: PackingListJson | null;
  afterSale: AfterSaleJson | null;
}

export interface PackingListJson {
  title: string;
  items: string[];
}

export interface AfterSaleJson {
  promises?: Array<{ icon?: string; title: string; desc: string }>;
  rights?: string[];
  policies?: Array<{ title: string; content: string }>;
  contacts?: Array<{ type: string; value: string }>;
}

export interface ProductDetailView {
  spu: ProductSpuView;
  skus: ProductSkuView[];
  specifications: Record<string, string[]>;
  basicAttrs: Record<string, string>;
  saleAttrs: Record<string, string>;
  specTableRows: Array<{ label: string; value: string }>;
  details: ProductDetailContentView;
  marketingTags: string[];
  rating: number;
  reviewCount: number;
}

export interface ProductDetailLocationState {
  /** 从列表「立即购买」进入时标记，详情页可滚动到购买区 */
  buyIntent?: boolean;
  categoryName?: string;
  subcategoryName?: string;
}
