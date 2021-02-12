import { GA360Node } from "./node";
import GA360 from "./browser";

export default process.browser ? GA360 : GA360Node;
