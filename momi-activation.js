/*
  - larger screen sizing
  - css media for photosensitive people
  - conosle.logs
*/

import { $, random, css, getQueryParam } from './utils.js'
import { mountPageTakeover } from './takeover.js'

import './components.js'

const popupId = 'momi-activation-popup'
const updatePopup = `
  <div
    id="${popupId}"
    style="
      border: 8px solid;
      padding: 10px;
      font-family: sans-serif;
      background: #fff;
      cursor: pointer;
      height: 240px;
      width: 240px;
    "
  >
    <div style="text-align: right; font-family: sans-serif; height: 18px">
      <span id="closePopup" style="cursor: pointer; font-size: 18px; user-select: none; padding: 14px; transform: translate(10px, -10px); display: inline-block;">X</span>
    </div>
    <h1 style="font-size: 32px;">→ CLICK <a href="#" style="animation: ActivationBlink 1s steps(2, start) infinite; color: #00e; text-decoration: underline">HERE</a> TO UPGRADE MOMI WEBSITE</h1>

    <!--<h1>*WARNING*: MOMI WEBSITE OUT OF DATE: CLICK HERE TO </h1> -->
    <!--<p>(By clicking this link you acknowledge that you don't have photosensitive epilepsy)</p> -->

  </div>
  <style>
      @keyframes ActivationBlink {
        to {
          visibility: hidden;
        }
      }


      @media (max-width: 465px) {
        #${popupId} {
          transform: scale(0.85);
        }

        #closePopup {
          font-size: 24px !important;
        }
      }

  </style>
`


const tombstoneMarkup = `
  <upgrade-marquee duration="700" delay="0" direction="-1" style="transition: 1s; z-index: 2;"><h1 style="font-size: 18px">THIS SITE INTERRUPTION IS BROUGHT TO YOU BY: Steve Pikelny <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">→</upgrade-blink> b. 1989, United States <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">→</upgrade-blink> <em>MoMI Upgrade Activation</em>, 2026 <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">→</upgrade-blink> JavaScript, HTML/CSS, Webpage <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">→</upgrade-blink> Learn more about the series at MoMI <a href="#" style="text-decoration: underline; color: #000;">here</a>. <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em;">→</upgrade-blink></h1></upgrade-marquee>
`

