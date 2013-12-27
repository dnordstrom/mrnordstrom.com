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
 * @class
 * Global Polestar constructor.
 *
 * @param {Object} preferences User defined preferences
 */ 
function Polestar(preferences) {
  // Self reference as closures change scope; use instead of `this`
  var self = this

  /**
   * @property {Object} preferences Polestar preferences
   * @property {String} preferences.into Container element for articles
   * @property {String} preferences.repo GitHub repository for articles
   * @property {String} preferences.branch GitHub branch for articles
   * @property {Boolean} preferences.loadAll Load all on page load
   * @property {Boolean} preferences.permalinks Display '#' permalinks
   * @property {Array} preferences.plugins Article plugin functions
   */
  self.preferences = applyPreferencesToDefaults(preferences, {
    into: 'body',
    repo: false,
    branch: 'master',
    loadAll: false,
    permalinks: false,
    plugins: false
  })

  /** Holds element into which articles are rendered */
  self.container = false

  /** Holds repository contents as returned from GitHub */
  self.articlesMetaData = []

  /** Holds objects of loaded articles ({ id, element, content }) */
  self.articles = []

  /** Cached page height for onscroll calculation */
  self.pageHeight = 0

  /** Cached viewport height for onscroll calculation */
  self.viewportHeight = 0

  /** Used to autoload until this target article ID has been reached */
  self.locationHashTarget = false

  /** Various bits of text that may or may not be displayed */
  self.messages = {
    error: 'Something just went horribly wrong',
    rateLimitExceeded: 'GitHub\u2019s hourly rate-limit was exceeded for your IP address, but things will work again soon.'
  }
  
  /**
   * Sets up initialization on document ready.
   *
   * @method
   */
  function constructor() {
    if (document.readyState === 'complete') {
      // Document already loaded
      initialize()
    } else {
      // Document not yet loaded
      document.addEventListener('DOMContentLoaded', function () {
        initialize()
      }, false)
    }    
  }

  /**
   * Initializes a new instance by getting container element, loading
   * articles and partials, setting up event listeners, etc.
   *
   * @method
   */
  function initialize() {
    setContainer()
    loadArticles()
    loadPartials()

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
   * Appends an error message layer to the page.
   *
   * @method
   * @param {String} message Error message to display
   */
  function displayError(message) {
    var element = document.createElement('div')
    var heading = document.createElement('h1')
    var paragraph = document.createElement('p')

    element.setAttribute('class', 'error')
    element.appendChild(heading)
    element.appendChild(paragraph)
    paragraph.appendChild(document.createTextNode(message))
    heading.appendChild(document.createTextNode(self.messages.error))

    document.body.appendChild(element)
  }

  /**
   * Determines the target article ID from location hash, and checks
   * to see that the article actually exists (to make sure all
   * articles will not be loaded unnecessarily).
   *
   * @method
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

  /**
   * Updates cached page and viewport height used in onscroll
   * calculations.
   *
   * @method
   */
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
   * Overrides a set of default preferences with user defined values.
   * Only allows setting preferences that exist in defaults.
   *
   * @method
   * @param {Object} userPreferences User defined preferences.
   * @param {Object} defaults Default preferences to override.
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
   * Get contents at given URL.
   *
   * @method
   * @param {String} url Request URL
   * @param {Function} callback Callback function to pass results
   */
  function getURL(url, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText)
        } else {
          displayError(self.messages.rateLimitExceeded)
          callback(false)
        }
      }
    }
  
    xhr.send(null)
  }

  /**
   * Get raw GitHub content at given URL.
   *
   * @method
   * @param {String} url Request URL
   * @param {Function} callback Callback function to pass results
   */
  function getRawContent(url, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3.raw')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText)
        } else {
          displayError(self.messages.rateLimitExceeded)
          callback(false)
        }
      }
    }
  
    xhr.send(null)
  }

  /**
   * Parses Markdown using the GitHub API.
   *
   * @method
   * @param {String} source Markdown source to parse
   * @param {Function} callback Callback function to pass HTML
   */
  function getParsedMarkdown(source, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('POST', 'https://api.github.com/markdown/raw', true)
    xhr.setRequestHeader('Content-Type', 'text/x-markdown')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText)
        } else {
          displayError(self.messages.rateLimitExceeded)
          callback(false)
        }
      }
    }
  
    xhr.send(source)
  }

  /**
   * Get raw GitHub content at given URL and runs it through the
   * GitHub Markdown parser, returning the results.
   *
   * @method
   * @param {String} url Request URL
   * @param {Function} callback Callback function to pass results
   */
  function getParsedContent(url, callback) {
    getRawContent(url, function (content) {
      getParsedMarkdown(content, function (content) {
        callback(content)
      })
    })
  }

  /**
   * Simply sets the container member to the appropriate element,
   * based on the "into" preference (defaulting to the document body).
   *
   * @method
   */
  function setContainer() {
    self.container =
      document.querySelector(self.preferences.into) || document.body
  }

  /**
   * Loads articles contained in the GitHub repository specified by
   * the "repo" preference, calling the render method for each, and
   * adding them to the `articles` member.
   *
   * @method
   */
  function loadArticles() {
    var parts = self.preferences.repo.split('/')
    var repository = pathParts.slice(0, 2).join('/')
    var dir = (parts.length > 2 ? '/' + parts.slice(2).join('/') : '')
    var url = 'https://api.github.com/repos/' +
      repository +
      '/contents' +
      dir +
      '?ref=' +
      self.preferences.branch

    getURL(url, function (response) {
      self.articlesMetaData = JSON.parse(response)
        .filter(function (article) {
          return article.type === "file"
        })
        .reverse()

      setLocationHashTarget()
      loadNextArticle()
    })
  }

  /**
   * Loads one article from its GitHub URL.
   *
   * @method
   */
  function loadNextArticle() {
    if (self.articles.length < self.articlesMetaData.length) {
      var nextIndex = self.articles.length
      var url = self.articlesMetaData[nextIndex].url
      var file = self.articlesMetaData[nextIndex].name
      var id = file.substr(0, file.lastIndexOf('.')) || file

      getParsedContent(url, function (content) {
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
           location hash target, or when specific target is reached */
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
   * @method
   * @param {Object} article Object literal article representation
   */
  function renderArticle(article) {
    var element = document.createElement('article')
    var div = document.createElement('div')

    div.innerHTML = article.content
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
   *
   * @method
   */
  function loadPartials() {
    var elements = document.querySelectorAll('*[data-at]')
    
    for (var i = 0; i < elements.length; ++i) {
      var element = elements[i]
      var path = element.getAttribute('data-at') + '.md'
      
      !(function (element) {
        getURL(path, function (partial) {
          getParsedMarkdown(partial, function (content) {
            element.innerHTML = content
          })
        })
      }(element))
    }
  }

  /**
   * Calls all functions specified in preferences as plugins.
   *
   * @method
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
   *
   * @method
   */
  function refreshLocationHash() {
    if (window.location.hash) {
      window.location.hash = window.location.hash
    }
  }

  /* Set up instance */
  constructor()
}