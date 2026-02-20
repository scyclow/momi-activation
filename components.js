
const noop = () => {}
const deepEquals = (a, b) => (
  Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(aKey => a[aKey] === b[aKey])
)

const createComponent = (tag, templateStr, initialState, onInit, onRender, onSetState=noop) => {
  class ReactStyleComponent extends HTMLElement {
    constructor() {
      super()
      this.state = Object.assign({}, initialState)
      this.oldState = this.state
      this.events = {}
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = templateStr
      shadowRoot.appendChild(template.content.cloneNode(true))
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

    setState(stateUpdate, force=false) {
      this.oldState = this.state
      this.state = { ...this.state, ...stateUpdate }
      onSetState(this.oldState, this.state, stateUpdate)
      if (deepEquals(this.state, this.oldState) && !force) return
      this.render()
    }

    render() { this.onRender(this) }
    connectedCallback() {
      setTimeout(() => this.render(), 0)
    }
  }
  customElements.define(tag, ReactStyleComponent)
}

const defineAnimatingComponent = (tag, animName, keyframesCss, easing='linear', defaultDuration=2000) => {
  createComponent(
    tag,
    `
      <style>
        :host { display: inline-block; }
        #wrapper {
          animation-name: ${animName};
          animation-iteration-count: infinite;
        }
        ${keyframesCss}
      </style>
      <div id="wrapper"><slot></slot></div>
    `,
    {},
    ctx => {},
    ctx => {
      const wrapper = ctx.$('#wrapper')
      if (!wrapper) return

      const duration = Number(ctx.getAttribute('duration') || defaultDuration)
      const delay = -1 * Number(ctx.getAttribute('delay') || 0)
      const direction = Number(ctx.getAttribute('direction') || 1)
      const timingFunction = ctx.getAttribute('timing-function') || easing

      wrapper.style.animationDuration = `${duration}ms`
      wrapper.style.animationDelay = `${delay}ms`
      wrapper.style.animationDirection = direction === -1 ? 'reverse' : 'normal'
      wrapper.style.animationTimingFunction = timingFunction
    }
  )
}


defineAnimatingComponent('upgrade-blink', 'Blink', `
  @keyframes Blink {
    to { visibility: hidden; }
  }
`, 'steps(2, start)', 1500)


defineAnimatingComponent('upgrade-dance', 'Dance', `
  @keyframes Dance {
    0%, 100% { transform: rotate(20deg) }
    50% { transform: rotate(-20deg) }
  }
`, 'cubic-bezier(0.58, 0.06, 0.44, 0.98)', 2000)


defineAnimatingComponent('upgrade-grow-shrink', 'GrowShrink', `
  @keyframes GrowShrink {
    0%, 100% { transform: scale(1) }
    50% { transform: scale(0.2) }
  }
`, 'cubic-bezier(0.58, 0.06, 0.44, 0.98)', 2000)


defineAnimatingComponent('upgrade-grow-shrink-short', 'GrowShrinkShort', `
  @keyframes GrowShrinkShort {
    0%, 100% { transform: scale(1) }
    50% { transform: scale(0.75) }
  }
`, 'cubic-bezier(0.58, 0.06, 0.44, 0.98)', 2000)


defineAnimatingComponent('upgrade-spin', 'Spin', `
  @keyframes Spin {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
`, 'linear', 2000)


defineAnimatingComponent('upgrade-h-siren', 'HSiren', `
  @keyframes HSiren {
    0% { transform: perspective(500px) rotate3d(0,2,0, 0deg) translateZ(100px) }
    100% { transform: perspective(500px) rotate3d(0,2,0, 360deg) translateZ(100px) }
  }
`, 'linear', 2000)


defineAnimatingComponent('upgrade-v-siren', 'VSiren', `
  @keyframes VSiren {
    0% { transform: perspective(500px) rotate3d(2,0,0, 0deg) translateZ(0.75em) }
    100% { transform: perspective(500px) rotate3d(2,0,0, 360deg) translateZ(0.75em) }
  }
`, 'linear', 2000)


defineAnimatingComponent('upgrade-v-siren-short', 'VSirenShort', `
  @keyframes VSirenShort {
    0% { transform: perspective(500px) rotate3d(2,0,0, 0deg) translateZ(0.3em) }
    100% { transform: perspective(500px) rotate3d(2,0,0, 360deg) translateZ(0.3em) }
  }
`, 'linear', 2000)


defineAnimatingComponent('upgrade-h-pivot', 'HPivot', `
  @keyframes HPivot {
    0%, 100% { transform: perspective(500px) rotate3d(0,2,0, 30deg) translateZ(20vmin) scale(0.75) }
    50% { transform: perspective(500px) rotate3d(0,2,0, -30deg) translateZ(20vmin) scale(0.75) }
  }
`, 'cubic-bezier(0.58, 0.06, 0.44, 0.98)', 2000)


defineAnimatingComponent('upgrade-v-pivot', 'VPivot', `
  @keyframes VPivot {
    0%, 100% { transform: perspective(500px) rotate3d(2,0,0, 30deg) translateZ(20vmin) scale(0.5) }
    50% { transform: perspective(500px) rotate3d(2,0,0, -30deg) translateZ(20vmin) scale(0.5) }
  }
`, 'cubic-bezier(0.58, 0.06, 0.44, 0.98)', 2000)


defineAnimatingComponent('upgrade-h-flip', 'HFlip', `
  @keyframes HFlip {
    0% { transform: perspective(500px) rotate3d(0,2,0, 0deg) }
    100% { transform: perspective(500px) rotate3d(0,2,0, 1800deg) }
  }
`, 'cubic-bezier(0.66, 0.05, 0.38, 0.99)', 3500)


defineAnimatingComponent('upgrade-v-flip', 'VFlip', `
  @keyframes VFlip {
    0% { transform: perspective(500px) rotate3d(2,0,0, 0deg) }
    100% { transform: perspective(500px) rotate3d(2,0,0, 1800deg) }
  }
`, 'cubic-bezier(0.66, 0.05, 0.38, 0.99)', 3500)


defineAnimatingComponent('upgrade-breathe', 'Breathe', `
  @keyframes Breathe {
    0%, 100% { transform: scaleX(1) scaleY(1) }
    50% { transform: scaleX(0.8) scaleY(0.9) }
  }
`, 'ease-in-out', 2000)


createComponent(
  'upgrade-flaming-hot',
  `
    <style>
      :host { display: inline-block; }
      #container { position: relative; display: inline-block; }
      slot { display: none; }
      @keyframes FlamingHot {
        0% { transform: scale(1) translateY(0); opacity: 1; }
        75% { opacity: 0; transform: scale(1.15) translateY(-0.2em); }
        80% { opacity: 0; transform: scale(1) translateY(0); }
        100% { opacity: 1; }
      }
    </style>
    <div id="container"></div>
    <slot></slot>
  `,
  {},
  ctx => {
    const slot = ctx.$('slot')
    slot.addEventListener('slotchange', () => ctx.render())
  },
  ctx => {
    const container = ctx.$('#container')
    const slot = ctx.$('slot')
    if (!container || !slot) return

    const nodes = slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === 1 || n.textContent.trim())
    if (!nodes.length) return

    const duration = Number(ctx.getAttribute('duration') || 2000)
    const direction = Number(ctx.getAttribute('direction') || 1)
    const shadows = 5
    container.innerHTML = ''

    for (let t = 0; t < shadows; t++) {
      const copy = document.createElement('div')
      copy.style.display = 'inline-block'
      nodes.forEach(node => copy.appendChild(node.cloneNode(true)))

      copy.style.opacity = (t + 1) / shadows
      copy.style.textShadow = `0 0 ${(shadows - t) * 0.05}em`

      if (t < shadows - 1) {
        // trail copies — animated, stacked behind
        copy.style.position = 'absolute'
        copy.style.top = '0'
        copy.style.left = '0'
        copy.style.animation = `FlamingHot ${duration}ms ease-in-out infinite`
        copy.style.animationDelay = `${duration * -0.25 * (shadows - t)}ms`
        copy.style.animationDirection = direction === -1 ? 'reverse' : 'normal'
      }
      // last copy is static base (no animation)

      container.appendChild(copy)
    }
  }
)


