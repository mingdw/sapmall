import { baseClient } from './baseClient';
import { Category, FAQ, GuideStep } from '../../pages/help/helpData';

// 帮助中心相关API服务
export const helpApiService = {
  // 获取快速导航分类列表
  getCategories: async (): Promise<Category[]> => {
    try {
      // 这里应该是真实的API调用
      // const response = await baseClient.get('/api/help/categories');
      // return response.data;
      
      // 暂时使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 300));
      const { categories } = await import('../../pages/help/helpData');
      return categories;
    } catch (error) {
      console.error('获取帮助分类失败:', error);
      throw error;
    }
  },

  // 获取常见问题列表
  getFAQs: async (): Promise<FAQ[]> => {
    try {
      // 这里应该是真实的API调用
      // const response = await baseClient.get('/api/help/faqs');
      // return response.data;
      
      // 暂时使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 200));
      const { faqs } = await import('../../pages/help/helpData');
      return faqs;
    } catch (error) {
      console.error('获取常见问题失败:', error);
      throw error;
    }
  },

  // 获取新手指南步骤
  getGuideSteps: async (): Promise<GuideStep[]> => {
    try {
      // 这里应该是真实的API调用
      // const response = await baseClient.get('/api/help/guide-steps');
      // return response.data;
      
      // 暂时使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 400));
      const { guideSteps } = await import('../../pages/help/helpData');
      return guideSteps;
    } catch (error) {
      console.error('获取新手指南失败:', error);
      throw error;
    }
  },

  // 搜索帮助内容
  searchHelpContent: async (query: string): Promise<(Category | FAQ | GuideStep)[]> => {
    try {
      // 这里应该是真实的API调用
      // const response = await baseClient.get('/api/help/search', { params: { q: query } });
      // return response.data;
      
      // 暂时使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 500));
      const { categories, faqs, guideSteps } = await import('../../pages/help/helpData');
      
      // 模拟搜索功能
      const lowerQuery = query.toLowerCase();
      const results: (Category | FAQ | GuideStep)[] = [];

      if (lowerQuery) {
        // 搜索分类
        results.push(...categories.filter(cat => 
          cat.title.toLowerCase().includes(lowerQuery) || 
          cat.description.toLowerCase().includes(lowerQuery)
        ));

        // 搜索FAQ
        results.push(...faqs.filter(faq => 
          faq.question.toLowerCase().includes(lowerQuery) || 
          faq.answer.toLowerCase().includes(lowerQuery)
        ));

        // 搜索指南
        results.push(...guideSteps.filter(step => 
          step.title.toLowerCase().includes(lowerQuery) || 
          step.description.toLowerCase().includes(lowerQuery)
        ));
      }

      return results;
    } catch (error) {
      console.error('搜索帮助内容失败:', error);
      throw error;
    }
  }
};