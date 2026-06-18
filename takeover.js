import { $, times, random, sample, prb, SoundSrc, MAX_VOLUME, getCanvasProgress, hapticFeedback } from './utils.js'
import { ARROW_SVGS, warningSvg } from './components.js'

import { setupAnalytics, postSnapshot, teardownAnalytics } from './analytics.js'

export const VALID_ACTIVATION_CODE1 = 'momi2026'
export const VALID_ACTIVATION_CODE2 = 'momi2026!'
let UPGRADE_URL



const curatorialTextId = 'momi-curatorial-text'
const curatorialOverlayId = 'momi-curatorial-overlay'
const closeCuratorialTextId = 'momi-close-curatorial-text'
const modalBgId = 'momi-modal-bg'
const xCloseId = 'momi-x-close'
const ignoreId = 'momi-ignore-button'
const continueId = 'momi-continue-button'
const timerId = 'momi-timer'
const takeoverId = 'momi-activation-takeover'
const containerId = 'momi-takeover-container'
const enterId = 'momi-takeover-enter'
const enterGenerateId = 'momi-enter-generate'
const noCodeId = 'momi-takeover-no-code'
const generateActivationId = 'momi-takeover-generate-activation'
const okId = 'momi-activation-ok'
const activationCodeErrorId = 'momi-activation-code-error'
const activationCodeInputId = 'momi-activation-code-input'
const activationCodeId = 'momi-activation-code'
const activationTokenBalanceId = 'momi-activation-token-balance-code'
const generateTokenId = 'momi-generate-activation-token'

const addAutoGeneratorId = 'momi-add-auto-generator'
const autoGeneratorPriceId = 'momi-auto-generator-price'
const addAutoGeneratorErrId = 'momi-auto-generator-error'
const atPerSecondId = 'momi-at-per-second'
const generateActivationCodeId = 'momi-generate-activation-code'
const resetGeneratorId = 'momi-reset-generator'
const pointerId = 'momi-pointer'
const secondPointerId = 'momi-second-pointer'
const thirdPointerId = 'momi-third-pointer'
const autoGeneratorCostCellId = 'momi-auto-generator-cost-cell'
const generateActivationCodeCostId = 'momi-generator-activation-code-cost'

const atProgress1Id = 'momi-generator-progress-1'
const atProgress2Id = 'momi-generator-progress-2'
const atProgress3Id = 'momi-generator-progress-3'
const atProgress4Id = 'momi-generator-progress-4'


const loadingProgress1Id = 'momi-loading-progress-1'
const loadingProgress2Id = 'momi-loading-progress-2'
const loadingProgress3Id = 'momi-loading-progress-3'
const loadingProgress4Id = 'momi-loading-progress-4'
const loadingProgress5Id = 'momi-loading-progress-5'

const upgradeContinueId = 'momi-upgrade-continue'


const page1 = `
  <h1 style="text-align: center; font-size: 45px; color: #f00; font-family: sans-serif; margin-bottom: 16px">WARNING</h1>
  <div style="width: 45vw;">
    ${times(36, i => `<div style=" display: inline-block; width: 5vw; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: ${-0.1 * i}s;">${warningSvg()}</div>`).join('')}
  </div>

  <div style="height: 32px"></div>

  <div style="display: flex; justify-content: center">
    <button id="${ignoreId}" class="momi-button"">IGNORE</button>
    <button id="${continueId}" class="momi-button" style="margin-left: 24px">CONTINUE <span style="animation: ActivationBlink 1s steps(2, start) infinite;">${ARROW_SVGS['→']}</span></button>
  </div>
`


