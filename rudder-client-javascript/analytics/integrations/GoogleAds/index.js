import { GoogleAdsNode } from "./node";
import { GoogleAds } from "./browser";

export default process.browser ? GoogleAds : GoogleAdsNode;
