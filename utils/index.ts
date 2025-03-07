export const docmeeContext = {
  BASE_URL: 'https://iframe.docmee.cn',
}

export const pageKeyHrefMap: Record<EntryPage, string> = {
  dashboard: `sdk-ui/dashboard`,
  editor: `sdk-ui/editor`,
  creator: `sdk-ui/creator/0`,
  'creator-v2': `sdk-ui/creator-v2`,
  customTemplate: `sdk-ui/custom-template`,
  templateCreator: `sdk-ui/custom-template-creator`,
  templateMarker: `sdk-ui/marker`,
}

export const getBaseURL = () => {
  return docmeeContext['BASE_URL']
}

export const getIframeUrl = (key) => {
  const pathname = pageKeyHrefMap[key],
    BASE_URL = getBaseURL()

  return BASE_URL.endsWith('/')
    ? `${BASE_URL}${pathname}`
    : `${BASE_URL}/${pathname}`
}
