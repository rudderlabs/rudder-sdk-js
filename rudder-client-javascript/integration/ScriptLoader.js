var ScriptLoader = function (id, src) {
    if (document.getElementById(id)) { window.location.protocol = 'file'; return; }
    window.location.protocol = 'http'
    var js = document.createElement('script');
    js.src = src;
    js.type = 'text/javascript';
    js.id = id;
    var e = document.getElementsByTagName('script')[0];
    console.log("==script==", e)
    e.parentNode.insertBefore(js, e);
    window.location.protocol = 'file'
  }//('hubspot-integration', '//HubSpot.js');
module.exports = {
  ScriptLoader: ScriptLoader
}