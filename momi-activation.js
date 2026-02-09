

const VALID_ACTIVATION_CODE = 'null'



const popupId = 'momi-activation-popup'
const updatePopup = `
  <div
    id="${popupId}"
    style="
      border: 8px solid;
      height: 240px;
      width: 240px;
      padding: 10px;
      font-family: sans-serif;
      background: #fff;
      cursor: pointer;
    "
  >
    <div style="text-align: right; font-family: sans-serif;">
      <span id="closePopup" style="cursor: pointer; font-size: 12px; user-select: none">X</span>
    </div>
    <h1 style="font-size: 32px;">→ CLICK <a href="#" style="animation: ActivationBlink 1s steps(2, start) infinite; color: #00e; text-decoration: underline">HERE</a> TO UPGRADE MOMI WEBSITE</h1>

    <!--<h1>*WARNING*: MOMI WEBSITE OUT OF DATE: CLICK HERE TO </h1> -->
    <!--<p>(By clicking this link you acknowledge that you don't have photosensitive epilepsy)</p> -->

  </div>
`


let popupWait = 1500


const closePopup = (permanantClose=false) => {
  $.id(popupId).remove()
  if (!permanantClose) {
    popupWait *= 3
    setTimeout(mountPopup, popupWait)
  }
}


function mountPopup() {
  const popup = $.div(updatePopup, {
    id: popupId,
    style: `
      z-index: 4000;
      position: fixed;
      left: ${random(0, window.innerWidth - 250)}px;
      top: ${random(0, window.innerHeight - 250)}px;
    `
  })
  document.body.appendChild(popup)


  let ignoreMount
  $.id('closePopup').onclick = () => {
    ignoreMount = true
    closePopup()
    setTimeout(() => ignoreMount = false, 100)
  }

  $.id('momi-activation-popup').onclick = () => {
    if (ignoreMount) return
    mountPageTakeover()
    closePopup(true)
  }
}


setTimeout(() => {
  mountPopup()
  css(`
    @keyframes ActivationBlink {
      to {
        visibility: hidden;
      }
    }


    @keyframes GreenYellow {
      0%, 100% {
        background: #0f0;
      }

      50% {
        background: #ff0;
      }
    }

    @keyframes GreenYellowColor {
      0%, 100% {
        color: #0f0;
      }

      50% {
        color: #ff0;
      }
    }

    @keyframes BorderBlink {
      0%, 100% {
        outline: 3px solid;
      }

      50% {
        outline: 3px none;
      }
    }


  `)
}, popupWait)










