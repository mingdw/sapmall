import re
import sys

def strip_styles(path: str) -> None:
    with open(path, encoding='utf-8') as f:
        t = f.read()
    t = re.sub(r"import styles from '\./DaoHeroCarousel\.module\.scss';\n\n", '', t)
    t = re.sub(r"import styles from '\./DaoTabOverviewCard\.module\.scss';\n", '', t)
    t = t.replace('styles.', '')
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(t)

for p in sys.argv[1:]:
    strip_styles(p)
