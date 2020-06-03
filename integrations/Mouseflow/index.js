import { MouseflowNode } from "./node";
import { Mouseflow } from "./browser";

export default process.browser ? Mouseflow : MouseflowNode;