defineAnimatingComponent('upgrade-wave', 'Wave', `
  @keyframes Wave {
    0%, 100% { transform: translate3d(0%, 30%, 0) rotate(0deg) }
    25% { transform: translate3d(0%, 0%, 0) rotate(12deg) }
    50% { transform: translate3d(0%, -30%, 0) rotate(0deg) }
    75% { transform: translate3d(0%, 0%, 0) rotate(-12deg) }
  }
`, 'linear', 4500)


defineAnimatingComponent('upgrade-climb', 'Climb', `
  @keyframes Climb {
    0%, 100% { transform: translate3d(0%, 30%, 0) rotate(0deg) }
    25% { transform: translate3d(0%, 0%, 0) rotate(12deg) }
    50% { transform: translate3d(0%, -30%, 0) rotate(0deg) }
    75% { transform: translate3d(0%, 0%, 0) rotate(-12deg) }
  }
`, 'cubic-bezier(0.66, 0.05, 0.38, 0.99)', 4500)


defineAnimatingComponent('upgrade-hexagon', 'Hexagon', `
  @keyframes Hexagon {
    0%, 100% { transform: translate(0, 0.5em) }
    17% { transform: translate(0.43em, 0.25em) }
    33% { transform: translate(0.43em, -0.25em) }
    50% { transform: translate(0, -0.5em) }
    66% { transform: translate(-0.43em, -0.25em) }
    83% { transform: translate(-0.43em, 0.25em) }
  }
`, 'linear', 2000)


