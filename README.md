# COSMOS / LAB

A dark, minimalist, static science website designed for GitHub Pages. No build tools, frameworks, paid services, or coding setup are required.

## Files and folders

- `index.html` — the main page structure.
- `styles.css` — colors, layout, and visual design.
- `script.js` — search, topic filters, and Markdown article display.
- `articles/index.json` — the list of articles shown on the site.
- `articles/*.md` — the actual article text that you write and edit.

## Publish on GitHub Pages (beginner steps)

1. Sign in to GitHub, then create a **new public repository** named `cosmos-lab` (or another name you like). You can leave “Add a README” unchecked because this project already includes one.
2. Download and unzip the COSMOS website package on your computer.
3. Open your new repository on GitHub. Choose **Add file → Upload files**.
4. Upload the *contents* of the unzipped `cosmos-website` folder, not the enclosing folder itself. At the repository's top level, you should see `index.html`, `styles.css`, `script.js`, `README.md`, and the `articles` folder.
5. Scroll down and commit the uploaded files to the `main` branch.
6. In your repository, open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**. Set the branch to `main`, choose `/(root)` for the folder, then click **Save**.
8. Wait a few minutes. Return to the Pages settings to find the published URL. It will usually look like `https://YOUR-USERNAME.github.io/cosmos-lab/`.

Official guide: https://docs.github.com/en/pages/quickstart

Note: GitHub Pages sites are public. Do not put passwords, private information, or anything you do not want publicly visible in the repository or articles.

## Add a new article

### 1. Create a Markdown file

In GitHub, open the `articles` folder and choose **Add file → Create new file**. Give it a filename such as `black-holes.md`. Use lowercase letters and hyphens; avoid spaces.

Write the article using the example in `articles/first-research-article.md`. Basic Markdown supported by COSMOS:

- `# Main heading`
- `## Section heading`
- `### Smaller heading`
- A blank line between paragraphs
- `- List item`
- `**bold text**` and `*italic text*`
- `[Link text](https://example.com)`

Commit the file.

### 2. Add it to the article list

Open `articles/index.json`, choose Edit, and add a new object inside the `articles` array. For example:

```json
{
  "title": "How Black Holes Work",
  "file": "black-holes.md",
  "category": "Space",
  "date": "2026-10-22",
  "excerpt": "A short, one-sentence summary of your article.",
  "tags": ["black holes", "gravity", "astronomy"]
}
```

If another article is already in the list, add a comma after the previous object's closing `}`. Do not add a comma after the final object. Keep double quotes around text. Valid categories are `Space`, `Physics`, `Mysteries`, and `Notes` (or any category you add a matching filter for).

Commit the changes. Once GitHub Pages republishes, the article will appear in the library. The website loads the Markdown file when a reader opens that article.

## Edit an existing article

Open `articles/first-research-article.md` (or your article), click the pencil/Edit button, change the text, and commit the changes. You can also edit `articles/index.json` to change its title, category, date, tags, or preview description.

## Local preview

Because the article library uses `fetch()`, do not test by double-clicking `index.html` (the browser may block file access). Easiest first preview: publish to GitHub Pages and use the URL. If you later want a local preview, use a small local web server.

## Notes

- This is a static website: it has no login, server-side database, or private admin panel.
- The repository and published site should be treated as public. Anyone can read your research.
- The starter article is intentionally a writing template; replace it with your own researched content.