const warningSvg = () => {
  const maskId = 'warningMask' + Math.random().toString(36).substr(2, 9)
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="${maskId}">
          <polygon points="50,6 94,86 6,86" fill="white"/>
          <rect x="46" y="35" width="8" height="27" fill="black"/>
          <circle cx="50" cy="72" r="4" fill="black"/>
        </mask>
      </defs>
      <polygon points="50,6 94,86 6,86" fill="#f00" mask="url(#${maskId})"/>
    </svg>
  `
}


const modalBgId = 'momi-modal-bg'
const ignoreId = 'momi-ignore-button'
const continueId = 'momi-continue-button'
const timerId = 'momi-timer'
const takeoverId = 'momi-activation-takeover'
const containerId = 'momi-takeover-container'
const enterId = 'momi-takeover-enter'
const noCodeId = 'momi-takeover-no-code'
const okId = 'momi-activation-ok'
const activationCodeErrorId = 'momi-activation-code-error'
const activationCodeInputId = 'momi-activation-code-input'




const page1 = `
  <h1 style="text-align: center; font-size: 45px; color: #f00; font-family: sans-serif; margin-bottom: 16px">WARNING</h1>
  <div style="width: 45vw;">
    ${times(36, i => `<div style=" display: inline-block; width: 5vw; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: ${-0.1 * i}s;">${warningSvg()}</div>`).join('')}
  </div>

  <!--
    <h1 style="text-align: center; font-size: 32px; color: #f00; font-family: sans-serif; margin: 16px 0">MALWARE DETECTED</h1>
    -->

    <div style="height: 32px"></div>

  <div style="display: flex; justify-content: center">
    <button id="${ignoreId}" class="momi-button"">IGNORE</button>
    <button id="${continueId}" class="momi-button" style="margin-left: 24px">CONTINUE <span style="animation: ActivationBlink 1s steps(2, start) infinite;">→</span></button>
  </div>
`


const page2 = `
  <h1 id="${timerId}" style="text-align: center; font-size: 45px; color: #f00; font-family: sans-serif; margin-bottom: 16px"></h1>

  <div style="margin-bottom: 6px; font-size: 20px">


    <input id="${activationCodeInputId}" placeholder="ACTIVATION CODE" style="text-align: center; border: 1px solid #f00; border-radius: 2px; padding: 3px">

    <div style="display: flex; align-items: center; justify-content: space-between; font-weight: bold; margin: 12px">
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.5s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.4s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.3s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.2s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.1s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.0s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.1s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.2s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.3s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.4s">↑</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.5s">↑</span>
    </div>
  </div>

  <div id="${activationCodeErrorId}" style="color: #f00; margin-bottom: 12px; max-width: 900px"></div>

  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <button id="${enterId}" class="momi-button"">ENTER</button>
    <button id="${noCodeId}" class="momi-button" style="margin-top: 12px; font-size: 16px; border: none; text-decoration: underline">I DON'T HAVE AN ACTIVATION CODE</button>
  </div>
`


const page3 = `
  <h1 class="momi-page3-h1" style="text-align: center; font-size: 36px; color: #f00; font-family: sans-serif; max-width: 500px; margin-bottom: 36px">PLEASE VISIT THE "ACTIVATION CENTER" AT:</h1>

    <address style="animation: BorderBlink 1s linear infinite; padding: 24px; max-width: 750px; text-align: center; color: #f00; font-size: 24px; margin-bottom: 36px">
      <div style="margin-bottom: 6px">36-01 35 Ave</div>
      <div>Astoria, NY 11106</div>
    </address>

  <h1 class="momi-page3-h1" style="font-size: 36px; color: #f00; margin-bottom: 48px; text-align: center">TO RECEIVE THE ACTIVATION CODE</h1>

  <button id="${okId}" class="momi-button"">OK</button>

`




const pageTakeover = `
  <div
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      id="${modalBgId}"
      style="
        width: 100vw;
        height: 100vh;
        background: #000;
        opacity: 0.7;

        position: fixed;
        left: 0;
        top: 0;
        cursor: pointer;
      "
    ></div>


    <div
      id="${containerId}"
      style="
        height: 95vh;
        width: 95vw;
        z-index: 3;
        background: #ff0;
        padding: 16px;
        box-sizing: border-box;
        animation: GreenYellow 10s linear infinite;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      "
    >
      ${page1}
    </div>



  <style>
    .momi-button {
      font-weight: bold;
      border: 2px solid;
      background: none;
      padding: 4px 16px;
      font-size: 24px;
      cursor: pointer;
      animation: GreenYellowColor 10s linear infinite;
      border-color: #f00 !important;
      user-select: none;
    }

    .momi-button:not(:hover) {
      color: #f00 !important;
    }
    .momi-button:hover {
      background: #f00 !important;
    }

    @media (max-width: 440px) {
      #${timerId} {
        font-size: 32px !important;
      }
    }

    @media (max-width: 660px) {
      .momi-page3-h1 {
        font-size: 24px !important;
        margin-bottom: 24px !important;
      }

      .momi-page3-h1 + address {
        margin-bottom: 24px !important;
        font-size: 20px !important;
        padding: 20px !important;
      }
    }
  </style>



  </div>