const page2 = `
  <h1 id="${timerId}" style="text-align: center; font-size: 45px; color: #f00; font-family: sans-serif; margin-bottom: 16px; text-transform: none"></h1>

  <div style="margin-bottom: 6px; font-size: 20px">


    <input id="${activationCodeInputId}" placeholder="ACTIVATION CODE" style="text-align: center; border: 1px solid #f00; border-radius: 2px; padding: 3px; font-size: 100%">

    <div style="display: flex; align-items: center; justify-content: space-between; font-weight: bold; margin: 12px;">
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.5s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.4s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.3s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.2s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.1s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.0s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.1s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.2s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.3s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.4s">${ARROW_SVGS['↑']}</span>
      <span style="color: #f00; animation: ActivationBlink 1s steps(2, start) infinite; animation-delay: -0.5s">${ARROW_SVGS['↑']}</span>
    </div>
  </div>

  <div id="${activationCodeErrorId}" style="color: #f00; margin-bottom: 12px; max-width: 900px; font-size: 16px"></div>

  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <button id="${enterId}" class="momi-button"">ENTER</button>
    <button id="${noCodeId}" class="momi-button" style="margin-top: 12px; font-size: 16px; border: none; text-decoration: underline">I DON'T HAVE AN ACTIVATION CODE</button>
  </div>
`


const page3 = `
  <h1 class="momi-page3-h1" style="text-align: center; font-size: 36px; color: #f00; font-family: sans-serif; max-width: 500px; margin-bottom: 36px">PLEASE VISIT THE "ACTIVATION CENTER" AT:</h1>

    <address style="animation: BorderBlink 1s linear infinite; padding: 24px; max-width: 750px; text-align: center; color: #f00; font-size: 24px; margin-bottom: 36px; font-style: normal">
      <div style="margin-bottom: 6px">MUSEUM OF MOVING IMAGE</div>
      <div style="margin-bottom: 6px">36-01 35 AVE</div>
      <div>ASTORIA, NY 11106</div>
    </address>

  <h1 class="momi-page3-h1" style="font-size: 36px; color: #f00; margin-bottom: 48px; text-align: center">FOR ACTIVATION CODE</h1>

  <!--
    <h1 class="momi-page3-h1" style="font-size: 36px; color: #f00; margin-bottom: 48px; text-align: center">TO RECEIVE THE ACTIVATION CODE</h1>
  -->

  <button id="${okId}" class="momi-button"">ENTER CODE</button>
  <h3 style="text-align: center; color: #f00; margin: 16px 0; font-size: 24px">OR</h3>
  <button id="${generateActivationId}" class="momi-button" style="font-size: 16px; border: none; text-decoration: underline"><span style="animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['→']}</span> GENERATE NEW CODE</button>

`