export function mountPopupTimeout(popupWait, takeoverOptions={}) {

  const topDocument = takeoverOptions.topDocument || document
  const topWindow = topDocument.defaultView || window
  const iframeDocument = document


  if (takeoverOptions.onLoad) {
    takeoverOptions.onLoad(topDocument)
  }

  let tombstoneMarquee
  if (takeoverOptions.showTombstoneMarquee) {
    tombstoneMarquee = $.div(tombstoneMarkup, {
      style: `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        background: #fff;
        border: 2px solid;
        opacity: 0;
        transition: 1500ms;
        z-index: 2;
      `
    })
    topDocument.body.appendChild(tombstoneMarquee)
  }

  const closePopup = (permanantClose=false) => {
    if ($.id(popupId, topDocument)) $.id(popupId, topDocument).remove()
    if (!permanantClose) {
      if (!takeoverOptions.constantPopupTime) {
        popupWait *= 3
        setTimeout(mountPopup, popupWait)
      }
    }
    if (tombstoneMarquee) {
      tombstoneMarquee.style.display = 'none'
    }
  }


  let popupMounted
  function mountPopup() {
    if (popupMounted) return
    popupMounted = true

    css(`
      * {
        touch-action: manipulation;
      }

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

    const popup = $.div(updatePopup, {
      id: popupId,
      style: `
        z-index: 4000;
        position: fixed;
        left: ${takeoverOptions.popupXOverride || random(10, window.innerWidth - 260) + 'px'};
        top: ${takeoverOptions.popupYOverride || random(100, window.innerHeight - 300) + 'px'};
      `
    })
    topDocument.body.appendChild(popup)




    let ignoreMount
    $.id('closePopup', topDocument).onclick = () => {
      ignoreMount = true
      closePopup()
      if (takeoverOptions.onClose) takeoverOptions.onClose(topDocument)
      if (takeoverOptions.onPopupAction) takeoverOptions.onPopupAction(topDocument)
      setTimeout(() => ignoreMount = false, 100)
    }

    $.id(popupId, topDocument).onclick = () => {
      if (ignoreMount) return
      mountPageTakeover(iframeDocument.body, closePopup, takeoverOptions)
      if (takeoverOptions.onPopupAction) takeoverOptions.onPopupAction(topDocument)
      closePopup(true)
    }

    if (takeoverOptions.showTombstoneMarquee) {
      setTimeout(() => {
        tombstoneMarquee.style.opacity = 1
      }, 100)
    }
  }

  if (takeoverOptions.pageYOffsetMount) {
    topDocument.onscroll = () => {
      if (topWindow.pageYOffset >= takeoverOptions.pageYOffsetMount) {
        setTimeout(() => {
          mountPopup()
        }, 1000)
      }
    }
  }

  setTimeout(() => {
    mountPopup()
  }, popupWait)



}





export function mountBottomBanner(mountWait=0, takeoverOptions={}) {

  const topDocument = takeoverOptions.topDocument || document
  const topWindow = topDocument.defaultView || window
  const iframeDocument = document


  if (takeoverOptions.onLoad) {
    takeoverOptions.onLoad(topDocument)
  }


  const bannerId = 'momi-activation-steviep-banner'

  setTimeout(() => {

    const bottomBanner = $.div(`
      <style>
        @keyframes GreenYellow {
          0%, 100% {
            background: #0f0;
          }

          50% {
            background: #ff0;
          }
        }

        @keyframes ActivationBlink {
          to {
            visibility: hidden;
          }
        }

        .momi-activation-steviep-mobile {
          display: none;
        }

        @media (max-width: 560px) {
          .momi-activation-steviep-desktop {
            display: none;
          }
          .momi-activation-steviep-mobile {
            display: block;
          }
        }
      </style>

      <div>
        <div style="width: 100vw; background: #fff; border-top: 2px solid;">
          <upgrade-marquee duration="700" delay="0" direction="-1" style="transition: 1s; z-index: 2;"><h1 style="font-size: 16px; margin: 0.25em">THIS SITE INTERRUPTION IS BROUGHT TO YOU BY: Steve Pikelny <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">↓</upgrade-blink> b. 1989, United States <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">↓</upgrade-blink> <em>MoMI Upgrade Activation</em>, 2026 <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">↓</upgrade-blink> JavaScript, HTML/CSS, Webpage <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em">↓</upgrade-blink> Learn more about the series at MoMI <a href="#" style="text-decoration: underline; color: #000;">here</a>. <upgrade-blink duration="1000" delay="500" style="margin: 0 0.5em;">↓</upgrade-blink></h1></upgrade-marquee>
        </div>

        <div style="width: 100vw; border-top: 4px solid; padding: 6px; color: #f00; animation: GreenYellow 10s linear infinite; text-align: center;">
          <h1 style="font-size: 20px; margin: 0">
           <upgrade-blink-chars class="momi-activation-steviep-desktop" duration="1200" offset="125" direction="-1" delay="500">→→→→→</upgrade-blink-chars><span style="display: inline-block; text-align: center">CLICK <a href="#" style="color: #f00; text-decoration: underline; font-weight: 900; animation: ActivationBlink 1s steps(2, start) infinite;">HERE</a> TO UPGRADE MOMI WEBSITE</span><upgrade-blink-chars  class="momi-activation-steviep-desktop" duration="1200" offset="125" direction="1">←←←←←</upgrade-blink-chars>
           </h1>

        </div>
      </div>


      <style>
        .heading-title h2 a {
          word-wrap: break-word;
        }
      </style>
    `, {
      id: bannerId,
      style: `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        opacity: 0;
        transition: opacity 1000ms;
        z-index: 3;
        cursor: pointer;
        user-select: none;
      `
    })
    topDocument.body.appendChild(bottomBanner)

    const lvhMeasure = document.createElement('div')
    lvhMeasure.style.cssText = 'position:fixed;height:100lvh;visibility:hidden;pointer-events:none'
    topDocument.body.appendChild(lvhMeasure)
    const lvh = lvhMeasure.offsetHeight
    lvhMeasure.remove()

    const debugPanel = $.div('', {
      style: `
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        padding: 8px;
        z-index: 99999;
        white-space: pre;
      `
    })
    topDocument.body.appendChild(debugPanel)

    let lastVvHeight = topWindow.visualViewport?.height || 0
    const updatePosition = () => {
      const vv = topWindow.visualViewport
      if (vv) {
        if (vv.height > lastVvHeight) {
          bottomBanner.style.bottom = Math.max(0, lvh - vv.height) + 'px'
        } else if (vv.height < lastVvHeight) {
          bottomBanner.style.bottom = '0px'
        }
        lastVvHeight = vv.height
      }
    }

    const updateDebug = () => {
      const vv = topWindow.visualViewport
      debugPanel.textContent = [
        `vv.height:      ${vv ? vv.height.toFixed(1) : 'N/A'}`,
        `innerHeight:    ${topWindow.innerHeight}`,
        `scrollY:        ${topWindow.scrollY.toFixed(2)}`,
        `lvh (const):    ${lvh}`,
        `bottom:         ${bottomBanner.style.bottom}`,
      ].join('\n')
    }

    if (topWindow.visualViewport) {
      topWindow.visualViewport.addEventListener('resize', () => { updatePosition(); updateDebug() })
      topWindow.visualViewport.addEventListener('scroll', () => { updatePosition(); updateDebug() })
    }
    topWindow.addEventListener('scroll', () => { updatePosition(); updateDebug() })
    updatePosition()
    updateDebug()

    setTimeout(() => {
      bottomBanner.style.opacity = '1'
    }, 100)


    const closePopup = () => {
      // bottomBanner.style.display = 'none'
    }

    $.id(bannerId, topDocument).onclick = () => {
      mountPageTakeover(iframeDocument.body, closePopup, takeoverOptions)
      if (takeoverOptions.onPopupAction) takeoverOptions.onPopupAction(topDocument)
      closePopup()
    }
  }, mountWait)
}
