Polestar.Mailto = function (article) {
  var links = article.element.querySelectorAll('a[href^="mailto:"]')

  for (var i = 0; i < links.length; ++i) {
    var address = links[i].getAttribute('href').split(':')[1]
    var newLink = 'mailto:' + address.split('').reverse().join('')

    links[i].setAttribute('href', newLink)
  }
}