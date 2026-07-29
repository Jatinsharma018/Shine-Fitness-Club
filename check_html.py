import re
from collections import Counter
with open("index.html") as f:
    html = f.read()
ids = re.findall(r'id=["\']([^"\']+)["\']', html)
duplicates = [item for item, count in Counter(ids).items() if count > 1]
print("Duplicate IDs:", duplicates)
