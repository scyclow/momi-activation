/*
  - larger screen sizing
  - css media for photosensitive people
  - conosle.logs
*/

import { $, random, css } from './utils.js'
import { mountPageTakeover } from './takeover.js'

import './components.js'

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
    <div style="text-align: right; font-family: sans-serif; height: 18px">
      <span id="closePopup" style="cursor: pointer; font-size: 18px; user-select: none; padding: 14px; transform: translate(10px, -10px); display: inline-block;">X</span>
    </div>
    <h1 style="font-size: 32px;">→ CLICK <a href="#" style="animation: ActivationBlink 1s steps(2, start) infinite; color: #00e; text-decoration: underline">HERE</a> TO UPGRADE MOMI WEBSITE</h1>

    <!--<h1>*WARNING*: MOMI WEBSITE OUT OF DATE: CLICK HERE TO </h1> -->
    <!--<p>(By clicking this link you acknowledge that you don't have photosensitive epilepsy)</p> -->

  </div>
`

export function mountPopupTimeout(popupWait, takeoverOptions={}) {

  const closePopup = (permanantClose=false) => {
    if ($.id(popupId)) $.id(popupId).remove()
    if (!permanantClose) {
      if (!takeoverOptions.constantPopupTime) {
        popupWait *= 3
        setTimeout(mountPopup, popupWait)
      }
    }
  }


  function mountPopup() {
    const popup = $.div(updatePopup, {
      id: popupId,
      style: `
        z-index: 4000;
        position: fixed;
        left: ${takeoverOptions.popupXOverride || random(0, window.innerWidth - 250) + 'px'};
        top: ${takeoverOptions.popupYOverride || random(0, window.innerHeight - 250) + 'px'};
      `
    })
    document.body.appendChild(popup)


    let ignoreMount
    $.id('closePopup').onclick = () => {
      ignoreMount = true
      closePopup()
      if (takeoverOptions.onClose) takeoverOptions.onClose()
      setTimeout(() => ignoreMount = false, 100)
    }

    $.id('momi-activation-popup').onclick = () => {
      if (ignoreMount) return
      mountPageTakeover(document.body, closePopup, takeoverOptions)


  //     const takeover = $.div(`<iframe id="blah" src="./upgrade-iframe.html" style="position: absolute; top: 0; left: 0; width: 50vw; height: 50vh"></iframe>`, {
  //   id: 'takeoverId',
  //   style: `
  //     z-index: 5000;
  //     position: fixed;
  //     top: 0;
  //     left: 0;
  //   `
  // })
  // document.body.appendChild(takeover)

  // console.log('blah', takeover)
      closePopup(true)
    }
  }

  const tombstoneMarquee = $.div(`
            <upgrade-marquee duration="700" delay="0" direction="-1"><h1 style="font-size: 20px">THIS SITE INTERRUPTION IS BROUGHT TO YOU BY: Steve Pikelny <upgrade-blink duration="1000">→</upgrade-blink> b. 1989, United States <upgrade-blink duration="1000">→</upgrade-blink> <em>MoMI Upgrade Activation</em>, 2026 <upgrade-blink duration="1000">→</upgrade-blink> JavaScript, HTML/CSS, Webpage <upgrade-blink duration="1000">→</upgrade-blink> Learn more about the series at MoMI <a href="#" style="text-decoration: underline; color: #000;">here</a>.</h1></upgrade-marquee>
  `, {
    style: `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100vw;
      background: #fff;
      border: 2px solid;
      opacity: 0;
      transition: 300ms;
    `
  })

  document.body.appendChild(tombstoneMarquee)

  setTimeout(() => {
    mountPopup()
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

    setTimeout(() => {
      tombstoneMarquee.style.opacity = 1
    }, 2000)
  }, popupWait)



}

