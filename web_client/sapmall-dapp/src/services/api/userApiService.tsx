export const userApiService = {
    
  getUserInfo: async (userId: string) => {
    const response = await fetch(`/api/user/info/${userId}`);
    return response.json();
  },
};