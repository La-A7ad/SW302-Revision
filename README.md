# UI Development MCQ Quiz Site

A self-hosted MCQ platform for your UI Development lectures. Open `index.html` to pick a lecture and take its quiz.

## Files
- `index.html` — homepage listing all lectures
- `quiz.html` — quiz template that loads a JSON via `?file=...`
- `style.css` — basic styles
- `script.js` — quiz logic
- `*.json` — one questions file per lecture

## Run locally
Some browsers block `fetch` for local files. If JSON fails to load, start a tiny static server:

**Python 3**
```bash
cd ui-dev-mcq-site
python -m http.server 5500
# then open http://localhost:5500/index.html
```

**VS Code**: use the Live Server extension and open `index.html`.

