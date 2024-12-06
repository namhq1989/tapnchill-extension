import { IBlockedSite } from '@/modules/focus/types.ts'

const updateBlockingRules = (blockedSites: IBlockedSite[]) => {
  const rules: chrome.declarativeNetRequest.Rule[] = blockedSites.map(
    (site, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { extensionPath: `/blocked.html?site=${site.hostname}` },
      },
      condition: {
        regexFilter: `^https?://(www\\.)?${site.hostname}(/|$)`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    }),
  )

  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Remove existing rules
      addRules: rules, // Add new rules
    },
    () => {
      console.log('Blocking rules updated:', rules)
    },
  )
}

const stopBlocking = () => {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Remove all existing rules
    },
    () => {
      console.log('Blocking rules cleared.')
    },
  )
}

export { updateBlockingRules, stopBlocking }