createComponent(
  'upgrade-updown-long',
  `
    <style>
      :host { display: inline-block; height: 100%; }
      #outer {
        height: 100%;
        animation: UpDownLong infinite;
      }
      #inner {
        animation: UpDownLongChild infinite;
      }
      @keyframes UpDownLong {
        0%, 100% { transform: translateY(0) }
        50% { transform: translateY(100%) }
      }
      @keyframes UpDownLongChild {
        0%, 100% { transform: translateY(0) }
        50% { transform: translateY(-100%) }
      }
    </style>
    <div id="outer">
      <div id="inner"><slot></slot></div>
    </div>
  `,
  {},
  ctx => {},
  ctx => {
    const outer = ctx.$('#outer')
    const inner = ctx.$('#inner')
    if (!outer || !inner) return

    const duration = Number(ctx.getAttribute('duration') || 1000)
    const delay = -1 * Number(ctx.getAttribute('delay') || 0)
    const direction = Number(ctx.getAttribute('direction') || 1)
    const timingFunction = ctx.getAttribute('timing-function') || 'ease-in-out'
    const dir = direction === -1 ? 'reverse' : 'normal'

    outer.style.animationDuration = `${duration}ms`
    outer.style.animationDelay = `${delay}ms`
    outer.style.animationDirection = dir
    outer.style.animationTimingFunction = timingFunction
    inner.style.animationDuration = `${duration * 2}ms`
    inner.style.animationDelay = `${delay}ms`
    inner.style.animationDirection = dir
    inner.style.animationTimingFunction = timingFunction
  }
)


createComponent(
  'upgrade-left-right',
  `
    <style>
      :host { display: inline-block; width: 100%; }
      #outer {
        width: 100%;
        animation: LeftRight infinite;
      }
      #inner {
        display: inline-block;
        white-space: nowrap;
        animation: LeftRightChild infinite;
      }
      @keyframes LeftRight {
        0%, 100% { transform: translateX(0) }
        50% { transform: translateX(100%) }
      }
      @keyframes LeftRightChild {
        0%, 100% { transform: translateX(0) }
        50% { transform: translateX(-100%) }
      }
    </style>
    <div id="outer">
      <div id="inner"><slot></slot></div>
    </div>
  `,
  {},
  ctx => {},
  ctx => {
    const outer = ctx.$('#outer')
    const inner = ctx.$('#inner')
    if (!outer || !inner) return

    const duration = Number(ctx.getAttribute('duration') || 2000)
    const delay = -1 * Number(ctx.getAttribute('delay') || 0)
    const direction = Number(ctx.getAttribute('direction') || 1)
    const timingFunction = ctx.getAttribute('timing-function') || 'cubic-bezier(0.58, 0.06, 0.44, 0.98)'
    const dir = direction === -1 ? 'reverse' : 'normal'

    outer.style.animationDuration = `${duration}ms`
    outer.style.animationDelay = `${delay}ms`
    outer.style.animationDirection = dir
    outer.style.animationTimingFunction = timingFunction
    inner.style.animationDuration = `${duration}ms`
    inner.style.animationDelay = `${delay}ms`
    inner.style.animationDirection = dir
    inner.style.animationTimingFunction = timingFunction
  }
)


