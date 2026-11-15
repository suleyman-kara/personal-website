# Content

Blog posts live here as Markdown. The site reads them at build time (`npm run build`), so a new post goes live with the next deploy.

## Adding a post

1. Pick a slug: lowercase words joined by `-`, for example `feature-selection-notes`. It becomes the URL: `/blog/feature-selection-notes/` (English) and `/tr/blog/feature-selection-notes/` (Turkish).
2. Create `content/blog/<slug>/en.md`, `content/blog/<slug>/tr.md`, or both.
3. Start the file with frontmatter, then write the post in Markdown:

```markdown
---
title: Feature selection notes
date: 2026-11-20
kind: article
summary: One or two sentences shown on the post card, in search results and in link previews.
cover: /images/blog/feature-selection-notes/cover.jpg
youtube: abcDEF12345
tags: [machine-learning, xgboost]
draft: true
---

The post starts here.
```

4. Preview with `npm run dev` (drafts are visible there), then remove `draft: true` (or set it to `false`) to publish.

## Frontmatter

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | Post title. |
| `date` | yes | Publication date, `YYYY-MM-DD`. Posts are listed newest first. |
| `kind` | yes | `article` (long-form, shows reading time, the only kind on the home page), `note` (short), or `video`. |
| `summary` | yes | Short description for cards, the meta description and RSS. |
| `cover` | no | Image path under `public/`, starting with `/`. Used on the card, at the top of the post and as the link-preview image. |
| `youtube` | no | YouTube video id (the 11 characters after `watch?v=`). Shows a player at the top of the post (it loads only after a click). |
| `tags` | no | List of short labels shown under the post. |
| `draft` | no | `true` keeps the post out of production builds; it is still visible in `npm run dev`. |

## Languages

- A post can exist in one language only. It is then listed only in that language, and the language toggle on it goes to the other language's blog page.
- When both files exist, each post links to the other language.

## Images

Put images in `public/images/blog/<slug>/` and reference them from the root: `![Alt text](/images/blog/<slug>/chart.png)`.

## Supported Markdown

GitHub-flavored Markdown: headings, bold, italic, strikethrough, links, lists, task lists, blockquotes, images, tables and fenced code blocks with a language (` ```ts `, ` ```python `, ` ```bash `, ...) for syntax highlighting. `content/blog/markdown-sample/` is a draft that uses all of them; it is for checking styles and never published.

## Videos

`scripts/fetch-youtube.mjs` reads the public feed of youtube.com/@slmnkara into `src/data/youtube.json` (a daily GitHub Action keeps it current; do not edit it by hand). Those videos appear in the blog as `video` cards that open on YouTube, in both languages. To give a video its own page with text, write a post with `kind: video` and `youtube: <id>`: it replaces the imported card in that language.

## When there is nothing to show

With no published posts and no videos, the Blog link is hidden from the header and the Links page, and `/blog/` shows an empty state. The home page "Latest writing" block appears only when there is at least one published `article`.
