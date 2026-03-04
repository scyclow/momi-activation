
export const $ = (elem, prop, value) => elem.style[prop] = value

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


// CSS injection
export function css(style) {
  const s = document.createElement('style')
  s.innerHTML = style
  document.head.appendChild(s)
}


// Utility functions
export function random(mn, mx) {
  const out = Math.random()
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

export const int = parseInt
export const rndint = (mn, mx) => int(random(mn, mx))
export const prb = x => random() < x
export const sample = (a) => a[int(random(a.length))]
export const posOrNeg = () => prb(0.5) ? 1 : -1
export const exists = x => !!x
export const last = a => a[a.length-1]
export const noop = () => {}
export const iden = x => x

export const deepEquals = (a, b) => (
  Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(aKey => a[aKey] === b[aKey])
)

export function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

export function chance(...chances) {
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


export function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  return setInterval(run, ms)
}


export function ellipse(txt, len=25) {
  return txt.length >= len
    ? txt.slice(0, len-3) + '...'
    : txt
}


export function waitPromise(ms) {
  return new Promise(res => setTimeout(res, ms))
}


export function createThrottler(ms) {
  let __throttleTimeoutId
  return function throttle(fn) {
    clearTimeout(__throttleTimeoutId)
    __throttleTimeoutId = setTimeout(fn, ms)
  }
}


// Sound utilities
export const forceResume = (c) => {
  if (c.state === 'interrupted' || c.state === 'suspended') {
    c.resume()
  }
}

export const MAX_VOLUME = 0.04

export function createSource(waveType = 'square', startingFreq=3000) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioContext()


  ctx.onstatechange = () => forceResume(ctx)

  forceResume(ctx)

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
    source, gain, panner,smoothFreq, smoothGain, smoothPanner, originalSrcType: source.type, mute, unmute, ctx,
    stop() {
      source.stop()
      this.isStopped = true
    }
  }


  return src
}


export class SoundSrc {
  constructor(waveType='sine', startingFreq=440) {
    Object.assign(this, createSource(waveType, startingFreq))
  }

  max() {
    this.smoothGain(MAX_VOLUME)
  }

  silent() {
    this.smoothGain(0)
  }

  async note(freq, ms, volume=MAX_VOLUME) {
    forceResume(this.ctx)
    this.smoothGain(volume)
    this.smoothFreq(freq)
    await waitPromise(ms)
    this.smoothGain(0)
  }
}


// Component utilities
export const createComponent = (tag, templateStr, initialState, onInit, onRender, onSetState=noop) => {
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


// Canvas progress component
createComponent(
  'canvas-progress',
  `
    <style>
      :host {
        display: block;
        width: 100%;
      }
      canvas {
        width: 100%;
        height: 8px;
        display: block;
        border: 1px solid #f00;
      }

      #wrapper {
        padding: 8px 0;
      }
    </style>
    <div id="wrapper">
      <canvas></canvas>
    </div>
  `,
  { value: 0, max: 9 },
  ctx => {
    const canvas = ctx.$('canvas')
    ctx.canvas = canvas
    ctx.ctx2d = canvas.getContext('2d')

    if (ctx.getAttribute('value') || ctx.getAttribute('max')) {
      ctx.setState({
        value: Number(ctx.getAttribute('value')) || 0,
        max: Number(ctx.getAttribute('max')) || 9,
      })
    }

    // Handle resize
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.render()
    }

    new ResizeObserver(resize).observe(canvas)
    resize()
  },
  ctx => {
    const { canvas, ctx2d } = ctx
    if (!ctx2d) return

    const { value, max } = ctx.state
    const ratio = max > 0 ? value / max : 0

    // Clear
    ctx2d.clearRect(0, 0, canvas.width, canvas.height)

    // Draw fill
    const fillWidth = canvas.width * ratio

    if (fillWidth > 0) {
      ctx2d.fillStyle = '#f00'
      ctx2d.fillRect(0, 0, fillWidth, canvas.height)
    }
  }
)

export function getCanvasProgress(id) {
  const element = $.id(id)

  return {
    element,
    get value() {
      return element.state?.value ?? 0
    },
    set value(v) {
      if (element.setState) {
        element.setState({ value: v })
      }
    },
    get max() {
      return element.state?.max ?? 9
    },
    set max(v) {
      if (element.setState) {
        element.setState({ max: v })
      }
    }
  }
}


// Metadata utilities
const $html = document.getElementsByTagName('html')[0]

const addMetaTag = (args) => {
  const meta = document.createElement('meta')
  Object.keys(args).forEach(arg => {
    meta[arg] = args[arg]
  })

  document.head.appendChild(meta)
}

export const addThumbnail = (fill) => {
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

function setMetadata() {
  $html.translate = false
  $html.lang = 'en'
  $html.className = 'notranslate'

  addMetaTag({ name: 'google', content: 'notranslate' })
}

setMetadata()

export const ls = {
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
