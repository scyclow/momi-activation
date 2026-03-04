import { $, times, random, sample, prb, SoundSrc, MAX_VOLUME, getCanvasProgress } from './utils.js'

export const VALID_ACTIVATION_CODE = 'MOMI2026'


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

const atProgress1Id = 'momi-generator-progress-1'
const atProgress2Id = 'momi-generator-progress-2'
const atProgress3Id = 'momi-generator-progress-3'
const atProgress4Id = 'momi-generator-progress-4'


const loadingProgress1Id = 'momi-loading-progress-1'
const loadingProgress2Id = 'momi-loading-progress-2'
const loadingProgress3Id = 'momi-loading-progress-3'
const loadingProgress4Id = 'momi-loading-progress-4'
const loadingProgress5Id = 'momi-loading-progress-5'


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


    <input id="${activationCodeInputId}" placeholder="ACTIVATION CODE" style="text-align: center; border: 1px solid #f00; border-radius: 2px; padding: 3px; font-size: 100%">

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
  <button id="${generateActivationId}" class="momi-button" style="font-size: 16px; border: none; text-decoration: underline"><span style="animation: ActivationBlink 1s steps(2, start) infinite">→</span> GENERATE NEW CODE</button>

`

const page4 = `

<div style="color: #f00; ">
  <div>
    <h3 style="margin-bottom: 16px; text-align: center; font-size: 24px">GENERATE ACTIVATION CODE</h3>

    <div style="padding: 16px; border: 1px solid;">
      <h4 style="margin-bottom: 12px; font-size: 16px">ACTIVATION TOKEN BALANCE: <span id="${activationTokenBalanceId}"></span> / 10000</h4>

      <style>
        #momi-generator-table {
          margin: auto;
        }
        #momi-generator-table, #momi-generator-table td, #momi-generator-table th {
          border: none;
          padding-left: 0;
        }

        #momi-generator-table td, #momi-generator-table th {
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          vertical-align: middle;
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
            <button id="${generateTokenId}" class="momi-button" style="font-size: 12px"><span id="${pointerId}" style="animation: ActivationBlink 1s steps(2, start) infinite; width: 0; position: absolute; transform: translateX(-36px)">→</span>+1 AT</button>
          </td>
          <td>0</td>
        </tr>

        <tr>
          <td>
            <button id="${addAutoGeneratorId}" class="momi-button" style="font-size: 12px; ">+1 AT/s</button>
          </td>
          <td>
            <div style=""><span id="${autoGeneratorPriceId}"></span></div>
          </td>
        </tr>

        <tr>
          <td>
            <button id="${generateActivationCodeId}" class="momi-button" style="font-size: 12px; ">GENERATE</button>
          </td>
          <td>
            <div style="">10000</div>
          </td>
        </tr>
      </table>

      <div id="${addAutoGeneratorErrId}" style=" text-align: center; animation: ActivationBlink 1s steps(2, start) infinite; font-size: 16px; font-weight: bold;"></div>

      <div>
        <canvas-progress id="${atProgress1Id}"></canvas-progress>
        <canvas-progress id="${atProgress2Id}"></canvas-progress>
        <canvas-progress id="${atProgress3Id}"></canvas-progress>
        <canvas-progress id="${atProgress4Id}"></canvas-progress>
      </div>

      <div style="display: flex; justify-content: space-between">
        <h5 style="font-size: 12px; margin-bottom: 0; margin-top: 8px"> AT/s: <span id="${atPerSecondId}">0</span></h5>
        <button id="${resetGeneratorId}" class="momi-button" style="font-size: 12px; border: none; text-decoration: underline">RESET</button>
      </div>
    </div>

      <h4 style="text-align: center; margin-top: 12px; font-size: 12px">ACTIVATION CODE: <span id="${activationCodeId}" style="margin-left:6px; display: inline-block; font-family: monospace; animation: ActivationBlink 1s steps(2, start) infinite">_ _ _ _ _ _ _ _</span></h4>

      <button id="${enterGenerateId}" class="momi-button" style="display: none; margin: auto">ENTER CODE</button>

  </div>
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

  <button class="momi-button" style="margin-top: 12px; font-size: 16px; border: none; text-decoration: underline">CONTINUE TO THE MOMI 2.0 WEBSITE <span style="animation: ActivationBlink 1s steps(2, start) infinite">→</span></button>

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
}


