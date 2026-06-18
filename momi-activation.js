/*
  - larger screen sizing
  - css media for photosensitive people
  - conosle.logs
*/

import { $, random, css, getQueryParam } from './utils.js'
import { mountPageTakeover } from './takeover.js'
import { ARROW_SVGS } from './components.js'

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
    <h1 style="font-size: 32px;">${ARROW_SVGS['→']} CLICK <a href="#" style="animation: ActivationBlink 1s steps(2, start) infinite; color: #00e; text-decoration: underline">HERE</a> TO UPGRADE MOMI WEBSITE</h1>

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
  <upgrade-marquee duration="700" delay="30" direction="-1" style="transition: 1s; z-index: 2;">
    <style>
      @keyframes ActivationBlink {
        to {
          visibility: hidden;
        }
      }
    </style>
    <h1 style="font-size: 16px; margin: 0.25em 0;">THIS SITE INTERRUPTION IS BROUGHT TO YOU BY: Steve Pikelny <span style="display: inline-block; margin: 0 0.75em; animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['↓']}</span> MoMI Site Interruption Activation, 2026 <span style="display: inline-block; margin: 0 0.75em; animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['↓']}</span> Visit the Activation Center: 6/25 - 9/27 <span style="display: inline-block; margin: 0 0.75em; animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['↓']}</span> Learn more about the series at MoMI <a href="#" style="text-decoration: underline; color: #000;">here</a>. <span style="display: inline-block; margin-left: 0.75em; margin-right: -0.75em; animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['↓']}</span></h1></upgrade-marquee>
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
      mountPageTakeover(iframeDocument.body, closePopup, {...takeoverOptions, trigger: 'popup'})
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

        @keyframes BorderRedBlink {
          0%, 100% {
            border-color: rgba(0,0,0,0);
          }

          50% {
            border-color: #f00;
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

        @media (max-width: 715px) {
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
          ${tombstoneMarkup}
        </div>

        <div style="width: 100vw; border-top: 4px solid; padding: 6px; color: #f00; animation: BorderRedBlink 2s steps(1, start) infinite, GreenYellow 10s linear infinite; text-align: center;">
          <h1 style="font-size: 20px; margin: 0">
           <upgrade-blink-chars class="momi-activation-steviep-desktop" duration="1200" offset="125" direction="-1" delay="500">→→→→→</upgrade-blink-chars><span style="display: inline-block; text-align: center">CLICK <a href="#" style="color: #f00; text-decoration: underline; font-weight: 900; animation: ActivationBlink 1s steps(2, start) infinite;">HERE</a> TO ACTIVATE MOMI SITE INTERRUPTION</span><upgrade-blink-chars  class="momi-activation-steviep-desktop" duration="1200" offset="125" direction="1">←←←←←</upgrade-blink-chars>
           </h1>

        </div>
      </div>

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

    setTimeout(() => {
      bottomBanner.style.opacity = '1'
    }, 100)


    const closePopup = () => {
      // bottomBanner.style.display = 'none'
    }

    $.id(bannerId, topDocument).onclick = () => {
      mountPageTakeover(iframeDocument.body, closePopup, {...takeoverOptions, trigger: 'banner'})
      if (takeoverOptions.onPopupAction) takeoverOptions.onPopupAction(topDocument)
      closePopup()
    }

    // On narrow screens, scroll the banner out of view once the user passes the
    // halfway point of the page. It tracks the scroll 1:1: every pixel scrolled
    // down moves the banner down by a pixel (clamped to its own height, fully
    // hidden), and scrolling back up brings it back to its load position.
    let translateY = 0
    let lastScrollY = topWindow.scrollY

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

    const onBannerScroll = () => {
      // Only engage once the visitor has been on the site for 20s+ and the
      // viewport is narrow. performance.now() is ms since page load.
      if (topWindow.innerWidth >= 500 || topWindow.performance.now() < 20000) {
        translateY = 0
        bottomBanner.style.transform = ''
        lastScrollY = topWindow.scrollY
        return
      }

      const scrollY = topWindow.scrollY
      const maxScroll = topDocument.documentElement.scrollHeight - topWindow.innerHeight
      const threshold = maxScroll * 0.5

      if (scrollY <= threshold) {
        translateY = 0
      } else {
        const delta = scrollY - Math.max(lastScrollY, threshold)
        translateY = clamp(translateY + delta, 0, bottomBanner.offsetHeight)
      }

      lastScrollY = scrollY
      bottomBanner.style.transform = `translateY(${translateY}px)`
    }

    topWindow.addEventListener('scroll', onBannerScroll, { passive: true })
    topWindow.addEventListener('resize', onBannerScroll)
  }, mountWait)
}
