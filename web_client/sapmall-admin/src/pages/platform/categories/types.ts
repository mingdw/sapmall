export interface Attribute {
  id: number;
  name: string;
  code: string;
  type: number;
  status: number;
  groupId?: number;
  description: string;
  sort: number;
}

export interface AttributeGroup {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs?: Attribute[];
}

export interface Category {
  id: number;
  name: string;
  code: string;
  level: number;
  sort: number;
  parentId: number;
  icon?: string;
  children?: Category[];
  attrGroups?: AttributeGroup[];
}

