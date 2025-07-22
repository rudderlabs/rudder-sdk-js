import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(moeDataCenter) {
  var sdkVersion = "2";

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

export { loadNativeSdk };