const page4 = `

<div style="color: #f00; ">
  <div>
    <h3 style="margin-bottom: 16px; text-align: center; font-size: 24px">GENERATE ACTIVATION CODE</h3>

    <div style="padding: 16px; border: 1px solid;">
      <h4 style="margin-bottom: 12px; font-size: 16px; text-align: center">ACTIVATION TOKEN BALANCE: <span style="display: inline-block"><span id="${activationTokenBalanceId}"></span> / 10000</span></h4>

      <style>
        #momi-generator-table {
          margin: auto;
          border-spacing: 0;
        }
        #momi-generator-table, #momi-generator-table td, #momi-generator-table th {
          border: none;
        }

        #momi-generator-table td, #momi-generator-table th {
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          vertical-align: middle;
          overflow: visible;
          padding: 6px 12px;
          padding-left: 0;
        }

        #momi-generator-table th {
          font-size: 10px;
        }
        #momi-generator-table td:first-child {
          text-align: left;
        }

      </style>

      <table id="momi-generator-table">
        <tr>
          <th>ACTION</th>
          <th>COST</th>
        </tr>
        <tr>
          <td>
            <button id="${generateTokenId}" class="momi-button" style="font-size: 12px"><span id="${pointerId}" style="animation: ActivationBlink 1s steps(2, start) infinite; position: absolute; transform: translate(-40px, -4px); font-size: 18px; color: #f00; font-weight: bold;">${ARROW_SVGS['→']}</span>+1 A<span style="letter-spacing: -1px">.T</span>.</button>
          </td>
          <td>0</td>
        </tr>

        <tr>
          <td>
            <button id="${addAutoGeneratorId}" class="momi-button" style="font-size: 12px; text-transform: none;"><span id="${secondPointerId}" style="animation: ActivationBlink 1s steps(2, start) infinite; position: absolute; transform: translate(-40px, -4px); font-size: 18px; color: #f00; display: none; font-weight: bold;">${ARROW_SVGS['→']}</span>+1 A<span style="letter-spacing: -1px">.T</span>./sec</button>
          </td>
          <td>
            <div id="${autoGeneratorCostCellId}" style="padding: 4px"><span id="${autoGeneratorPriceId}"></span></div>
          </td>
        </tr>

        <tr>
          <td>
            <button id="${generateActivationCodeId}" class="momi-button" style="font-size: 12px; "><span id="${thirdPointerId}" style="animation: ActivationBlink 1s steps(2, start) infinite; position: absolute; transform: translate(-40px, -4px); font-size: 18px; color: #f00; display: none; font-weight: bold;">${ARROW_SVGS['→']}</span>GENERATE</button>
          </td>
          <td>
            <div id="${generateActivationCodeCostId}" style="padding: 4px">10000</div>
          </td>
        </tr>
      </table>

      <div id="${addAutoGeneratorErrId}" style=" text-align: center; font-size: 16px; font-weight: bold;"></div>

      <div>
        <canvas-progress id="${atProgress1Id}"></canvas-progress>
        <canvas-progress id="${atProgress2Id}"></canvas-progress>
        <canvas-progress id="${atProgress3Id}"></canvas-progress>
        <canvas-progress id="${atProgress4Id}"></canvas-progress>
      </div>

      <div style="display: flex; justify-content: space-between">
        <h5 style="font-size: 12px; margin-bottom: 0; margin-top: 8px; text-transform: none"> A<span style="letter-spacing: -1px">.T</span>./sec: <span id="${atPerSecondId}">0</span></h5>
        <button id="${resetGeneratorId}" class="momi-button" style="font-size: 12px; border: none; text-decoration: underline">RESET</button>
      </div>
    </div>

      <h4 style="text-align: center; margin-top: 12px; font-size: 12px">ACTIVATION CODE: <span id="${activationCodeId}" style="margin-left:6px; display: inline-block; font-family: monospace; animation: ActivationBlink 1s steps(2, start) infinite">_ _ _ _ _ _ _ _</span></h4>

      <button id="${enterGenerateId}" class="momi-button" style="display: none; margin: auto; margin-top: 8px">ENTER CODE</button>

  </div>

  <style>
      @keyframes ErrorBlink {
        0%, 49.9%, 100% {
          background: #f00;
        }

        50%, 99.9% {
          background: none;
        }
      }
  </style>
</div>

`

const page5 = `
  <h1 style="text-align: center; font-size: 32px; color: #f00; font-family: sans-serif; margin-bottom: 16px">LOADING<span style="animation: ActivationBlink 1s steps(2, start) infinite">...</span></h1>

  <div style="width: 80%; max-width: 850px">
    <canvas-progress id="${loadingProgress1Id}" max="100"></canvas-progress>
    <canvas-progress id="${loadingProgress2Id}" style="display: none; margin-top: 10px" max="100"></canvas-progress>
    <canvas-progress id="${loadingProgress3Id}" style="display: none; margin-top: 10px" max="100"></canvas-progress>
    <canvas-progress id="${loadingProgress4Id}" style="display: none; margin-top: 10px" max="100"></canvas-progress>
    <canvas-progress id="${loadingProgress5Id}" style="display: none; margin-top: 10px" max="100"></canvas-progress>

  </div>
`

