import { $, noop } from './utils.js'

export function mountTombstone(mountEl, onClose=noop) {
  const xSVG = `
    <svg id="xSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" viewBox="0 0 460.775 460.775" xml:space="preserve">
    <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
    </svg>
  `

  const tombstoneMarkup = `
    <style>
      #xSVG {
        width: 16px;
      }
      @media (max-width: 630px) {
        #xSVG {
          width: 12px;
        }
        #tombstoneOverlay {
          font-size: 1em !important;
        }

        #tombstoneContent {
          padding: 32px !important;
          padding-top: 0 !important;
        }
      }
    </style>
    <div
      id="tombstoneOverlay"
      style="
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 1.1em
      "
    >
      <div
        id="tombstoneOpacity"
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
        style="
          z-index: 3;
          background: #fff;
        "
      >
        <div style="display: flex; justify-content: end; width: 100%">
          <div id="xCloseTombstone" style="cursor: pointer; padding: 10px; height: 34px; user-select: none">${xSVG}</div>
        </div>

        <div id="tombstoneContent" style="padding: 34px 80px; padding-top: 0">
          <h4 style="text-align: center; margin-bottom: 16px">This Site Interruption was brought to you by:</h4>
          <h4 style="text-align: center; margin-bottom: 0">Steve Pikelny</h4>
          <p style="text-align: center">b. 1989, United States</p>
          <p style="text-align: center"><em>MoMI Site Interruption Activation</em>, 2026</p>
          <p style="text-align: center">JavaScript, HTML/CSS, Webpage</p>

          <p style="text-align: center; margin-top: 1em">Learn more about the series at MoMI <a href="https://movingimage.org/event/site-interruptions/" target="_blank" style="text-decoration: underline; color: #000;">here</a>.</p>
        </div>
      </div>

    </div>
  `

  const tombstone = $.div(tombstoneMarkup, {
    style: `
      z-index: 5000;
      position: fixed;
      top: 0;
      left: 0;
    `
  })
  mountEl.appendChild(tombstone)

  const close = () => {
    document.getElementById('tombstoneOverlay').remove()
    onClose()
  }

  document.getElementById('tombstoneOpacity').onclick = close
  document.getElementById('xCloseTombstone').onclick = close
}
