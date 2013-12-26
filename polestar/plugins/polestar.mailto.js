/**
 * Reverses email addresses in mailto links to prevent spam. For
 * example, `<a href="mailto:moc.mortsdronrm@d">` will magically turn
 * into `<a href="mailto:d@mrnordstrom.com">`.
 *
 * @author  L. Daniel Nordstrom <d@mrnordstrom.com>
 * @version 0.0.1
 * @license MPL 2.0
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * @method
 *
 * This function is called for each article, and is passed the object
 * containing the article element, content, etc. (At the time of
 * writing, `{ id, element, content }`.)
 */
Polestar.Mailto = function (article) {
  var links = article.element.querySelectorAll('a[href^="mailto:"]')

  for (var i = 0; i < links.length; ++i) {
    var address = links[i].getAttribute('href').split(':')[1]
    var newLink = 'mailto:' + address.split('').reverse().join('')

    links[i].setAttribute('href', newLink)
  }
}