import re
with open("index.html") as f:
    html = f.read()
fors = re.findall(r'for=["\']([^"\']+)["\']', html)
ids = re.findall(r'id=["\']([^"\']+)["\']', html)
missing = [f for f in fors if f not in ids]
print("Missing IDs for labels:", missing)
