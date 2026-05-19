import {
  AfterSaleJson,
  PackingListJson,
  ProductDetailContentView,
  ProductDetailView,
  ProductSkuView,
  ProductSpuView,
} from '../types/productDetailTypes';
import { resolveMarketingTags } from '../mocks/marketingTags.mock';

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === 'object') return raw as T;
  if (typeof raw !== 'string' || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseImageUrls(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean) as string[];
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed) return [];
    try {
      if (trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      }
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapSpu(spu: Record<string, unknown>): ProductSpuView {
  return {
    id: Number(spu.id ?? 0),
    code: String(spu.code ?? ''),
    name: String(spu.name ?? ''),
    description: String(spu.description ?? ''),
    category1Id: Number(spu.category1Id ?? 0),
    category1Code: String(spu.category1Code ?? ''),
    category2Id: Number(spu.category2Id ?? 0),
    category2Code: String(spu.category2Code ?? ''),
    category3Id: Number(spu.category3Id ?? 0),
    category3Code: String(spu.category3Code ?? ''),
    brand: String(spu.brand ?? ''),
    price: Number(spu.price ?? 0),
    realPrice: Number(spu.realPrice ?? 0),
    totalSales: Number(spu.totalSales ?? 0),
    totalStock: Number(spu.totalStock ?? 0),
    status: Number(spu.status ?? 0),
    images: parseImageUrls(spu.images),
  };
}

function mapSku(sku: Record<string, unknown>): ProductSkuView {
  return {
    id: Number(sku.id ?? 0),
    skuCode: String(sku.skuCode ?? ''),
    price: Number(sku.price ?? 0),
    stock: Number(sku.stock ?? 0),
    saleCount: Number(sku.saleCount ?? 0),
    indexs: String(sku.indexs ?? ''),
    images: parseImageUrls(sku.images),
    title: sku.title ? String(sku.title) : undefined,
  };
}

function extractAttrObject(
  params: Array<Record<string, unknown>>,
  attrType: number,
  codeHint?: string
): Record<string, unknown> {
  const item =
    params.find((p) => p.attrType === attrType && (!codeHint || p.code === codeHint)) ||
    params.find((p) => p.attrType === attrType);
  if (!item?.value) return {};
  return parseJson<Record<string, unknown>>(item.value, {});
}

function extractSpecifications(
  params: Array<Record<string, unknown>>
): Record<string, string[]> {
  const specObj = extractAttrObject(params, 3, 'SPEC_ATTRS');
  const result: Record<string, string[]> = {};
  Object.entries(specObj).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      result[key] = val.map(String);
    } else if (val != null) {
      result[key] = [String(val)];
    }
  });
  return result;
}

function buildSpecTableRows(
  basic: Record<string, unknown>,
  sale: Record<string, unknown>,
  spu: ProductSpuView
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];
  const pushEntries = (obj: Record<string, unknown>) => {
    Object.entries(obj).forEach(([k, v]) => {
      if (v != null && String(v).trim()) {
        rows.push({ label: k, value: String(v) });
      }
    });
  };
  pushEntries(basic);
  pushEntries(sale);
  if (!rows.length) {
    rows.push(
      { label: '品牌', value: spu.brand || '-' },
      { label: '销量', value: String(spu.totalSales) },
      { label: '库存', value: String(spu.totalStock) }
    );
  }
  return rows;
}

function mapDetails(detailRaw: Record<string, unknown> | null | undefined): ProductDetailContentView {
  if (!detailRaw) {
    return { detailHtml: '', packingList: null, afterSale: null };
  }
  const packingList = parseJson<PackingListJson | null>(detailRaw.packingList, null);
  const afterSale = parseJson<AfterSaleJson | null>(detailRaw.afterSale, null);
  return {
    detailHtml: String(detailRaw.detail ?? ''),
    packingList: packingList?.title ? packingList : null,
    afterSale,
  };
}

/** 将 getProductDetails 返回的 data 规范为前端视图模型 */
export function parseProductDetailPayload(raw: unknown): ProductDetailView | null {
  if (!raw || typeof raw !== 'object') return null;

  const data = raw as Record<string, unknown>;
  const spuRaw = (data.SPU ?? data.spu ?? data.sPU) as Record<string, unknown> | undefined;
  if (!spuRaw) return null;

  const spu = mapSpu(spuRaw);
  const skusRaw = (data.SKUs ?? data.skus ?? data.sKUs ?? []) as Array<Record<string, unknown>>;
  const skus = skusRaw.map(mapSku);
  const params = (data.SPUAttrParams ?? data.spuAttrParams ?? []) as Array<Record<string, unknown>>;
  const detailRaw = (data.SPUDetail ?? data.spuDetail ?? data.sPUDetail) as Record<string, unknown> | undefined;

  const basicAttrs = extractAttrObject(params, 1, 'BASIC_ATTRS') as Record<string, string>;
  const saleAttrs = extractAttrObject(params, 2, 'SALE_ATTRS') as Record<string, string>;
  const specifications = extractSpecifications(params);

  return {
    spu,
    skus,
    specifications,
    basicAttrs: basicAttrs as Record<string, string>,
    saleAttrs: saleAttrs as Record<string, string>,
    specTableRows: buildSpecTableRows(
      basicAttrs as Record<string, unknown>,
      saleAttrs as Record<string, unknown>,
      spu
    ),
    details: mapDetails(detailRaw),
    marketingTags: resolveMarketingTags(spu),
    rating: 4.5 + (spu.id % 5) * 0.1,
    reviewCount: 128,
  };
}
