import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk() {
  var moeDataCenter = "dc_1"; // Replace "DC" with the actual Data center value from the above table
  var sdkVersion = "2"; // Replace this value with the version of Web SDK that you intend to use. It is recommended to use the format x (major)

  !(function (e, n, i, t, a, r, o, d) {
      if (!moeDataCenter || !moeDataCenter.match(/^dc_[0-9]+$/gm))
          return console.error(
              "Data center has not been passed correctly. Please follow the SDK installation instruction carefully."
          );
      var s = (e[a] = e[a] || []);
      if (((s.invoked = 0), s.initialised > 0 || s.invoked > 0))
          return (
              console.error(
                  "MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"
              ),
              !1
          );
      e.moengage_object = a;
      var l = {},
          g = function n(i) {
              return function () {
                  for (var n = arguments.length, t = Array(n), a = 0; a < n; a++)
                      t[a] = arguments[a];
                  (e.moengage_q = e.moengage_q || []).push({ f: i, a: t });
              };
          },
          u = [
              "track_event",
              "add_user_attribute",
              "add_first_name",
              "add_last_name",
              "add_email",
              "add_mobile",
              "add_user_name",
              "add_gender",
              "add_birthday",
              "destroy_session",
              "add_unique_user_id",
              "update_unique_user_id",
              "moe_events",
              "call_web_push",
              "track",
              "location_type_attribute",
              "identifyUser",
              "getUserIdentities",
          ],
          m = { onsite: ["getData", "registerCallback", "getSelfHandledOSM"] };
      for (var c in u) l[u[c]] = g(u[c]);
      for (var v in m)
          for (var f in m[v])
              null == l[v] && (l[v] = {}), (l[v][m[v][f]] = g(v + "." + m[v][f]));
      (r = n.createElement(i)),
          (o = n.getElementsByTagName("head")[0]),
          (r.async = 1),
          (r.src = t),
          r.setAttribute("data-loader", LOAD_ORIGIN),
          o.appendChild(r),
          (e.moe =
              e.moe ||
              function () {
                  return ((s.invoked = s.invoked + 1), s.invoked > 1)
                      ? (console.error(
                            "MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"
                        ),
                        !1)
                      : ((d = arguments.length <= 0 ? void 0 : arguments[0]), l);
              }),
          r.addEventListener("load", function () {
              if (d)
                  return (
                      (e[a] = e.moe(d)),
                      (e[a].initialised = e[a].initialised + 1 || 1),
                      !0
                  );
          }),
          r.addEventListener("error", function () {
              return console.error("Moengage Web SDK loading failed."), !1;
          });
    })(
        window,
        document,
        "script",
        "https://cdn.moengage.com/release/" +
            moeDataCenter +
            "/versions/" +
            sdkVersion +
            "/moe_webSdk.min.latest.js",
        "Moengage"
    );
}

// function loadNativeSdk() {
//   (function (i, s, o, g, r, a, m, n) {
//     i.moengage_object = r;
//     var t = {};
//     var q = function (f) {
//       return function () {
//         (i.moengage_q = i.moengage_q || []).push({ f, a: arguments });
//       };
//     };
//     var f = [
//       'track_event',
//       'add_user_attribute',
//       'add_first_name',
//       'add_last_name',
//       'add_email',
//       'add_mobile',
//       'add_user_name',
//       'add_gender',
//       'add_birthday',
//       'destroy_session',
//       'add_unique_user_id',
//       'moe_events',
//       'call_web_push',
//       'track',
//       'location_type_attribute',
//     ];
//     var h = { onsite: ['getData', 'registerCallback'] };
//     for (var k in f) {
//       t[f[k]] = q(f[k]);
//     }
//     for (var k in h)
//       for (var l in h[k]) {
//         null == t[k] && (t[k] = {}), (t[k][h[k][l]] = q(k + '.' + h[k][l]));
//       }
//     a = s.createElement(o);
//     m = s.getElementsByTagName(o)[0];
//     a.async = 1;
//     a.setAttribute('data-loader', LOAD_ORIGIN);
//     a.src = g;
//     m.parentNode.insertBefore(a, m);
//     i.moe =
//       i.moe ||
//       function () {
//         n = arguments[0];
//         return t;
//       };
//     a.onload = function () {
//       if (n) {
//         i[r] = moe(n);
//       }
//     };
//   })(
//     window,
//     document,
//     'script',
//     document.location.protocol === 'https:'
//       ? 'https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js'
//       : 'http://cdn.moengage.com/webpush/moe_webSdk.min.latest.js',
//     'Moengage',
//   );
// }

export { loadNativeSdk };
