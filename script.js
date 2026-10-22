(() => {
  "use strict";
  const grid = document.getElementById("article-grid");
  const search = document.getElementById("search");
  const filters = document.getElementById("filters");
  const count = document.getElementById("article-count");
  const resultCount = document.getElementById("result-count");
  const dialog = document.getElementById("article-dialog");
  const articleContent = document.getElementById("article-content");
  let articles = [];
  let activeFilter = "All";

  // Small Markdown renderer for headings, paragraphs, lists, links, quotes and inline code.
  // Article files are trusted content written by the site owner, not arbitrary user submissions.
  function inlineMarkdown(text) {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }
  function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r/g, "").split("\n");
    const out = [];
    let paragraph = [], list = null, quote = [];
    const flushParagraph = () => { if (paragraph.length) { out.push("<p>" + inlineMarkdown(paragraph.join(" ")) + "</p>"); paragraph = []; } };
    const flushList = () => { if (list) { out.push("</" + list + ">"); list = null; } };
    const flushQuote = () => { if (quote.length) { out.push("<blockquote><p>" + inlineMarkdown(quote.join(" ")) + "</p></blockquote>"); quote = []; } };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushParagraph(); flushList(); flushQuote(); continue; }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) { flushParagraph(); flushList(); flushQuote(); const level = heading[1].length; out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
      if (/^---+$/.test(line)) { flushParagraph(); flushList(); flushQuote(); out.push("<hr>"); continue; }
      if (line.startsWith("> ")) { flushParagraph(); flushList(); quote.push(line.slice(2)); continue; }
      const item = line.match(/^[-*]\s+(.+)$/);
      const ordered = line.match(/^\d+\.\s+(.+)$/);
      if (item || ordered) {
        flushParagraph(); flushQuote();
        const nextList = ordered ? "ol" : "ul";
        if (list !== nextList) { flushList(); list = nextList; out.push("<" + list + ">"); }
        out.push("<li>" + inlineMarkdown((item || ordered)[1]) + "</li>");
        continue;
      }
      flushList(); flushQuote(); paragraph.push(line);
    }
    flushParagraph(); flushList(); flushQuote();
    return out.join("\n");
  }
  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function visibleArticles() {
    const q = search.value.trim().toLowerCase();
    return articles.filter(a => {
      const categoryMatch = activeFilter === "All" || a.category === activeFilter;
      const haystack = [a.title, a.category, a.excerpt, ...(a.tags || [])].join(" ").toLowerCase();
      return categoryMatch && haystack.includes(q);
    });
  }
  function render() {
    const list = visibleArticles();
    resultCount.textContent = `${list.length} ${list.length === 1 ? "article" : "articles"} shown`;
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state"><h3>No matching research yet.</h3><p>Try another search or category. To add an article, create a Markdown file and list it in <code>articles/index.json</code>.</p></div>';
      return;
    }
    grid.innerHTML = list.map(a => `<article class="article-card">
      <div class="card-top"><span class="tag">${escapeHtml(a.category)}</span><span class="card-date">${escapeHtml(a.date || "FIELD NOTES")}</span></div>
      <h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.excerpt)}</p>
      <button class="read-link" data-article="${escapeHtml(a.file)}">READ ARTICLE ↗</button>
    </article>`).join("");
    grid.querySelectorAll("[data-article]").forEach(button => button.addEventListener("click", () => openArticle(button.dataset.article)));
  }
  async function openArticle(file) {
    const item = articles.find(a => a.file === file);
    if (!item) return;
    articleContent.innerHTML = '<p class="muted">Loading article…</p>';
    dialog.showModal();
    try {
      const response = await fetch("articles/" + encodeURIComponent(item.file));
      if (!response.ok) throw new Error("Article file not found");
      const markdown = await response.text();
      articleContent.innerHTML = `<div class="article-meta">${escapeHtml(item.category)} · ${escapeHtml(item.date || "FIELD NOTES")}</div><h1>${escapeHtml(item.title)}</h1><p class="article-lede">${escapeHtml(item.excerpt)}</p><hr>${markdownToHtml(markdown)}`;
    } catch (error) {
      articleContent.innerHTML = `<h1>${escapeHtml(item.title)}</h1><p>This article couldn't be loaded. Check that <code>articles/${escapeHtml(item.file)}</code> exists and is listed correctly in <code>articles/index.json</code>.</p>`;
    }
  }
  filters.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === button));
    render();
  }));
  search.addEventListener("input", render);
  document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
  document.getElementById("dialog-done").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  fetch("articles/index.json")
    .then(response => { if (!response.ok) throw new Error("Could not load article index"); return response.json(); })
    .then(data => {
      articles = Array.isArray(data.articles) ? data.articles : [];
      count.textContent = articles.length;
      render();
    })
    .catch(() => {
      count.textContent = "—";
      grid.innerHTML = '<div class="empty-state"><h3>The library could not be loaded.</h3><p>Make sure <code>articles/index.json</code> is in your repository and open COSMOS through a web server or GitHub Pages, not by double-clicking the file.</p></div>';
    });
})();
