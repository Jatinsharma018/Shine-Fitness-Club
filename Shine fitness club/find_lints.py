import re

with open("index.html") as f:
    lines = f.readlines()

errors = []
for i, line in enumerate(lines):
    line_lower = line.lower()
    
    # Check for img without alt
    if "<img" in line_lower and "alt=" not in line_lower:
        errors.append(f"Line {i+1}: img without alt")
        
    # Check for script with type="text/javascript" (often flagged)
    if "<script" in line_lower and "type=\"text/javascript\"" in line_lower:
        errors.append(f"Line {i+1}: script with type=text/javascript")
        
    # Check for trailing slashes in void elements if strict (br/> hr/>)
    # Actually HTML5 doesn't care, but some linters do.

    # Check for button without type
    if "<button" in line_lower and "type=" not in line_lower:
        errors.append(f"Line {i+1}: button without type")

    # empty href
    if "href=\"\"" in line_lower or "href=''" in line_lower:
        errors.append(f"Line {i+1}: empty href")

    # a tag with javascript:void(0)
    if "href=\"javascript:void(0)\"" in line_lower:
        errors.append(f"Line {i+1}: javascript:void(0) href")

print(f"Total found: {len(errors)}")
for e in errors:
    print(e)
