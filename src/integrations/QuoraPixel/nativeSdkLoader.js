import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(q, e, v, n, t, s) {
  if (q.qp) return;
  n = q.qp = function () {
    n.qp ? n.qp.apply(n, arguments) : n.queue.push(arguments);
  };
  n.queue = [];
  t = document.createElement(e);
  t.async = !0;
  t.src = v;
  t.setAttribute('data-loader', LOAD_ORIGIN);
  s = document.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
}

export { loadNativeSdk };
