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