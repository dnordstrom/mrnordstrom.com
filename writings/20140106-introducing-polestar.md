# Polestar 0.0.1 Powered

As a creator, you know it. You know that urge. We all do.

In your mind is a perfect picture of what you want. Yet, as you look around, nothing hits your smile button. Your mind sighs. It then utters those horrifying, familiar words, "but that shouldn't take long to create," and it's game over---you've just signed off on the brutal assassination of God knows how many days, weeks, or years of your life.

**[Polestar](https://github.com/dnordstrom/polestar)** is a child of this beautiful process. It's the tiny Markdown site authoring and blogging tool in JavaScript that powers this site. It's GitHub flavored and fully client-side, with a simple purpose: to fetch Markdown from local files and a GitHub repository, parse it, and slap it on a page.

It weighs in at around 600 lines fully commented and wrapped hard at 70 columns. The idea is to keep it tiny and modular (preferably no larger than 500 lines), and further develop the plugin mechanism.

Keep in mind, though, that a purely client-side solution has major drawbacks. It's not search engine friendly and can't offer RSS feeds. However, a Polestar static site and feed generator is in development to scratch this itch.

**Note:** This is alpha software. It may not work, it will definitely change, and documentation is a work in progress.

## Features & Notes

- Load writings from GitHub, and partials from local files
- Specify GitHub repository, branch, and directory
- Markdown parsed by GitHub API
- Articles autoload on scroll (can be disabled)
- Articles linkable despite dynamic loading (e.g. `example.com#the-filename` loads next until reaching article in location hash)
- Caching in sessionStorage (avoid GitHub API rate-limit)
- Preview local, unpublished article using "draft" preference (e.g. `draft: 'writings/20140106-new-article'`)
- Plugins (with `beforeRender` or `afterRender` methods)
- Example plugins included
- Example site included (with theme)

Polestar has no dependencies, but requires a browser that supports things like `XMLHttpRequest` and `document.querySelector`.

**Note:** When previewing a local article, keep in mind GitHub's rate limit of 60 unauthenticated requests per hour (the API is used to parse the Markdown).

## Usage by Example

This site uses the following script tag to create a Polestar instance that appends my writings to the `<section class="writings">` element:

```html
<script>
  new Polestar({
    repo: 'dnordstrom/mrnordstrom.com/writings',
    branch: 'gh-pages',
    into: '.writings',
    plugins: [
      Polestar.Mailto,
      Polestar.Permalinks,
      Polestar.Prism,
      Polestar.Typogr
    ]
  })
</script>
```

It uses a partial for the header bit. This is just a matter of specifying the local Markdown file in the element's `data-at` attribute:

```html
<header data-at="about" class="about">
  <!-- Renders /about.md here -->
</header>
```

If this partial was residing instead in a subdirectory named "partials," we'd simply use `data-at="partials/about"`.

## Roadmap

* **~~Draft preview feature~~**<br>This could be a `draft: 'writings/a-new-article'` preference to preview a local article not yet commited, and exclude it from caching.<br>**Updated 1/6/2014:** This is now possible, but it adds unnecessary production weight---around 40 lines---and shall thus be refactored into a plugin.
* **Date feature**<br>The permalink plugin should check for dates in filenames (e.g. `20130106-an-article.md`), and show those instead of the hash mark---or, a new plugin may parse such dates and do something fun with them.
* **Markdown parser feature**<br>Because the GitHub API parser strips away useful tags like `small`, `cite`, and `figure`, it should be possible to choose your own parser or disable parsing altogether (to use a plugin or other solution).
* **YAML Front Matter feature**<br>This can be used as classes (`class="tag-one tag-two"`) or data-attributes (`data-tagone="value"`), giving more flexibility to plugins and styling.
* **Error handling**<br>Exceptions, pretty messages, console output, you name it---the real deal.
* **Plugin mechanism**<br>Make it smarter. Add methods as necessary---a drafts plugin could run `onReady`. Refactor to avoid `Function#call()`, and offer some interfacing with the Polestar instance.
* **Local version**<br>Create a smaller version of Polestar for rendering only local files, with no GitHub support. The example site will be a quick drop-in solution for rendering a README.md file.

Polestar welcomes you to its humble [GitHub repository](https://github.com/dnordstrom/polestar).