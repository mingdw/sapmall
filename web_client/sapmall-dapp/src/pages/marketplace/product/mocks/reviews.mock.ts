export interface ProductReviewMock {
  id: number;
  userName: string;
  rating: number;
  date: string;
  specs: string;
  content: string;
  images?: string[];
}

export const MOCK_REVIEWS: ProductReviewMock[] = [
  {
    id: 1,
    userName: '0x71C7...970F',
    rating: 5,
    date: '2024-03-15',
    specs: '规格：标准版 · 中文',
    content: '商品质量非常好，交付及时，很满意的一次购物体验！',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=80&h=80&fit=crop',
    ],
  },
  {
    id: 2,
    userName: '0x2B5A...D6cF',
    rating: 4,
    date: '2024-03-14',
    specs: '规格：专业版 · 中文',
    content: '商品不错，性价比很高，整体满意。',
  },
  {
    id: 3,
    userName: '0x8F3E...A2B9',
    rating: 5,
    date: '2024-03-13',
    specs: '规格：标准版 · English',
    content: '课程内容详细，讲解清晰，项目实战很有帮助。',
  },
  {
    id: 4,
    userName: '0x4D7C...E5F1',
    rating: 5,
    date: '2024-03-12',
    specs: '规格：旗舰版',
    content: '非常棒的学习体验，循序渐进。',
  },
  {
    id: 5,
    userName: '0x9A6B...C3D8',
    rating: 4,
    date: '2024-03-11',
    specs: '规格：标准版',
    content: '质量很高，希望增加更多练习题。',
  },
  {
    id: 6,
    userName: '0x1E5F...B7A4',
    rating: 5,
    date: '2024-03-10',
    specs: '规格：专业版',
    content: '超值的课程，内容丰富。',
  },
  {
    id: 7,
    userName: '0x7C2A...F9E6',
    rating: 5,
    date: '2024-03-09',
    specs: '规格：专业版',
    content: '课程设计很棒，强烈推荐！',
  },
  {
    id: 8,
    userName: '0x3B8D...A1C5',
    rating: 4,
    date: '2024-03-08',
    specs: '规格：标准版',
    content: '很好的入门课程，适合初学者。',
  },
  {
    id: 9,
    userName: '0x6F4E...D2B7',
    rating: 5,
    date: '2024-03-07',
    specs: '规格：旗舰版',
    content: '老师经验丰富，讲解生动有趣。',
  },
  {
    id: 10,
    userName: '0x5A9C...E8F3',
    rating: 5,
    date: '2024-03-06',
    specs: '规格：专业版',
    content: '非常满意的学习体验，内容丰富。',
  },
];
