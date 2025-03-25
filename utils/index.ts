export const docmeeContext = {
  BASE_URL: "https://iframe.docmee.cn",
};

export const pageKeyHrefMap: Record<EntryPage, string> = {
  dashboard: `sdk-ui/dashboard`,
  editor: `sdk-ui/editor`,
  creator: `sdk-ui/creator/0`,
  "creator-v2": `sdk-ui/creator-v2`,
  customTemplate: `sdk-ui/custom-template`,
  templateCreator: `sdk-ui/custom-template-creator`,
  templateMarker: `sdk-ui/marker`,
};

export const getPageKey = (key: string, creatorVersion?: InitOptions["creatorVersion"]) => {
  if (/^(creator)/.test(key)) {
    let suffix = "";
    if (creatorVersion) {
      suffix = creatorVersion === "v1" ? "" : `-${creatorVersion}`;
    }
    key = `creator${suffix}`;
  }
  return key;
};

export const getBaseURL = () => {
  return docmeeContext["BASE_URL"];
};

export const getPathname = (key: string, creatorVersion?: InitOptions["creatorVersion"]) => {
  const pathname = pageKeyHrefMap[key];
  return pathname;
};

export const getIframeUrl = (key: string, creatorVersion?: InitOptions["creatorVersion"]) => {
  key = getPageKey(key, creatorVersion);
  const BASE_URL = getBaseURL(),
    pathname = getPathname(key, creatorVersion);

  return BASE_URL.endsWith("/") ? `${BASE_URL}${pathname}` : `${BASE_URL}/${pathname}`;
};
