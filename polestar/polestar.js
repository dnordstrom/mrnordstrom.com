/**
 * Polestar is a tiny client-side GitHub markdown content platform.
 *
 * It autoloads more content on scroll, and if the location hash
 * points to an existing article, it autoloads each until reaching
 * that article.
 *
 * It also features simple per-article plugins, which are functions
 * that are called and passed an object representation of each
 * rendered article.
 *
 * Provided examples include Polestar.Anchors, adding GitHub style
 * anchors to headings, and Polestar.Mailto, reversing mailto
 * addresses to prevent spam (allowing you to use `mailto:moc.em@em`
 * in place of `mailto:me@me.com` to prevent spam.)
 *
 * @author    0.0.1
 * @version   L. D. Nordstrom <d@mrnordstrom.com>
 * @license   MPL 2.0
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Global Polestar constructor.
 *
 * @class
 * @constructor
 * @param {Object} preferences - User defined preferences
 */ 
function Polestar(preferences) {
  /** Self reference as closures change scope; use instead of `this` */
  var self = this

  /** Defaults merged with user defined preferences */
  self.preferences = applyPreferencesToDefaults(preferences, {
    into:       'body',
    repo:       false,
    loadAll:    false,
    permalinks: false,
    plugins:    false
  })

  /** Holds element into which articles are rendered */
  self.container = false

  /** Holds article repository contents pulled from GitHub */
  self.articlesMetaData = []

  /** Holds objects of loaded articles */
  self.articles = []

  /** Caches the page height for onscroll calculation */
  self.pageHeight = 0

  /** Caches the viewport height for onscroll calculation */
  self.viewportHeight = 0

  /** Articles will autoload until this target ID has been reached */
  self.locationHashTarget = false
  
  /**
   * Initialization on document ready. Sets the container element,
   * begins loading articles and partials, and sets up `onscroll` event
   * to load more content.
   */
  function initialize() {
    if (document.readyState === 'complete') {
      /* Document already loaded */
      setContainer()
      loadArticles()
      loadPartials()
    } else {
      /* Document not yet loaded */
      document.addEventListener('DOMContentLoaded', function () {
        setContainer()
        loadArticles()
        loadPartials()
      }, false)
    }

    window.onscroll = function (event) {
      if (window.pageYOffset !== undefined) {
        var scrollTop = window.pageYOffset
      } else {
        var scrollTop =
          (document.documentElement ||
           document.body.parentNode ||
           document.body).scrollTop
      }

      /* If scroll reaches bottom of page */
      if (scrollTop === self.pageHeight - self.viewportHeight) {
        loadNextArticle()
      }
    }
  }

  /**
   * Determines the target article ID from location hash, and checks
   * to see that the article actually exists (to make sure all
   * articles will not be loaded unnecessarily).
   */
  function setLocationHashTarget() {
    if (window.location.hash) {
      var target =
        window.location.hash.substr(1, window.location.hash.length - 1)
      
      for (var i = 0; i < self.articlesMetaData.length; ++i) {
        var file = self.articlesMetaData[i].name
        var id = file.substr(0, file.lastIndexOf('.')) || file

        if (target === id) {
          self.locationHashTarget = target
          break
        }
      }
    }
  }

  function updateScrollValues() {
    self.viewportHeight = document.documentElement.clientHeight
    self.pageHeight = Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    )
  }

  /**
   * Override a set of default preferences with user defined values.
   * Only allows setting properties that are available in defaults.
   *
   * @method
   * @param {Object} userPreferences - User defined preferences.
   * @param {Object} defaults - Default preferences to override.
   */
  function applyPreferencesToDefaults(userPreferences, defaults) {
    for (var option in userPreferences) {
      var defaultExists = defaults.hasOwnProperty(option)
      var userSetExists = userPreferences.hasOwnProperty(option)
      
      if (defaultExists && userSetExists) {
        defaults[option] = userPreferences[option]
      }
    }
    
    return defaults
  }

  /**
   * Get raw GitHub content at given URL.
   *
   * @param {String} url - Request URL
   * @param {Function} callback - Callback function pass results to
   */
  function getRaw(url, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3.raw')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.status === 200 ? xhr.responseText : false)
      }
    }
  
    xhr.send(null)
  }

  /**
   * Get contents at given URL.
   *
   * @param {String} url - Request URL
   * @param {Function} callback - Callback function pass results to
   */
  function getURL(url, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(
          xhr.status === 200 ? xhr.responseText : false
        )
      }
    }
  
    xhr.send(null)
  }

  /**
   * Simply sets the container member to the appropriate element,
   * based on the "into" preference (defaulting to the document body).
   */
  function setContainer() {
    self.container =
      document.querySelector(self.preferences.into) || document.body
  }

  /**
   * Loads articles contained in the GitHub repository specified by
   * the "repo" preference, calling the render method for each, and
   * adding them to the `articles` member.
   */
  function loadArticles() {
    var url = 'https://api.github.com/repos/' +
      self.preferences.repo +
      '/contents'
    
    getURL(url, function (response) {
      self.articlesMetaData = JSON.parse(response)
        .filter(function (article) {
          return article.type === "file";
        })
        .reverse()

      setLocationHashTarget()
      loadNextArticle()
    })
  }

  /**
   * Loads one article from its GitHub URL.
   */
  function loadNextArticle() {
    if (self.articles.length < self.articlesMetaData.length) {
      var nextIndex = self.articles.length
      var url = self.articlesMetaData[nextIndex].url
      var file = self.articlesMetaData[nextIndex].name
      var id = file.substr(0, file.lastIndexOf('.')) || file

      getRaw(url, function (content) {
        var done = nextIndex + 1 >= self.articlesMetaData.length
        var matchesTarget = id === self.locationHashTarget
        var article = {
          content: content,
          id: id
        }

        /* Prevent rendering the same article twice */
        if (!self.articles[nextIndex]) {
          self.articles[nextIndex] = article
          renderArticle(article)
          runPluginsForArticle(article)
        }

        /* Go to location hash if done loading without specific
         * location hash target, or when specific target is reached */
        if ((done && !self.locationHashTarget) || matchesTarget) {
          refreshLocationHash()
        }

        /* Load next if we're loading all or target isn't reached */
        if (!done && (self.preferences.loadAll || !matchesTarget)) {
          loadNextArticle()
        }
      })
    }
  }

  /**
   * Outputs article to the page by appending it to the container
   * element specified by the "into" option in preferences.
   *
   * @param {Object} article - Object literal article representation
   */
  function renderArticle(article) {
    var element = document.createElement('article')
    var div = document.createElement('div')

    div.innerHTML = parseMarkdown(article.content)
    element.appendChild(div)
    element.setAttribute('id', article.id)
    article.element = element

    if (self.preferences.permalinks) {
      var permalink = document.createElement('a')
      permalink.setAttribute('class', 'permalink')
      permalink.setAttribute('href', '#' + article.id)
      permalink.appendChild(document.createTextNode('#'))
      element.appendChild(permalink)
    }

    self.container.appendChild(element)

    updateScrollValues()
  }

  /**
   * Loads content for partials. Partials are added in markup using a
   * `data-at` attribute pointing to the local markdown file
   * containing the content.
   */
  function loadPartials() {
    var elements = document.querySelectorAll('*[data-at]')
    
    for (var i = 0; i < elements.length; ++i) {
      var element = elements[i]
      var path = element.getAttribute('data-at') + '.md'
      
      !(function (element) {
        getURL(path, function (partial) {
          element.innerHTML = parseMarkdown(partial)
        })
      }(element))
    }
  }

  /**
   * Calls all functions specified in preferences as plugins.
   */
  function runPluginsForArticle(article) {
    if (self.preferences.plugins) {
      for (var i = 0; i < self.preferences.plugins.length; ++i) {
        var plugin = self.preferences.plugins[i]

        if (typeof plugin === 'function') {
          plugin(article)
        }
      }
    }
  }

  /**
   * Makes the window jump to the currently set location hash.
   */
  function refreshLocationHash() {
    if (window.location.hash) {
      window.location.hash = window.location.hash
    }
  }

  /**
   * Tiny multi-markdown parser originally written by Mathieu Henri.
   * Added underscore syntax since ellipsis emphasis at the beginning
   * of a sentence is interpreted as a list item.
   *
   * @method
   * @see https://github.com/p01/mmd.js
   * @param {String} source - Markdown source to parse into HTML
   * @returns {String} HTML output
   */
  function parseMarkdown(source) {
    var h = ''

    function escape(t) {
      return new Option(t).innerHTML
    }
    
    function inlineEscape(s) {
      return escape(s)
        .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">')
        .replace(/\[([^\]]+)]\(([^(]+)\)/g, '$1'.link('$2'))
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/__([^*]+)__/g, '<strong>$1</strong>')
        .replace(/_([^*]+)_/g, '<em>$1</em>')
        .replace(/---/g, '&mdash;')
        .replace(/--/g, '&ndash;')
    }

    source
      .replace(/^\s+|\r|\s+$/g, '')
      .replace(/\t/g, '    ')
      .split(/\n\n+/)
      .forEach(function(b, f, R) {
        f = b[0]
        R = {
          '*': [/\n\* /, '<ul><li>', '</li></ul>'],
          '1': [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>'],
          ' ': [/\n    /, '<pre><code>', '</pre></code>', '\n'],
          '>': [/\n> /, '<blockquote>', '</blockquote>', '\n']
        }[f]
        h += R ? R[1] + ('\n' + b)
          .split(R[0])
          .slice(1)
          .map(R[3] ? escape : inlineEscape)
          .join(R[3] || '</li>\n<li>') + R[2] :
          f == '#' ? '<h' + (f = b.indexOf(' ')) + '>' + inlineEscape(b.slice(f + 1)) + '</h' + f + '>' :
          f == '<' ? b : '<p>' + inlineEscape(b) + '</p>'
      })

    return h
  }

  initialize()
}