import { HotjarNode } from "./node";
import { Hotjar } from "./browser";

export default process.browser ? Hotjar : HotjarNode;
