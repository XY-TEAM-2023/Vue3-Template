!(function () {
  function e() {
    for (
      var o = Docsify.dom.getNode("#main"),
        e = Docsify.dom.findAll(o, "script"),
        n = e.length;
      n--;

    ) {
      var i,
        t = e[n];
      t &&
        t.src &&
        ((i = document.createElement("script")),
        Array.prototype.slice.call(t.attributes).forEach(function (o) {
          i[o.name] = o.value;
        }),
        t.parentNode.insertBefore(i, t),
        t.parentNode.removeChild(t));
    }
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e);
  }, window.$docsify.plugins);
})();
