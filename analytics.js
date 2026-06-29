import {ls} from './utils.js'

const ANALYTICS_URL = `https://godxjnuwaujsfqkqghue.supabase.co/functions/v1`
const ANALYTICS_INTERVAL = 20000
const VERSION = '0.1'
const CURRENT_SESSION_START = Date.now()


let ENV

if (window.location.href.includes('movingimage.org')) {
  ENV = 'prod'
} else if (window.location.href.includes('movingimage.pantheonsite.io')) {
  ENV = 'staging'
} else if (window.location.href.includes('steviep.xyz')) {
  ENV = 'dev'
} else {
  ENV = 'local'
}

const defaultData = {
  page1: false,
  page2: false,
  page3: false,
  page4: false,
  page5: false,
  page6: false,
  upgraded: false,
  modalClosed: false,
  clickerReset: false,
  invalidCodeUsed: false,
  primaryCodeUsed: false,
  secondaryCodeUsed: false,
  activationCodeGenerated: false,
  closeCuratorialText: false,
  autoGeneratorCount: 0,
  atBalance: 0,
}



if (!ls.get('__MOMI_SESSION_ID')) {
  ls.set('__MOMI_SESSION_ID', `"S${Math.random().toString().slice(2)}"`)
}


if (!ls.get('__MOMI_TOTAL_SESSION_TIME')) {
  ls.set('__MOMI_TOTAL_SESSION_TIME', 0)
}




if (!ls.get('__MOMI_ACTIVATION_UPGRADE_DATA')) {
  ls.set('__MOMI_ACTIVATION_UPGRADE_DATA', JSON.stringify(defaultData))
}



let ellapsedInterval, snapshotInterval

export function setupAnalytics(dataGetter=() => ({}), trigger=null) {
  ls.set('__MOMI_PAGE_LOADS', Number(ls.get('__MOMI_PAGE_LOADS')) + 1 )
  ls.set('__MOMI_TAKEOVER_TRIGGER', JSON.stringify(trigger))

  if (!ls.get('__MOMI_FIRST_SEEN')) {
    ls.set('__MOMI_FIRST_SEEN', Date.now())
  }

  ellapsedInterval = setInterval(() => {
    const totalMS = Number(ls.get('__MOMI_TOTAL_SESSION_TIME'))
    ls.set('__MOMI_TOTAL_SESSION_TIME', totalMS + 1000)
  }, 1000)

  snapshotInterval = setInterval(async () => {
    if (!document.hidden) {
      try {
        const res = await postSnapshot(dataGetter() || {})
      } catch (e) {
        console.log(e)
      }
    }
  }, ANALYTICS_INTERVAL)
}

export function teardownAnalytics() {
  clearInterval(ellapsedInterval)
  clearInterval(snapshotInterval)
}

export async function postSnapshot(newData={}) {
  const data = updateData(newData)

  const snapshot = {
    id: ls.get('__MOMI_SESSION_ID').toString(),
    application: 'momi-activation',
    snapshot: getSnapshot(data)
  }

  if (ENV === 'local') console.log(snapshot)
  else return post(snapshot, `${ANALYTICS_URL}/snapshots`)
}


function updateData(newData={}) {
  const existingData = ls.get('__MOMI_ACTIVATION_UPGRADE_DATA') || {}
  const data = {
    ...existingData,
    ...newData
  }

  ls.set('__MOMI_ACTIVATION_UPGRADE_DATA', JSON.stringify(data))

  return data
}


function getSnapshot(data) {
  return {
    sessionId: ls.get('__MOMI_SESSION_ID'),
    version: VERSION,
    env: ENV,

    data,

    lastSeen: Date.now(),
    firstSeen: ls.get('__MOMI_FIRST_SEEN'),
    pageLoads: ls.get('__MOMI_PAGE_LOADS'),
    totalSessionTime: ls.get('__MOMI_TOTAL_SESSION_TIME'),
    trigger: ls.get('__MOMI_TAKEOVER_TRIGGER'),
    navigator: {
      userAgent: navigator?.userAgent,
      language: navigator?.language,
      mobile: navigator?.userAgentData?.mobile

    }
  }
}



let postFailed
async function post(_body, url) {
  const method = 'POST';
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify(_body)

  try {
    const response = await fetch(
      url,
      {
        headers,
        body,
        method
      }
    )

    return response.json()
  } catch (e) {
    if (!postFailed) {
      postFailed = true
      console.log('...')
    }
  }
}
