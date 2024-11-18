export const i18n = (key: string = ""): string => {
  return chrome.i18n.getMessage(key)
}
