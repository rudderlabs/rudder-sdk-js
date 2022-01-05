import { GANode } from "./node";
import GA from "./browser";

export let ga = process.browser ? { GA } : { GANode };
