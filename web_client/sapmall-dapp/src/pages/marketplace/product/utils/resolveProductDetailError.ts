import { TFunction } from 'i18next';

export interface ResolvedProductDetailError {
  isNotFound: boolean;
  titleKey: string;
  descKey: string;
}

/** 将后端/网络原始错误转为友好展示（不直接暴露 record not found 等） */
export function resolveProductDetailError(
  error: string | null | undefined,
  t: TFunction
): ResolvedProductDetailError {
  const raw = (error ?? '').toLowerCase();

  const notFoundHints = [
    'record not found',
    'not found',
    '不存在',
    '未找到',
    'no rows',
  ];

  if (!error || notFoundHints.some((h) => raw.includes(h))) {
    return {
      isNotFound: true,
      titleKey: 'productDetail.notFoundTitle',
      descKey: 'productDetail.notFoundDesc',
    };
  }

  return {
    isNotFound: false,
    titleKey: 'productDetail.loadErrorTitle',
    descKey: 'productDetail.loadErrorDesc',
  };
}
