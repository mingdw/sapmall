import baseClient from './baseClient';

// 定义类型
export interface CategoryTreeResp {
  id: number;
  name: string;
  code: string;
  level: number;
  sort: number;
  parentId: number;
  icon: string;
  attrGroups?: AttrGroupResp[];
  children?: CategoryTreeResp[];
}

export interface AttrGroupResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs?: AttrResp[];
}

export interface AttrResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  description: string;
  groupId?: number;
}

// 文件信息类型
export interface FileInfo {
  id: number;
  hash: string;
  storageUrl: string;
  url: string;
  originalName: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  storageType: string;
  businessType: string;
  businessId: number;
  tags: string;
  description: string;
  metadata: string;
  accessType: number;
  accessUrlExpire: string;
  viewCount: number;
  downloadCount: number;
  status: number;
  statusDesc: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  updator: string;
  contentType: string;
}

// 上传文件选项
export interface UploadFileOptions {
  category?: string;     // 文件分类，可选值：image、document、video、audio、archive、other
  folder?: string;       // 存储文件夹路径，如：products、avatars、documents等
  businessType?: string; // 业务类型：product、avatar、document等（用于关联业务）
  businessId?: string;   // 关联业务记录ID（用于关联业务）
}

// 删除文件选项
export interface DeleteFilesOptions {
  keys?: string[];         // 文件hash数组（用于根据hash删除）
  urls?: string[];         // 文件URL数组（用于根据URL删除）
  businessType?: string;   // 业务类型：product、avatar、document等
  businessId?: string;     // 关联业务记录ID
}

export const commonApiService = {
  // 获取目录树结构
  getCategoryTree: async (categoryType: number): Promise<CategoryTreeResp[]> => {
    const response = await baseClient.get<CategoryTreeResp[]>(
      `/api/common/${categoryType}/categories`,
      {
        skipAuth: true, // 获取目录树结构不需要认证
      }
    );
    
    // baseClient返回的是ApiResponse<T>，我们需要返回data字段
    return response.data;
  },

  // 上传文件
  uploadFile: async (file: File, options: UploadFileOptions = {}): Promise<FileInfo> => {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.category) {
      formData.append('category', options.category);
    }
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.businessType) {
      formData.append('businessType', options.businessType);
    }
    if (options.businessId) {
      formData.append('businessId', options.businessId);
    }

    // 调用上传接口
    const response = await baseClient.upload<{ fileInfo: FileInfo }>(
      '/api/admin/file/upload',
      formData
    );

    // 检查响应
    if (response.code !== 0) {
      throw new Error(response.message || '文件上传失败');
    }

    if (!response.data?.fileInfo) {
      throw new Error('上传响应数据格式错误');
    }

    return response.data.fileInfo;
  },

  // 批量删除文件
  deleteFiles: async (options: DeleteFilesOptions): Promise<void> => {
    const response = await baseClient.post<null>(
      '/api/admin/file/deletes',
      {
        keys: options.keys,
        urls: options.urls,
        businessType: options.businessType,
        businessId: options.businessId,
      }
    );

    // 检查响应
    if (response.code !== 0) {
      throw new Error(response.message || '文件删除失败');
    }
  },
};

export default commonApiService;

