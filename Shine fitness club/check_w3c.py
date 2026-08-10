import urllib.request
import json
with open("index.html", "rb") as f:
    data = f.read()
req = urllib.request.Request("https://validator.w3.org/nu/?out=json", data=data, headers={"Content-Type": "text/html; charset=utf-8"})
with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode("utf-8"))
    errors = [m for m in result["messages"] if m["type"] == "error"]
    print("Total W3C errors in index.html: " + str(len(errors)))
    for i, e in enumerate(errors):
        print(str(i+1) + ". Line " + str(e.get("lastLine")) + ": " + str(e.get("message")))
