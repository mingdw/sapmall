import re
import sys

# Turn className={fooBar} into className="fooBar" when fooBar is not a known expression
EXPR_PREFIX = ('overview', 'hero', 'trending', 'discussion')

def fix_file(path: str) -> None:
    with open(path, encoding='utf-8') as f:
        t = f.read()
    def repl(m: re.Match) -> str:
        name = m.group(1)
        if name.startswith('`') or '.' in name or '?' in name or '$' in name:
            return m.group(0)
        if not name[0].islower():
            return m.group(0)
        if not any(name.startswith(p) for p in EXPR_PREFIX):
            return m.group(0)
        return f'className="{name}"'

    t = re.sub(r'className=\{([a-zA-Z][a-zA-Z0-9_]*)\}', repl, t)
    # Fix template pieces like ${heroSlideTitle} -> keep as is if already in template
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(t)

for p in sys.argv[1:]:
    fix_file(p)
