# Generator for insert_product_skus_from_spec_attrs.sql — run from repo root:
#   python backend_service/scripts/gen_product_skus.py
import json
import re
from itertools import product
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "docs"
SEED = ROOT / "saphire_mall_data.sql"
OUT = ROOT / "sql" / "insert_product_skus_from_spec_attrs.sql"
SKU_ID_START = 10000
SKIP_SPU_CODES = {"SPU00000129"}

SPU_RE = re.compile(
    r"INSERT INTO `sys_product_spu` VALUES \((\d+), '([^']+)', '((?:[^'\\]|\\.)*)',"
)
SPEC_RE = re.compile(
    r"INSERT INTO `sys_product_spu_attr_params` VALUES \(\d+, (\d+), '([^']+)', 'SPEC_ATTRS',"
    r"[^,]*,[^,]*,[^,]*, '(\{.*?\})',"
    r"[^,]*,[^,]*,[^,]*, (\d+),"
)


def parse_stock_price(line: str) -> tuple[float, int]:
    m = re.search(r", \d+, (\d+), '[^']*', '[^']*', ([\d.]+),", line)
    return (float(m.group(2)), int(m.group(1))) if m else (0.0, 0)


def sql_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "''") + "'"


def parse_spec_json(raw: str) -> dict:
    return json.loads(raw.replace('\\"', '"'))


def main() -> None:
    text = SEED.read_text(encoding="utf-8")
    spus: dict[int, dict] = {}
    for line in text.splitlines():
        if "INSERT INTO `sys_product_spu`" not in line:
            continue
        m = SPU_RE.search(line)
        if not m:
            continue
        price, stock = parse_stock_price(line)
        img_m = re.search(r", 1, '([^']*)', '20", line)
        spus[int(m.group(1))] = {
            "id": int(m.group(1)),
            "code": m.group(2),
            "name": m.group(3).replace("\\'", "'"),
            "price": price,
            "total_stock": stock,
            "images": img_m.group(1) if img_m else "",
        }

    specs: dict[int, dict] = {}
    for line in text.splitlines():
        if "'SPEC_ATTRS'" not in line:
            continue
        m = SPEC_RE.search(line)
        if not m or int(m.group(4)) != 0:
            continue
        spu_id = int(m.group(1))
        code = m.group(2)
        spu = spus.get(spu_id)
        if not spu or spu["code"] != code:
            continue
        try:
            spec_obj = parse_spec_json(m.group(3))
        except json.JSONDecodeError:
            continue
        if isinstance(spec_obj, dict) and spec_obj:
            specs[spu_id] = spec_obj

    lines = [
        "-- =============================================================================",
        "-- Sapphire Mall：根据 SPEC_ATTRS 笛卡尔积生成 sys_product_sku",
        "-- 源：backend_service/docs/saphire_mall_data.sql",
        "-- 生成：python backend_service/scripts/gen_product_skus.py",
        "-- 跳过 SPU00000129（种子已有 SKU 90/92）；无 SPEC 的 SPU（如 127/128）不生成",
        "-- 可选清理：DELETE FROM sys_product_sku WHERE id >= 10000;",
        "-- =============================================================================",
        "SET NAMES utf8mb4;",
        "START TRANSACTION;",
    ]

    sku_id = SKU_ID_START
    spu_count = sku_count = 0
    rows: list[str] = []

    for spu_id in sorted(spus):
        spu = spus[spu_id]
        if spu["code"] in SKIP_SPU_CODES:
            continue
        spec = specs.get(spu_id)
        if not spec:
            continue
        keys = list(spec.keys())
        value_lists = [
            spec[k] if isinstance(spec[k], list) else [spec[k]] for k in keys
        ]
        combos = list(product(*value_lists))
        n = len(combos)
        if n == 0:
            continue
        spu_count += 1
        per_stock = max(1, spu["total_stock"] // n) if spu["total_stock"] > 0 else 10
        img = spu["images"].split(",")[0].strip() if spu["images"] else ""
        images_json = sql_str(json.dumps([img] if img else [], ensure_ascii=False))

        for combo in combos:
            indices = [value_lists[i].index(combo[i]) for i in range(len(keys))]
            indexs = "_".join(str(i) for i in indices)
            attr = json.dumps(
                {keys[i]: combo[i] for i in range(len(keys))}, ensure_ascii=False
            )
            title = f"{spu['name']} {' '.join(str(v) for v in combo)}".strip()
            sku_code = f"{spu['code']}-{indexs}"
            rows.append(
                f"INSERT INTO `sys_product_sku` VALUES ("
                f"{sku_id}, {spu_id}, {sql_str(spu['code'])}, {sql_str(sku_code)}, "
                f"{spu['price']:.2f}, {per_stock}, 0, 1, {sql_str(indexs)}, "
                f"{sql_str(attr)}, '', {images_json}, "
                f"{sql_str(title)}, '', '', "
                f"'2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');"
            )
            sku_id += 1
            sku_count += 1

    lines.append(
        f"-- 统计：{spu_count} 个 SPU，{sku_count} 条 SKU（id {SKU_ID_START}..{sku_id - 1}）"
    )
    lines.extend(rows)
    lines.extend(["COMMIT;", f"-- DONE: {spu_count} SPUs, {sku_count} SKUs"])
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}: {spu_count} SPUs, {sku_count} SKUs")


if __name__ == "__main__":
    main()
