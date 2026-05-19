import baseClient from './baseClient';

export interface ToggleFavoritePayload {
  productId: number;
  productCode: string;
}

/**
 * 收藏接口预留
 * TODO: 对接真实收藏 API
 */
export const favoriteApi = {
  addFavorite: async (payload: ToggleFavoritePayload): Promise<boolean> => {
    console.info('[favoriteApi] addFavorite (stub)', payload);
    void baseClient;
    return true;
  },
  removeFavorite: async (payload: ToggleFavoritePayload): Promise<boolean> => {
    console.info('[favoriteApi] removeFavorite (stub)', payload);
    void baseClient;
    return true;
  },
};
