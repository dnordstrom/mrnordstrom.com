# MrNordstrom.com

The `gh-pages` branch hosts the current version of the blog, powered by [Polestar](https://github.com/dnordstrom/polestar).

Polestar is a tiny (400 lines at 10 KB with full JSDoc style comments before minification) client-side MultiMarkdown GitHub content platform created for powering this blog. It renders Markdown formatted articles fetched using the GitHub API, as well as simple local partials.

The purpose of Polestar is to be tiny, quick, and extremely simple to work with—a fast and easy way to create something useful with Markdown. Future development will hopefully improve extensibility and flexibility (the plugin mechanism, for instance).

## Features

* Fully client-side and JavaScript powered (backendless and unhosted)
* Article autoload on scroll (one article is loaded on page load unless `loadAll: true`)
* Article permalinks based on filename (`article.md` becomes `http://example.com#article`)
* Articles can be linked to, despite dynamic loading (visiting `http://example.com#article` loads articles until reaching `#article`, then scrolls to it)
* Partials into any element by specifying Markdown file in `data-at` attribute (`<header data-at="intro"></header>` parses and outputs `/intro.md`).
* Static site generator for generating search engine friendly HTML is under development.
* No dependencies.