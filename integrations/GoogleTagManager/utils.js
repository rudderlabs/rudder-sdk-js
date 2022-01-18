import logger from "../../utils/logUtil";

const ServerSideScriptLoader = (id, src) => {
  logger.debug(`in server script loader=== ${id}`);
  // const js = document.createElement("iframe");
  // js.src = src;
  // js.height = "0";
  // js.width = "0";
  // js.style = "display:none;visibility:hidden";
  // const e = document.getElementsByTagName("body")[0];
  // logger.debug("==parent script==", e);
  // logger.debug("==adding script==", js);
  // const noscript = document.createElement("noscript");
  // noscript.appendChild(js);
  const body = document.getElementsByTagName("body")[0];
  // body.insertBefore(noscript, body.firstChild);
  // e.getElementsByTagName("noscript")[0].appendChild(js);
  body.innerHTML += '<noscript>';
    body.innerHTML += '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZ66RJ9/" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    body.innerHTML += '</noscript>';
  // console.log(document.getElementsByTagName("body"))";
};

export { ServerSideScriptLoader };