const page6 = `
  <h1 style="text-align: center; font-size: 32px; color: #f00; font-family: sans-serif; margin-bottom: 16px">CONGRATULATIONS<span style="animation: ActivationBlink 1s steps(2, start) infinite">!</span></h1>

  <a id="${upgradeContinueId}" class="momi-button" style="margin-top: 12px; font-size: 16px; border: none; text-decoration: underline" target="_blank">CONTINUE TO THE MOMI 2.0 WEBSITE* <span style="animation: ActivationBlink 1s steps(2, start) infinite">${ARROW_SVGS['→']}</span></a>

  <div style="font-size: 8px; text-transform: uppercase; max-width: 500px; margin-top: 24px; color: #f00; text-align: justify; line-height: 1.1;">*BY CLICKING THIS LINK YOU HEREBY ACKNOWLEDGE THAT YOU ARE LEAVING THE MUSEUM OF THE MOVING IMAGE WEBSITE AND ENTERING A THIRD-PARTY WEBSITE, OWNED AND OPERATED BY AN INDEPENDENT PARTY OVER WHICH THE MUSEUM OF THE MOVING IMAGE HAS NO CONTROL. THE MUSEUM OF THE MOVING IMAGE BEARS NO RESPONSIBILITY FOR THE ACCURACY, LEGALITY, OR CONTENT OF THE EXTERNAL SITE. THE MUSEUM OF THE MOVING IMAGE DISCLAIMS ALL LIABILITY FOR ANY LOSS, DAMAGE, AND OTHER CONSEQUENCES RESULTING DIRECTLY OR INDIRECTLY FROM YOUR ACCESS TO THE THIRD-PARTY WEBSITE, INCLUDING ANY ERROR, OMISSION, OR MISREPRESENTATION ON THE THIRD-PARTY WEBSITE, THE COLLECTION, USE, SHARING, OR SALE OF YOUR PERSONAL DATA BY THE THIRD-PARTY OPERATOR, OR ANY COMPUTER VIRUS OR SYSTEM FAILURE ARISING FROM OR ASSOCIATED WITH THE THIRD-PARTY WEBSITE.</div>
`


const pageTakeover = `
  <div
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column
    "
  >
    <div
      id="${modalBgId}"
      style="
        width: 100vw;
        height: 100vh;
        background: #000;

        position: fixed;
        left: 0;
        top: 0;
        cursor: pointer;
      "
    ></div>


    <div style="height: 0; display: flex; justify-content: end; z-index: 999; width: 95vw">
      <div id="${xCloseId}" style="cursor: pointer; color: #f00; padding: 16px; height: 64px; font-size: 32px; user-select: none">Ｘ</div>
    </div>
    <div
      id="${containerId}"
      style="
        touch-action: manipulation;
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



  <div
    id="${curatorialOverlayId}"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      opacity: 0;
    "
  ></div>

  <div
    id="${curatorialTextId}"
    style="
      border: 8px solid;

      font-family: sans-serif;
      background: #fff;
      height: 65vh;
      width: 43vw;
      min-width: 300px;
      min-height: 450px
      max-width: 550px;
      max-height: 90vh;
      position: absolute;
      z-index: 1001;
      display: none;
      text-align: justify;
      bottom: 16%;
      transform: translateX(2vw);
    "
  >
    <div style="text-align: right; font-family: sans-serif; height: 0px">
      <span id="${closeCuratorialTextId}" style="cursor: pointer; font-size: 18px; user-select: none; padding: 14px; transform: translate(5px, -5px); display: inline-block;">X</span>
    </div>
    <div style="overflow: scroll; padding: 25px; display: flex; justify-content: center; height: 100%">
      <div style="width: 500px; height: 425px;">
        <p style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 2px">Steve Pikelny (b. 1989, United States) </p>
        <p style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 2px">MoMI Upgrade Activation, 2026</p>
        <p style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 2px">JavaScript, HTML/CSS, webpage with sound </p>

        <h1 style="font-size: 20px; text-transform: uppercase; text-align: center; padding: 0 10px; margin-top: 16px"><span style="animation: ActivationBlink 1s steps(2, start) infinite">ATTN:</span> The Museum of the Moving Image website has been “upgraded” by artists</h1>

        <p style="line-height: 1.3;">Don’t worry. We asked for this, as part of Site Interruptions, a series of artist projects that unfold across MoMI’s homepage and in unexpected locations throughout the Museum from June 2026 to June 2027.</p>

        <p style="margin-top: 16px; line-height: 1.3;">Pikelny is an artist and engineer whose websites channel the spammy, conspiratorial, and aggressively monetized corners of the internet. For this project, he has turned our homepage into something between a browser hijacker and a clicker game, evoking an earlier web overrun by scams, pop-ups, and dubious promises.</p>

        <p style="margin-top: 16px; line-height: 1.3;">All of it is intentional and none of it is real. The homepage has not been hacked but it has been commissioned!</p>
      </div>

    </div>

  </div>
  <style>
      @keyframes ActivationBlink {
        to {
          visibility: hidden;
        }
      }


      @media (max-width: 465px) {
        #${curatorialTextId} {
          transform: scale(0.85);
        }

        #closePopup {
          font-size: 24px !important;
        }
      }

  </style>




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
  </style>



  </div>

`


