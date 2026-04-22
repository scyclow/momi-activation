import {ls} from './utils.js'

const ANALYTICS_URL = `https://godxjnuwaujsfqkqghue.supabase.co/functions/v1`
const ANALYTICS_INTERVAL = 10000
const VERSION = '0.1'
const CURRENT_SESSION_START = Date.now()


let ENV

if (window.location.href.includes('movingimage.org')) {

} else if (window.location.href.includes('steviep.xyz')) {
  ENV = 'dev'
} else {
  ENV = 'local'
}

const defaultData = {
  sc_1_clicked: false,
  sc_2_clicked: false,
  sc_3_clicked: false,
  sc_4_clicked: false,
  sc_5_clicked: false,
  sc_6_clicked: false,
  sc_7_clicked: false,
  sc_8_clicked: false,
  sc_9_clicked: false,
  sc_10_clicked: false,
  sc_11_clicked: false,
  sc_12_clicked: false,
  sc_13_clicked: false,
  sc_14_clicked: false,
  steviep_clicked: false,
  upgrade1_loaded: false,
  upgrade2_loaded: false,
}



if (!ls.get('__SESSION_ID')) {
  ls.set('__SESSION_ID', `"S${Math.random().toString().slice(2)}"`)
}


if (!ls.get('__TOTAL_SESSION_TIME')) {
  ls.set('__TOTAL_SESSION_TIME', 0)
}




if (!ls.get('__UPGRADED_DATA')) {
  ls.set('__UPGRADED_DATA', JSON.stringify(defaultData))
}



let ellapsedInterval, snapshotInterval

export function setupAnalytics(dataGetter=() => ({})) {
  ls.set('__PAGE_LOADS', Number(ls.get('__PAGE_LOADS')) + 1 )

  if (!ls.get('__FIRST_SEEN')) {
    ls.set('__FIRST_SEEN', Date.now())
  }

  ellapsedInterval = setInterval(() => {
    const totalMS = Number(ls.get('__TOTAL_SESSION_TIME'))
    ls.set('__TOTAL_SESSION_TIME', totalMS + 1000)
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
    id: ls.get('__SESSION_ID').toString(),
    application: 'momi-upgraded',
    snapshot: getSnapshot(data)
  }

  if (ENV === 'local') console.log(snapshot)
  else return post(snapshot, `${ANALYTICS_URL}/snapshots`)
}


function updateData(newData={}) {
  const existingData = ls.get('__UPGRADED_DATA') || {}
  const data = {
    ...existingData,
    ...newData
  }

  ls.set('__UPGRADED_DATA', JSON.stringify(data))

  return data
}


function getSnapshot(data) {
  return {
    sessionId: ls.get('__SESSION_ID'),
    version: VERSION,
    env: ENV,

    data,

    lastSeen: Date.now(),
    firstSeen: ls.get('__FIRST_SEEN'),
    pageLoads: ls.get('__PAGE_LOADS'),
    totalSessionTime: ls.get('__TOTAL_SESSION_TIME'),
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
