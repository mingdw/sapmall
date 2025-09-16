export interface CategoryTreeResp {
  id: number;
  name: string;
  code: string;
  level: number;
  sort: number;
  parentId: number;
  parentCode: string;
  icon: string;
  attrGroups: AttrGroupResp[];
  children?: CategoryTreeResp[]; // 添加children字段用于层级菜单
}   

export interface AttrGroupResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs: AttrResp[];
}

export interface AttrResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  description: string;
}