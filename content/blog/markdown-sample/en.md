---
title: Markdown sample
date: 2026-11-15
kind: article
summary: A styling test page that uses every Markdown feature the blog supports. Not a real post.
cover: /og.jpg
youtube: Pz2Imu23ps8
tags: [sample, markdown]
draft: true
---

This draft exists to check post styling in both themes. It is never published while `draft: true` is set. Paragraphs carry **bold text**, *italic text*, ~~strikethrough~~, `inline code` and [a link to the projects page](/projects/), plus [an external link](https://github.com/suleyman-kara).

## Second-level heading

A short paragraph under a second-level heading, long enough to wrap onto a second line at most widths so the line height can be judged.

### Third-level heading

- An unordered list item
- Another item with `code` inside
  - A nested item
  - A second nested item
- A last item

1. First ordered item
2. Second ordered item
3. Third ordered item

- [x] A finished task
- [ ] An open task

> A blockquote. It can hold **bold** text and span more than one line when the text is long enough to wrap.

![The default social image of the site](/og.jpg)

| Feature | Supported | Notes |
| :------ | :-------: | ----: |
| Tables | Yes | aligned columns |
| Code blocks | Yes | highlighted |
| Images | Yes | from `public/` |

```ts
// TypeScript with syntax highlighting
type Kind = 'article' | 'note' | 'video';

export function label(kind: Kind): string {
  return kind === 'article' ? 'Article' : kind[0].toUpperCase() + kind.slice(1);
}
```

```python
def mape(actual, predicted):
    pairs = [(a, p) for a, p in zip(actual, predicted) if a != 0]
    return sum(abs((a - p) / a) for a, p in pairs) / len(pairs)
```

```bash
npm run build
```

```
Plain fenced block without a language.
```

---

#### Fourth-level heading

The end of the sample.
