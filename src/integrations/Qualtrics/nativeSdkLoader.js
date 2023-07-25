import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(projectId) {
  const projectIdFormatted = projectId.replace(/_/g, '').toLowerCase().trim();
  const requestUrlFormatted = `https://${projectIdFormatted}-${brandId}.siteintercept.qualtrics.com/SIE/?Q_ZID=${projectId}`;
  const requestIdFormatted = `QSI_S_${projectId}`;

  (function () {
    var g = function (e, h, f, g) {
      this.get = function (a) {
        for (var a = `${a}=`, c = document.cookie.split(';'), b = 0, e = c.length; b < e; b++) {
          for (var d = c[b]; d.charAt(0) == ' '; ) d = d.substring(1, d.length);
          if (d.indexOf(a) == 0) return d.substring(a.length, d.length);
        }
        return null;
      };
      this.set = function (a, c) {
        var b = '';
        var b = new Date();
        b.setTime(b.getTime() + 6048e5);
        b = `; expires=${b.toGMTString()}`;
        document.cookie = `${a}=${c}${b}; path=/; `;
      };
      this.check = function () {
        var a = this.get(f);
        if (a) a = a.split(':');
        else if (e != 100)
          h == 'v' && (e = Math.random() >= e / 100 ? 0 : 100),
            (a = [h, e, 0]),
            this.set(f, a.join(':'));
        else return !0;
        var c = a[1];
        if (c == 100) return !0;
        switch (a[0]) {
          case 'v':
            return !1;
          case 'r':
            return (c = a[2] % Math.floor(100 / c)), a[2]++, this.set(f, a.join(':')), !c;
        }
        return !0;
      };
      this.go = function () {
        if (this.check()) {
          var a = document.createElement('script');
          a.type = 'text/javascript';
          a.setAttribute('data-loader', LOAD_ORIGIN);
          a.src = g;
          document.body && document.body.appendChild(a);
        }
      };
      this.start = function () {
        var t = this;
        document.readyState !== 'complete'
          ? window.addEventListener
            ? window.addEventListener(
                'load',
                function () {
                  t.go();
                },
                !1,
              )
            : window.attachEvent &&
              window.attachEvent('onload', function () {
                t.go();
              })
          : t.go();
      };
    };
    try {
      new g(100, 'r', requestIdFormatted, requestUrlFormatted).start();
    } catch (i) {}
  })();
  const div = document.createElement('div');
  div.setAttribute('id', String(projectId));
  window._qsie = window._qsie || [];
  document.getElementsByTagName('head')[0].appendChild(div);
}

export { loadNativeSdk };