`





const soundIntervals = []
const startSoundInterval = () => {
  const s = new SoundSrc('square')

  soundIntervals.push(
    setInterval(() => {
      s.note(300, 300)
    }, 2000)
  )
}

const stopSoundIntervals = () => {
  soundIntervals.forEach(i => clearInterval(i))
}


function mountPageTakeover() {
  const takeover = $.div(pageTakeover, {
    id: takeoverId,
    style: `
      z-index: 5000;
      position: fixed;
      top: 0;
      left: 0;
    `
  })
  document.body.appendChild(takeover)
  startSoundInterval()


  let timerInterval




  const closeModal = () => {
    stopSoundIntervals()
    clearInterval(timerInterval)
    takeover.remove()
  }


  const gotoActivationEntry = () => {
    startSoundInterval()

    $.id(containerId).innerHTML = page2

    timerInterval = triggerTimer(60812000, $.id(timerId))

    $.id(enterId).onclick = () => {

      startSoundInterval()

      const enteredActivationCode = $.id(activationCodeInputId).value

      if (enteredActivationCode.trim() !== VALID_ACTIVATION_CODE) {
        $.id(activationCodeErrorId).innerHTML += 'INVALID ACTIVATION CODE '
      } else {

      }
    }

    $.id(noCodeId).onclick = gotoActivationCenter

  }


  const gotoActivationCenter = () => {
    clearInterval(timerInterval)
    startSoundInterval()
    $.id(containerId).innerHTML = page3

    $.id(okId).onclick = closeModal

  }


  $.id(modalBgId).onclick = closeModal
  $.id(ignoreId).onclick = closeModal
  $.id(continueId).onclick = gotoActivationEntry
}


function triggerTimer(timeLeft, $elem) {
  const with0 = x => Math.floor(x).toString().padStart(2, '0')
  const with00 = x => Math.floor(x).toString().padStart(3, '0')
  return setInterval(() => {
    timeLeft -= 10
    const days = timeLeft / (24*60*60*1000)
    const hours = 24 * (days%1)
    const minutes = 60 * (hours%1)
    const seconds = Math.floor(60 * (minutes%1))
    const ms = timeLeft/10 % 100

    $elem.innerHTML = `NaN:${with0(hours)}:${with0(minutes)}:${with0(seconds)}.${with0(ms)}`
  }, 10)
}

































const $ = (elem, prop, value) => elem.style[prop] = value

window.$ = $
$.cls = (selector, elem=document) => Array.isArray(elem)
  ? elem.map(e => $.cls(e, selector)).flat()
  : Array.from(elem.getElementsByClassName(selector))

$.id = (selector, elem=document) => Array.isArray(elem)
  ? elem.find(e => $.id(e, selector))
  : elem.getElementById(selector)


$.render = (e, children) => {
  if (!children) return
  else if (typeof children === 'string') e.innerHTML = children
  else if (Array.isArray(children)) {
    if (typeof children[0] === 'string') {
      children.forEach(child => {
        e.innerHTML += (
          typeof child === 'string' ? child : child.outerHTML
        )
      })
    } else {
      e.append(...children.flat())
    }
  }
  else {
    e.append(children)
  }
}


$.create = elType => (children, attrs={}) => {
  const e = document.createElement(elType)
  $.render(e, children)

  Object.keys(attrs).forEach(a => {
    e.setAttribute(a, attrs[a])
  })

  return e
}

$.p = $.create('p')
$.a = $.create('a')
$.li = $.create('li')
$.div = $.create('div')
$.span = $.create('span')
$.main = $.create('main')
$.section = $.create('section')


const $html = document.getElementsByTagName('html')[0]



const addMetaTag = (args) => {
  const meta = document.createElement('meta')
  Object.keys(args).forEach(arg => {
    meta[arg] = args[arg]
  })

  document.head.appendChild(meta)
}

const addThumbnail = (fill) => {
  const existing = document.getElementById('favicon')
  if (existing) document.head.removeChild(existing)
  const link = document.createElement('link')
  link.href = `data:image/svg+xml;base64,${btoa(
    `<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" fill="${fill}"></rect></svg>`
  )}`
  link.rel = 'shortcut icon'
  link.type = 'image/svg+xml'
  link.id = 'favicon'
  document.head.appendChild(link)
}

function css(style) {
  const s = document.createElement('style')
  s.innerHTML = style
  document.head.appendChild(s)
}


function setMetadata() {
  $html.translate = false
  $html.lang = 'en'
  $html.className = 'notranslate'

  addMetaTag({ name: 'google', content: 'notranslate' })
}

setMetadata()

const ls = {
  get(key) {
    try {
      return window.localStorage && window.localStorage.getItem && JSON.parse(window.localStorage.getItem(key))
    } catch (e) {
      console.log(e)
    }
  },
  set(key, value) {
    try {
      return window.localStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
    }
  }
}

window.ls = ls

const createComponent = (tag, templateStr, initialState, onInit, onRender, onSetState=noop) => {
  class ReactStyleComponent extends HTMLElement {
    constructor() {
      super();

      // Initialize component state (similar to React's state)
      this.state = Object.assign({}, initialState)
      this.oldState = this.state
      this.events = {}

      // Create a shadow DOM and attach it to the element
      const shadowRoot = this.attachShadow({ mode: 'open' })

      // Define a template for the web component
      const template = document.createElement('template');
      template.innerHTML = templateStr;

      // Clone the template content and append it to the shadow DOM
      shadowRoot.appendChild(template.content.cloneNode(true));

      const qs = shadowRoot.querySelector.bind(shadowRoot)
      this.$ = selector => {
        const e = qs(selector)
        if (selector[0] === '.') {
          return e ? Array.from(e) : []
        } else {
          return e
        }
      }

      this.onRender = onRender
      onInit(this)
    }

    veiwState() {
      return this.state
    }

    // Define a method to set the component state
    setState(stateUpdate, force=false) {
      this.oldState = this.state
      this.state = { ...this.state, ...stateUpdate }

      onSetState(this.oldState, this.state, stateUpdate)


      if (deepEquals(this.state, this.oldState) && !force) return
      this.render()
    }

    // Define a method to render the component
    render() {
      this.onRender(this)
    }

    // Called when the element is connected to the DOM
    connectedCallback() {
      this.render();
    }

    registerEventHandler(event, fn) {
      if (this.events[event]) this.events[event].push(fn)
      else this.events[event] = [fn]
    }
  }

  customElements.define(tag, ReactStyleComponent)
}


// Utils

function random(mn, mx) {
  const out = Math.random()
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

const int = parseInt
const rndint = (mn, mx) => int(random(mn, mx))
const prb = x => random() < x
const sample = (a) => a[int(random(a.length))]
const posOrNeg = () => prb(0.5) ? 1 : -1
const exists = x => !!x
const last = a => a[a.length-1]
const noop = () => {}
const iden = x => x

const deepEquals = (a, b) => (
  Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(aKey => a[aKey] === b[aKey])
)

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

function chance(...chances) {
  const total = chances.reduce((t, c) => t + c[0], 0)
  const seed = random()
  let sum = 0
  for (let i = 0; i < chances.length; i++) {
    const val =
      chances[i][0] === true ? 1
      : chances[i][0] === false ? 0
      : chances[i][0]
    sum += val / total
    if (seed <= sum && chances[i][0]) return chances[i][1]
  }
}


function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  return setInterval(run, ms)
}


function ellipse(txt, len=25) {
  return txt.length >= len
    ? txt.slice(0, len-3) + '...'
    : txt
}


function waitPromise(ms) {
  return new Promise(res => setTimeout(res, ms))
}


function createThrottler(ms) {
  let __throttleTimeoutId
  return function throttle(fn) {
    clearTimeout(__throttleTimeoutId)
    __throttleTimeoutId = setTimeout(fn, ms)
  }
}




const MAX_VOLUME = 0.04

function createSource(waveType = 'square', startingFreq=3000) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioContext()

  const source = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = new StereoPannerNode(ctx)

  source.connect(gain)
  gain.connect(panner)
  panner.connect(ctx.destination)

  gain.gain.value = 0
  source.type = waveType
  source.frequency.value = startingFreq
  source.start()

  const smoothFreq = (value, timeInSeconds=0.001) => {
    source.frequency.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  const smoothPanner = (value, timeInSeconds=0.001) => {
    panner.pan.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  let volume = 0
  const smoothGain = (value, timeInSeconds=0.001) => {
    volume = value || 0

    gain.gain.setTargetAtTime(
      Math.min(value, MAX_VOLUME),
      ctx.currentTime,
      timeInSeconds
    )
  }

  const mute = () => {
    gain.gain.setTargetAtTime(
      Math.min(0, MAX_VOLUME),
      ctx.currentTime,
      0.001
    )
  }
  const unmute = () => {
    gain.gain.setTargetAtTime(
      Math.min(volume, MAX_VOLUME),
      ctx.currentTime,
      0.001
    )
  }

  const src = {
    source, gain, panner,smoothFreq, smoothGain, smoothPanner, originalSrcType: source.type, mute, unmute,
    stop() {
      source.stop()
      this.isStopped = true
    }
  }


  return src
}




// EXPERIMENTAL


class SoundSrc {
  constructor(waveType='sine', startingFreq=440) {
    Object.assign(this, createSource(waveType, startingFreq))
  }

  max() {
    this.smoothGain(MAX_VOLUME)
  }

  silent() {
    this.smoothGain(0)
  }

  async note(freq, ms) {
    this.smoothGain(MAX_VOLUME)
    this.smoothFreq(freq)
    await waitPromise(ms)
    this.smoothGain(0)
  }
}