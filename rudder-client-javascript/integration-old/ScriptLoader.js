var ScriptLoader = function (id, src) {
    if (document.getElementById(id)) { return; }
    var js = document.createElement('script');
    js.src = src;
    js.type = 'text/javascript';
    js.id = id;
    var e = document.getElementsByTagName('script')[0];
    console.log("==script==", e)
    e.parentNode.insertBefore(js, e);
  }//('hubspot-integration', '//HubSpot.js');
module.exports = {
  ScriptLoader: ScriptLoader
}