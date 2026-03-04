// TODO: add an x on the modal
// TODO: is there a way to not zoom in on phone when you click stuff in the clicker game?
// TODO: is there a way to make the audio work on iphone?
// TODO: on insufficient AT, make cost cell blink solid red
// TODO: each progress bar completion should have a special completion beep on top of the increasing tone

import { $, random, css } from './utils.js'
import { mountPageTakeover } from './takeover.js'


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
    mountPageTakeover(document.body, closePopup)
    closePopup(true)
  }
}


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
}, popupWait)
