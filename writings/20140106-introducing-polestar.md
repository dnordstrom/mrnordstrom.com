# Polestar 0.0.1 Powered

As a creator, you know it. You know that urge. We all do.

In your mind is a perfect picture of what you want. Yet, as you look around, nothing hits your smile button. Your mind sighs. It then utters those horrifying, familiar words, "but that shouldn't take long to create," and it's game over---you've just signed off on the brutal assassination of God knows how many days, weeks, or years of your life.

[Polestar](https://github.com/dnordstrom/polestar) is a child of this beautiful process. It's the tiny Markdown site authoring and blogging tool in JavaScript that powers this site. It's GitHub flavored and fully client-side, with a simple purpose: to fetch Markdown from local files and a GitHub repository, parse it, and slap it on a page.

It weighs in at around 600 lines fully commented and wrapped hard at 70 columns. The idea is to keep it tiny and modular (preferably no larger than 500 lines), and further develop the plugin mechanism.

Keep in mind, though, that a purely client-side solution has major drawbacks. It's not search engine friendly and can't offer RSS feeds. However, a Polestar static site and feed generator is in development to scratch this itch.

**Note:** This is alpha software. It may not work, it will definitely change, and documentation is a work in progress.

## Features & Notes

- **Writings and Partials**<br>Writings are pulled from GitHub, partials from local files.
- **Repository, Branch, and Directory**<br>Writings may be loaded from a specific branch and subdirectory.
- **GitHub Flavored Markdown**<br>Markdown is parsed by the GitHub API.
- **Autoload on Scroll**<br>Setting `loadAll: true` instead loads all writings on page load.
- **Linking**<br>Writings are linkable using location hash, despite their dynamic loading. For instance, "example.com#the-filename" loads each writing until reaching "the-filename.md" (but only if it exists).
- **Caching**<br>Writings are cached in sessionStorage to avoid unnecessary requests and the GitHub API rate limit.
- **Previewing**<br>Preview a local, unpublished writing using the "draft" preference (`draft: 'writings/new-article'`). It won't be cached.
- **Plugins**<br>These are currently objects with `beforeRender` or `afterRender` methods that are called for each writing and partial. The mechanism will be improved.
- **Debug Mode and Parameters**<br>Set debug parameters with a location hashbang. Use the "debug" key to enable console output. While previewing, set GitHub credentials with "username" and "password" to increase the rate limit from 60 to 5000. For example: "http://localhost:8000#!username=me&password=gosh&debug"
- **Example Plugins**
- **Example Site and Theme**

Polestar has no dependencies, but requires a browser that supports things like `XMLHttpRequest` and `document.querySelector`.

**Note:** When previewing a local article, keep in mind GitHub's rate limit of 60 unauthenticated requests per hour unless you use your credentials (as the API is used to parse the Markdown).

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

**To preview changes or writings locally**, use any web server (just opening the HTML file won't allow Polestar to request content). For Mac users, or anyone with Python installed, the easiest way is to use Python's built-in server by running the following command from the site's directory:

```
python -m SimpleHTTPServer
```

## Roadmap

* **Refactoring**<br>Refactor as much as possible into plugins to keep things modular and lightweight.
* **Date feature**<br>The permalink plugin should check for dates in filenames (e.g. `20130106-an-article.md`), and show those instead of the hash mark---or, a new plugin may parse such dates and do something fun with them.
* **Markdown parser feature**<br>Because the GitHub API parser strips away useful tags like `small`, `cite`, and `figure`, it should be possible to choose your own parser or disable parsing altogether (to use a plugin or other solution).
* **YAML Front Matter plugin**<br>The data can be used as classes (`class="tag-one tag-two"`) or data-attributes (`data-tagone="value"`), giving more flexibility to plugins and styling.
* **Pages plugin**<br>This may simply be a plugin that adds functionality to open and close partials (with `data-page` attributes) as modal pages on top of other content.
* **Error handling**<br>Exceptions, pretty messages, console output, you name it---the real deal.
* **Plugin mechanism**<br>Make it smarter. Add methods as necessary---a drafts plugin could run `onReady`. Refactor to avoid `Function#call()`, and offer some interfacing with the Polestar instance.
* **Local version**<br>Create a smaller version of Polestar for rendering only local files, with no GitHub support. The example site will be a quick drop-in solution for rendering a README.md file.

Polestar welcomes you to its humble [GitHub repository](https://github.com/dnordstrom/polestar).