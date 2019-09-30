function ScriptLoader(id, src) {
  console.log("in script loader=== " + id);
  //if (document.getElementById(id)) {
  //console.log("id not found==");
  let js = document.createElement("script");
  js.src = src;
  js.type = "text/javascript";
  js.id = id;
  let e = document.getElementsByTagName("script")[0];
  console.log("==script==", e);
  e.parentNode.insertBefore(js, e);
  //}
} //('hubspot-integration', '//HubSpot.js');

export { ScriptLoader };