export function mountPageTakeover($element, closeAll=()=>{}) {
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


  let timerInterval



  const closeModal = () => {
    stopSoundIntervals()
    clearInterval(timerInterval)
    takeover.remove()
    closeAll()
  }


  const gotoActivationEntry = () => {
    startSoundInterval(250)

    $.id(containerId).innerHTML = page2

    timerInterval = triggerTimer(60812000, $.id(timerId))

    $.id(enterId).onclick = () => {

      startSoundInterval(250, 200)

      const enteredActivationCode = $.id(activationCodeInputId).value

      if (enteredActivationCode.replaceAll(' ', '').trim() !== VALID_ACTIVATION_CODE) {
        $.id(activationCodeErrorId).innerHTML += 'INVALID ACTIVATION CODE '
      } else {
        gotoLoadingScreen()

      }
    }

    $.id(noCodeId).onclick = gotoActivationCenter

  }


  const gotoActivationCenter = () => {
    clearInterval(timerInterval)
    startSoundInterval(350)
    $.id(containerId).innerHTML = page3

    $.id(okId).onclick = gotoActivationEntry

    $.id(generateActivationId).onclick = gotoActivationGenerate

  }



  const gotoActivationGenerate = () => {
    stopSoundIntervals()

    baseNote.note(220, 300)

    $.id(containerId).innerHTML = page4


    let atBalance = 0
    let autoGeneratorPrice = 10

    const render = () => {
      $.id(activationTokenBalanceId).innerHTML = String(atBalance).padStart(5, '0')
      $.id(autoGeneratorPriceId).innerHTML = autoGeneratorPrice

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
    }

    let totalNotes = 0
    const allNotes = []

    $.id(addAutoGeneratorId).onclick = () => {

      if (atBalance >= autoGeneratorPrice) {
        baseNote.note(440*1.333, 60)

        atBalance -= autoGeneratorPrice
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
      } else {
        $.id(addAutoGeneratorErrId).innerHTML = 'INSUFFICIENT ACTIVATION TOKEN BALANCE'
        setTimeout(() => {
          $.id(addAutoGeneratorErrId).innerHTML = ''
        }, 4000)
      }

      render()

    }



    $.id(generateTokenId).onclick = () => {
      $.id(pointerId).style.display = 'none'
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
      render()
    }

    const randChar = () => sample('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%')

    $.id(generateActivationCodeId).onclick = () => {
      if (atBalance >= 10000) {
        atBalance -= 10000

        $.id(activationCodeId).style.animation = 'none'

        const changeInterval = setInterval(() => {
          $.id(activationCodeId).innerHTML = times(8, () => randChar() + ' ').join('')
        }, 20)

        setTimeout(() => {
          clearInterval(changeInterval)
          $.id(activationCodeId).innerHTML = VALID_ACTIVATION_CODE.split('').join(' ')

          $.id(enterGenerateId).style.display = 'block'
        }, 3000)

      } else {
        $.id(addAutoGeneratorErrId).innerHTML = 'INSUFFICIENT ACTIVATION TOKEN BALANCE'
        setTimeout(() => {
          $.id(addAutoGeneratorErrId).innerHTML = ''
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

    $.id(containerId).innerHTML = page5


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
          lps[lpIx].element.style.display = 'block'
        }

      }
    }, 20)
  }

  const gotoCongratulationsScreen = () => {
    $.id(containerId).innerHTML = page6

    const s = new SoundSrc('square')


    const notes1 = [
      [440, 2], [440, 1], [493.88, 3], [440, 3], [587.33, 3], [554.37, 6],
      [440, 2], [440, 1], [493.88, 3], [440, 3], [659.25, 3], [587.33, 6],
      [440, 2], [440, 1], [880, 3], [739.99, 3], [587.33, 2], [587.33, 1], [554.37, 3], [493.88, 6],
      [783.99, 2], [783.99, 1], [739.99, 3], [587.33, 3], [659.25, 3], [587.33, 6],
    ]

    const noteLen = 667 / 3

    function playNote(notes, i) {
      const n = notes[i % notes.length]
      baseNote.smoothGain(MAX_VOLUME)
      baseNote.smoothFreq(n[0])


      setTimeout(() => baseNote.smoothGain(0), n[1] * noteLen - 15)
      setTimeout(() => playNote(notes, i+1), n[1] * noteLen)
    }

    playNote(notes1, 0)


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
