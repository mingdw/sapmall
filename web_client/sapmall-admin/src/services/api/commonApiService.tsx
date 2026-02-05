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

// 文件信息类型（与后端 types.FileInfo 保持一致）
export interface FileInfo {
  id: number;                    // 主键ID
  hash: string;                  // 文件编码（唯一标识）
  storage_url: string;           // 远端存储实际路径
  url: string;                   // 文件访问URL（永久URL或临时URL）
  original_name: string;          // 原始文件名
  name: string;                  // 存储文件名（不含路径）
  extension: string;              // 文件扩展名（不含点号）
  type: string;                  // 文件类型分类：image、document、video、audio、archive、other
  size: number;                  // 文件大小（字节）
  storage_type: string;           // 存储类型：cos、local等
  business_type: string;          // 业务类型：product、avatar、document等
  business_id: number;            // 关联业务记录ID
  tags?: string;                  // 文件标签（逗号分隔）
  description?: string;           // 文件描述
  metadata?: string;              // 扩展元数据（JSON格式）
  access_type: number;            // 访问类型：1=公开 2=私有 3=受限
  access_url_expire?: string;     // 访问URL过期时间（私有文件）
  view_count: number;             // 查看次数
  download_count: number;          // 下载次数
  status: number;                  // 文件状态：0=待处理 1=正常 2=处理中 3=处理失败 4=已删除
  status_desc?: string;           // 状态描述
  created_at: string;             // 创建时间
  updated_at: string;             // 更新时间
  creator: string;                // 创建人
  updator: string;                // 更新人
  contentType?: string;            // 文件MIME类型（根据extension计算）
}

// 上传文件响应类型
export interface UploadFileResp {
  fileInfo: FileInfo;
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

  // 上传单个文件（使用 admin 接口，需要认证）
  uploadFile: async (
    file: File,
    options?: {
      category?: string; // 文件分类，如：image、document、video等
      folder?: string;   // 存储文件夹路径，如：products、avatars等
    }
  ): Promise<FileInfo> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.category) {
      formData.append('category', options.category);
    }
    if (options?.folder) {
      formData.append('folder', options.folder);
    }

    const response = await baseClient.upload<UploadFileResp>(
      '/api/admin/file/upload',
      formData
    );

    if (response.code === 0 && response.data?.fileInfo) {
      return response.data.fileInfo;
    } else {
      throw new Error(response.message || '文件上传失败');
    }
  },

  // 批量删除文件（使用 admin 接口，需要认证）
  // 支持两种方式：根据hash删除（keys）或根据URL删除（urls）
  deleteFiles: async (options: { keys?: string[]; urls?: string[] }): Promise<void> => {
    const { keys, urls } = options;
    
    if ((!keys || keys.length === 0) && (!urls || urls.length === 0)) {
      return;
    }

    const requestBody: { keys?: string[]; urls?: string[] } = {};
    if (keys && keys.length > 0) {
      requestBody.keys = keys;
    }
    if (urls && urls.length > 0) {
      requestBody.urls = urls;
    }

    const response = await baseClient.post<{ code: number; msg: string }>(
      '/api/admin/file/deletes',
      requestBody
    );

    if (response.code !== 0) {
      throw new Error(response.message || '文件删除失败');
    }
  },
};

export default commonApiService;

