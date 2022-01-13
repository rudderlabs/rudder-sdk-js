const ScriptLoaderHead = (id, src, async = defaultAsyncState) => {
    logger.debug(`in script loader=== ${id}`);
    const js = document.createElement("script");
    js.src = src;
    js.async = async === undefined ? defaultAsyncState : async;
    js.type = "text/javascript";
    js.id = id;
    const e = document.getElementsByTagName("head")[0];
    logger.debug("==adding script==", js);
    e.appendChild(js);
  };

export default ScriptLoaderHead;