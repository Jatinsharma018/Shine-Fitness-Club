const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');
try {
  new Function(js);
  console.log("script.js has NO syntax errors.");
} catch (e) {
  console.error("script.js SYNTAX ERROR:", e);
}
