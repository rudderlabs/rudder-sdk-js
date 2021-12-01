const ScriptLoader = (url) => {
  const js = document.createElement("script");
  js.src = url;
  js.id = "pap_x2s6df8d";
  js.type = "text/javascript";
  const e = document.getElementsByTagName("script")[0];
  e.parentNode.insertBefore(js, e);
};

export default ScriptLoader;
