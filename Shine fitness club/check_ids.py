import re
from collections import Counter
with open("index.html") as f:
    text = f.read()
ids = re.findall(r'\bid\s*=\s*[\"\']([^\"\']+)[\"\']', text)
counts = Counter(ids)
duplicates = {k: v for k, v in counts.items() if v > 1}
print("Duplicate IDs:", duplicates)
