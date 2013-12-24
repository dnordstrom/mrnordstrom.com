/**
 * Adds anchors to headings in Polestar articles. Only works
 * effectively on first article unless the `loadAll` preference is set
 * to `true` (otherwise, the article containing the anchor may not
 * have loaded and thus the location hash will not work).
 *
 * @author  L. Daniel Nordstrom <d@mrnordstrom.com>
 * @version 0.0.1
 * @license MPL 2.0
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

Polestar.Anchors = function (article) {
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-')
  }

  function processHeadings(headings) {
    for (var i = 0; i < headings.length; ++i) {
      var heading = headings[i]
      var slug = slugify(heading.textContent)
      var link = document.createElement('a')

      link.setAttribute('href', '#' + slug)
      link.setAttribute('class', 'anchor fa fa-link')
      heading.setAttribute('id', slug)
      heading.appendChild(link)
    }
  }

  processHeadings(article.element.querySelectorAll('.writings h1'))
  processHeadings(article.element.querySelectorAll('.writings h2'))
}