let stopMusic = false
let atBalance = 0

const soundIntervals = []
const autoGenerators = []

const startSoundInterval = (freq=300, len=300) => {
  const s = new SoundSrc('square')

  soundIntervals.push(
    setInterval(() => {
      s.note(freq, len)
    }, 2000)
  )
}

const stopSoundIntervals = () => {
  soundIntervals.forEach(i => clearInterval(i))
  autoGenerators.forEach(i => clearInterval(i))
  stopMusic = true
}


export function mountPageTakeover($element, closeAll=()=>{}, options={}) {
  const baseNote = new SoundSrc('square')
  const baseNote2 = new SoundSrc('square')


  const takeover = $.div(pageTakeover, {
    id: takeoverId,
    style: `
      z-index: 5000;
      position: fixed;
      top: 0;
      left: 0;
    `
  })
  $element.appendChild(takeover)
  startSoundInterval()

  setupAnalytics(() => ({
    autoGeneratorCount: autoGenerators.length,
    atBalance,
  }), options.trigger)
  postSnapshot({ page1: true })


  if (options.showCuratorialText) {
    setTimeout(() => {
      $.id(curatorialTextId).style.display = 'flex'
      $.id(curatorialTextId).style.flexDirection = 'column'

    }, 500)

    const closeCuratorialText = () => {
      baseNote.note(600, 75)
      $.id(curatorialTextId).style.display = 'none'
      $.id(curatorialOverlayId).style.display = 'none'
    }

    $.id(closeCuratorialTextId).onclick = closeCuratorialText
    $.id(curatorialOverlayId).onclick = closeCuratorialText
  }


  $.id(modalBgId).style.opacity = options.opacity || 0


  let timerInterval

  const closeModal = () => {
    atBalance = 0

    baseNote.note(150, 75)


    stopSoundIntervals()
    clearInterval(timerInterval)
    postSnapshot({ modalClosed: true })
    teardownAnalytics()
    takeover.remove()
    closeAll()
    if (options.onClose) options.onClose(options.topDocument)
    document.removeEventListener('keydown', onEscape)
  }

  const onEscape = (e) => {
    if (e.key === 'Escape') closeModal()
  }
  document.addEventListener('keydown', onEscape)


  if (options.displayX) {
    $.id(xCloseId).onclick = closeModal
  } else {
    $.id(xCloseId).style.display = 'none'
  }




  $.id(modalBgId).onclick = closeModal
  $.id(ignoreId).onclick = () => {
    closeModal()
    hapticFeedback()
  }
  $.id(continueId).onclick = () => {
    gotoActivationEntry()
    baseNote.note(450, 50)
    hapticFeedback()
  }


  const gotoActivationEntry = () => {
    startSoundInterval(250)

    $.id(curatorialTextId).style.display = 'none'


    $.id(containerId).innerHTML = page2

    timerInterval = triggerTimer(60812000, $.id(timerId))

    postSnapshot({ page2: true })


    let invalidCodeEntered = false
    $.id(enterId).onclick = () => {

      startSoundInterval(250, 200)
      baseNote.note(450, 50)


      hapticFeedback()


      const enteredActivationCode = $.id(activationCodeInputId).value

      if (enteredActivationCode.replaceAll(' ', '').trim().toLowerCase() === VALID_ACTIVATION_CODE1) {
        gotoLoadingScreen()
        UPGRADE_URL = 'https://steviep.xyz/momi-activation/upgrade'
        postSnapshot({ primaryCodeUsed: true })

      } else if (enteredActivationCode.replaceAll(' ', '').trim().toLowerCase() === VALID_ACTIVATION_CODE2) {
        gotoLoadingScreen()
        UPGRADE_URL = 'https://steviep.xyz/momi-activation/upgrade2'
        postSnapshot({ secondaryCodeUsed: true })

      } else {
        $.id(activationCodeErrorId).innerHTML += 'INVALID ACTIVATION CODE '

        if (!invalidCodeEntered) {
          postSnapshot({ invalidCodeUsed: true })
        }

        invalidCodeEntered = true
      }
    }

    $.id(noCodeId).onclick = () => {
      gotoActivationCenter()
      baseNote.note(450, 50)
      hapticFeedback()
    }

  }


  const gotoActivationCenter = () => {
    clearInterval(timerInterval)
    startSoundInterval(350)
    $.id(containerId).innerHTML = page3

    postSnapshot({ page3: true })


    $.id(okId).onclick = () => {
      gotoActivationEntry()
      baseNote.note(450, 50)
      hapticFeedback()
    }

    $.id(generateActivationId).onclick = () => {
      gotoActivationGenerate()
      hapticFeedback()
    }

  }



  const gotoActivationGenerate = () => {
    stopSoundIntervals()

    baseNote.note(220, 300)

    $.id(containerId).innerHTML = page4


    postSnapshot({ page4: true })


    let autoGeneratorPrice = 10

    const getGeneratorPrice = () => options.stableGeneratorPrice
        ? 10
        : autoGeneratorPrice

    const render = () => {
      $.id(activationTokenBalanceId).innerHTML = String(atBalance).padStart(5, '0')
      $.id(autoGeneratorPriceId).innerHTML = getGeneratorPrice()

      const p1 = getCanvasProgress(atProgress1Id)
      const p2 = getCanvasProgress(atProgress2Id)
      const p3 = getCanvasProgress(atProgress3Id)
      const p4 = getCanvasProgress(atProgress4Id)

      if (atBalance === 10000) {
        p1.value = 9
        p2.value = 9
        p3.value = 9
        p4.value = 9

      } else {
        p1.value = atBalance % 10
        p2.value = Math.floor(atBalance / 10) % 10
        p3.value = Math.floor(atBalance / 100) % 10
        p4.value = Math.floor(atBalance / 1000) % 10
      }

      $.id(atPerSecondId).innerHTML = `${autoGenerators.length}`

      if (atBalance >= 10000) {
        $.id(thirdPointerId).style.display = 'inline-block'
      }
    }

    render()

    $.id(resetGeneratorId).onclick = () => {
      stopSoundIntervals()
      autoGenerators.length = 0
      atBalance = 0
      autoGeneratorPrice = 10
      $.id(addAutoGeneratorErrId).innerHTML = ''

      baseNote.note(440*0.666, 60)
      baseNote2.note(880*0.666, 60)

      render()

      hapticFeedback()

      postSnapshot({ clickerReset: true, primaryCodeUsed: true })


      setTimeout(() => {
        UPGRADE_URL = 'https://steviep.xyz/momi-activation/upgrade'
        stopSoundIntervals()
        gotoLoadingScreen()
      }, 40)
    }
    let errorTimeout

    let totalNotes = 0
    const allNotes = []

    $.id(addAutoGeneratorId).onclick = () => {
      hapticFeedback()


      if (atBalance >= getGeneratorPrice()) {
      // if (atBalance >= 1) {

        $.id(secondPointerId).style.display = 'none'

        baseNote.note(440*1.333, 60)

        atBalance -= getGeneratorPrice()
        autoGeneratorPrice += 1

        let n

        if (totalNotes < 40) {
          n = new SoundSrc('square')
          allNotes.push(n)
        } else {
          n = allNotes[totalNotes % 40]
        }
        totalNotes++

        autoGenerators.push(setInterval(() => {
          if (atBalance < 10000) {
            atBalance += 1
            if (atBalance % 1000 === 0) {
              baseNote.note(220, 10)

              setTimeout(() => {
                baseNote.note(220, 80)
              }, 20)
            } else if (atBalance % 100 === 0) {
              n.note(880, 15)
            } else if (atBalance % 10 === 0) {
              n.note(660, 10)
            } else {
              n.note(440, 10)
            }
          }

          render()
        }, 1000))

        clearTimeout(errorTimeout)

        $.id(addAutoGeneratorErrId).innerHTML = ''
        $.id(autoGeneratorCostCellId).style.animation = ''
        $.id(generateActivationCodeCostId).style.animation = ''
        $.id(activationTokenBalanceId).style.animation = ''

      } else {
        $.id(addAutoGeneratorErrId).innerHTML = 'INSUFFICIENT ACTIVATION TOKEN BALANCE'
        $.id(autoGeneratorCostCellId).style.animation = 'ErrorBlink 1s steps(2, start) infinite'
        $.id(activationTokenBalanceId).style.animation = 'ErrorBlink 1s steps(2, start) -0.5s infinite'

        clearTimeout(errorTimeout)

        errorTimeout = setTimeout(() => {
          $.id(addAutoGeneratorErrId).innerHTML = ''
          $.id(autoGeneratorCostCellId).style.animation = ''
          $.id(generateActivationCodeCostId).style.animation = ''
          $.id(activationTokenBalanceId).style.animation = ''
        }, 4000)
      }

      render()

    }


    let secondPointerDisplayed

    $.id(generateTokenId).onclick = () => {
      hapticFeedback()

      if (atBalance < 10000) {
        atBalance += 1
        if (atBalance % 1000 === 0) {
          baseNote.note(220, 10)

          setTimeout(() => {
            baseNote.note(220, 80)
          }, 20)
        } else if (atBalance % 100 === 0) {
          baseNote.note(880, 15)
        } else if (atBalance % 10 === 0) {
          baseNote.note(660, 10)
        } else {
          baseNote.note(440, 10)
        }
      } else {
        baseNote.note(220, 20)
      }

      if (!secondPointerDisplayed && atBalance >= 10) {
        secondPointerDisplayed = true
        $.id(secondPointerId).style.display = 'inline-block'
        $.id(pointerId).style.display = 'none'
      }

      clearTimeout(errorTimeout)
      $.id(addAutoGeneratorErrId).innerHTML = ''
      $.id(autoGeneratorCostCellId).style.animation = ''
      $.id(generateActivationCodeCostId).style.animation = ''
      $.id(activationTokenBalanceId).style.animation = ''

      render()
    }

    const randChar = () => sample('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%')

    $.id(generateActivationCodeId).onclick = () => {
      hapticFeedback()

      if (atBalance >= 10000) {

        postSnapshot({
          activationCodeGenerated: true,
          autoGeneratorCount: autoGenerators.length,
          atBalance,
        })

        $.id(thirdPointerId).style.display = 'none'

        atBalance -= 10000

        $.id(activationCodeId).style.animation = 'none'

        const changeInterval = setInterval(() => {
          $.id(activationCodeId).innerHTML = times(8, () => randChar() + ' ').join('')
        }, 20)

        setTimeout(() => {
          clearInterval(changeInterval)
          $.id(activationCodeId).innerHTML = VALID_ACTIVATION_CODE1.split('').join(' ').toUpperCase()

          $.id(enterGenerateId).style.display = 'block'
        }, 3000)

        clearTimeout(errorTimeout)

        $.id(addAutoGeneratorErrId).innerHTML = ''
        $.id(autoGeneratorCostCellId).style.animation = ''
        $.id(generateActivationCodeCostId).style.animation = ''
        $.id(activationTokenBalanceId).style.animation = ''

      } else {
        $.id(addAutoGeneratorErrId).innerHTML = 'INSUFFICIENT ACTIVATION TOKEN BALANCE'
        $.id(generateActivationCodeCostId).style.animation = 'ErrorBlink 1s steps(2, start) infinite'
        $.id(activationTokenBalanceId).style.animation = 'ErrorBlink 1s steps(2, start) -0.5s infinite'

        clearTimeout(errorTimeout)

        errorTimeout = setTimeout(() => {
          $.id(addAutoGeneratorErrId).innerHTML = ''
          $.id(autoGeneratorCostCellId).style.animation = ''
          $.id(generateActivationCodeCostId).style.animation = ''
          $.id(activationTokenBalanceId).style.animation = ''
        }, 4000)
      }
    }


    $.id(enterGenerateId).onclick = () => {
      stopSoundIntervals()
      gotoActivationEntry()
    }

  }


  const gotoLoadingScreen = () => {
    stopSoundIntervals()

    stopMusic = false

    $.id(containerId).innerHTML = page5

    postSnapshot({ page5: true })


    const lps = [
      getCanvasProgress(loadingProgress1Id),
      getCanvasProgress(loadingProgress2Id),
      getCanvasProgress(loadingProgress3Id),
      getCanvasProgress(loadingProgress4Id),
      getCanvasProgress(loadingProgress5Id),
    ]

    let lpIx = 0

    let baseFreq = 100

    const lpInterval = setInterval(() => {
      if (stopMusic) return

      const lp = lps[lpIx]

      if (prb(0.3)) {
        baseNote.note(baseFreq, 20)
        setTimeout(() => baseNote2.note(baseFreq/2, 20, MAX_VOLUME * 0.75), 10)
        lp.value += 1
        baseFreq += 1
      }

      if (lp.value === 100) {
        lpIx++

        if (lpIx >= lps.length) {
          clearInterval(lpInterval)

          baseNote.note(440, 100)
          setTimeout(() => baseNote.note(440 * 1.25, 100), 125)
          setTimeout(() => baseNote.note(440 * 1.5, 100), 250)
          setTimeout(() => baseNote.note(440 * 2, 100), 375)

          setTimeout(() => {
            gotoCongratulationsScreen()
          }, 1000)


        } else {
          baseNote.note(440 * (1 + (lpIx-1) * 0.25), 100)
          lps[lpIx].element.style.display = 'block'
        }

      }
    }, 20)
  }

  const gotoCongratulationsScreen = () => {
    $.id(containerId).innerHTML = page6
    postSnapshot({ page6: true })

    stopMusic = false

    $.id(upgradeContinueId).href = UPGRADE_URL

    $.id(upgradeContinueId).onclick = () => {
      postSnapshot({ upgraded: true })

    }

    const s = new SoundSrc('square')


    const notes1 = [
      [440, 2], [440, 1], [493.88, 3], [440, 3], [587.33, 3], [554.37, 6],
      [440, 2], [440, 1], [493.88, 3], [440, 3], [659.25, 3], [587.33, 6],
      [440, 2], [440, 1], [880, 3], [739.99, 3], [587.33, 2], [587.33, 1], [554.37, 3], [493.88, 6],
      [783.99, 2], [783.99, 1], [739.99, 3], [587.33, 3], [659.25, 3], [587.33, 6],
    ]

    const noteLen = 667 / 3

    let toneMuted = false
    function playNote(notes, i) {
      const n = notes[i % notes.length]
      baseNote.smoothGain(stopMusic || toneMuted ? 0 : MAX_VOLUME)
      baseNote.smoothFreq(n[0])

      if (!stopMusic) {
        setTimeout(() => baseNote.smoothGain(0), n[1] * noteLen - 15)
        setTimeout(() => playNote(notes, i+1), n[1] * noteLen)
      }
    }

    playNote(notes1, 0)

    document.addEventListener('visibilitychange', () => {
      toneMuted = !!document.hidden
    })

  }

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