createComponent(
  'upgrade-marquee',
  `
    <style>
      :host { display: inline-block; width: 100%; box-sizing: border-box; line-height: 1; }
      #inner {
        display: inline-flex;
        animation: Marquee infinite;
      }
      #inner > * {
        display: inline-block;
        white-space: nowrap;
      }
      slot { display: none; }
      @keyframes Marquee {
        0% { transform: translate3d(-50%, 0, 0) }
        100% { transform: translate3d(0%, 0, 0) }
      }
    </style>
    <div id="inner"></div>
    <slot></slot>
  `,
  {},
  ctx => {
    const slot = ctx.$('slot')
    const inner = ctx.$('#inner')

    ctx.buildInner = () => {
      const nodes = slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === 1 || n.textContent.trim())
      if (!nodes.length) return
      inner.innerHTML = ''
      const repeat = 40
      for (let i = 0; i < repeat; i++) {
        nodes.forEach(node => {
          const wrapper = document.createElement('span')
          wrapper.style.marginLeft = '0.5em'
          wrapper.style.marginRight = '0.5em'
          wrapper.appendChild(node.cloneNode(true))
          inner.appendChild(wrapper)
        })
      }
    }

    slot.addEventListener('slotchange', () => ctx.render())
  },
  ctx => {
    const inner = ctx.$('#inner')
    if (!inner) return

    const duration = Number(ctx.getAttribute('duration') || 50)
    const delay = -1 * Number(ctx.getAttribute('delay') || 0)
    const direction = Number(ctx.getAttribute('direction') || 1)
    const timingFunction = ctx.getAttribute('timing-function') || 'linear'

    inner.style.animationDuration = `${duration}s`
    inner.style.animationDelay = `${delay}s`
    inner.style.animationDirection = direction === -1 ? 'reverse' : 'normal'
    inner.style.animationTimingFunction = timingFunction

    // Build inner content
    if (ctx.buildInner) ctx.buildInner()
  }
)


const defineCharComponent = (tag, animClass, keyframesCss, durMin, durMax, timingFn='ease-in-out') => {
  createComponent(
    tag,
    `
      <style>
        :host { display: inline-block; }
        #group { display: inline-block; }
        .word {
          display: inline-block;
          margin-left: 0.25em;
          margin-right: 0.25em;
        }
        .char {
          display: inline-block;
          animation-name: ${animClass};
          animation-iteration-count: infinite;
        }
        .space { margin-right: 0.5em; }
        slot { display: none; }
        ${keyframesCss}
      </style>
      <div id="group"></div>
      <slot></slot>
    `,
    { text: '' },
    ctx => {
      const slot = ctx.$('slot')

      const buildChars = () => {
        const nodes = slot.assignedNodes({ flatten: true })
        const text = nodes.map(n => n.textContent).join('')
        ctx.setState({ text })
      }

      slot.addEventListener('slotchange', buildChars)
    },
    ctx => {
      const group = ctx.$('#group')
      if (!group) return
      const { text } = ctx.state
      const attrDuration = Number(ctx.getAttribute('duration') || 0)
      const direction = Number(ctx.getAttribute('direction') || 1)
      const offset = Number(ctx.getAttribute('offset') || attrDuration/5)
      const timingFunction = ctx.getAttribute('timing-function') || timingFn
      const words = text.split(' ')
      group.innerHTML = ''

      let charIx = direction === 1 ? 0 : text.length

      words.forEach((word, wi) => {
        const wordEl = document.createElement('span')
        wordEl.className = 'word'
        word.split('').forEach(char => {
          const charEl = document.createElement('span')
          charEl.className = 'char'
          charEl.textContent = char
          charEl.style.animationDuration = `${attrDuration}ms`
          charEl.style.animationDelay = `-${charIx * offset}ms`
          charEl.style.animationTimingFunction = timingFunction
          wordEl.appendChild(charEl)
          charIx += direction
        })

        charIx += direction
        group.appendChild(wordEl)
        if (wi < words.length - 1) {
          const space = document.createElement('span')
          space.className = 'space'
          space.textContent = ' '
          group.appendChild(space)
        }
      })
    }
  )
}


defineCharComponent('upgrade-updown-chars', 'UpDownChars', `
  @keyframes UpDownChars {
    0%, 100% { transform: translate3d(0%, 10%, 0) }
    50% { transform: translate3d(0%, -10%, 0) }
  }
`, 100, 500)


defineCharComponent('upgrade-blink-chars', 'BlinkChars', `
  @keyframes BlinkChars {
    to { visibility: hidden; }
  }
`, 200, 600, 'steps(2, start)')


defineCharComponent('upgrade-color-chars', 'ColorChars', `
  @keyframes ColorChars {
    0%, 100% { color: #ff0000 }
    17% { color: #ffff00 }
    33% { color: #00ff00 }
    50% { color: #00ffff }
    66% { color: #0000ff }
    83% { color: #ff00ff }
  }
`, 100, 400, 'steps(6, start)')


defineCharComponent('upgrade-shrink-chars', 'GrowShrinkShortChars', `
  @keyframes GrowShrinkShortChars {
    0%, 100% { transform: scale(1) }
    50% { transform: scale(0.75) }
  }
`, 100, 300)
