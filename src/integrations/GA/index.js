import { GANode } from "./node";
import GA from "./browser";

export default process.browser ? GA : GANode;
