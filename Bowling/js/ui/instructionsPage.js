export function createInstructionsPage({ section, i18n, audio, onBack } = {}) {
  function render() {
    section.innerHTML = `
      <div class="screen-shell page-shell">
        <header class="page-header">
          <div class="page-header__title">
            <img src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" />
            <h1 id="instructions-screen-title" data-i18n="instructions_title"></h1>
          </div>
          <button class="cute-button cute-button--soft" id="instructions-back" type="button">
            <img class="button-icon" src="assets/images/icons/icon-home.svg" alt="" aria-hidden="true" />
            <span data-i18n="home"></span>
          </button>
        </header>
        <main class="instructions-content">
          <section class="instruction-card" aria-labelledby="basic-operation-title">
            <h2 class="instruction-card__title" id="basic-operation-title">
              <img src="assets/images/icons/icon-aim.svg" alt="" aria-hidden="true" />
              <span data-i18n="basic_operation"></span>
            </h2>
            <div class="step-grid">
              <article class="step-card">
                <span class="step-card__number">1</span>
                <h3 data-i18n="aim"></h3>
                <p data-i18n="aim_text"></p>
              </article>
              <article class="step-card">
                <span class="step-card__number">2</span>
                <h3 data-i18n="charge"></h3>
                <p data-i18n="charge_text"></p>
              </article>
              <article class="step-card">
                <span class="step-card__number">3</span>
                <h3 data-i18n="release"></h3>
                <p data-i18n="release_text"></p>
              </article>
            </div>
          </section>
          <section class="instruction-card" aria-labelledby="scoring-title">
            <h2 class="instruction-card__title" id="scoring-title">
              <img src="assets/images/icons/icon-strike.svg" alt="" aria-hidden="true" />
              <span data-i18n="scoring_title"></span>
            </h2>
            <ul class="rule-list">
              <li><strong data-i18n="strike"></strong> — <span data-i18n="strike_text"></span></li>
              <li><strong data-i18n="spare"></strong> — <span data-i18n="spare_text"></span></li>
              <li><strong data-i18n="open_frame"></strong> — <span data-i18n="open_frame_text"></span></li>
              <li><strong data-i18n="tenth_frame"></strong> — <span data-i18n="tenth_frame_text"></span></li>
            </ul>
          </section>
          <section class="instruction-card" aria-labelledby="mode-title">
            <h2 class="instruction-card__title" id="mode-title">
              <img src="assets/images/icons/icon-start.svg" alt="" aria-hidden="true" />
              <span data-i18n="mode_title"></span>
            </h2>
            <p data-i18n="mode_text"></p>
          </section>
          <section class="instruction-card" aria-labelledby="controls-title">
            <h2 class="instruction-card__title" id="controls-title">
              <img src="assets/images/icons/icon-controls.svg" alt="" aria-hidden="true" />
              <span data-i18n="controls_title"></span>
            </h2>
            <table class="control-comparison">
              <thead><tr><th data-i18n="desktop"></th><th data-i18n="mobile"></th></tr></thead>
              <tbody><tr><td data-i18n="desktop_controls"></td><td data-i18n="mobile_controls"></td></tr></tbody>
            </table>
          </section>
          <section class="instruction-card" aria-labelledby="tips-title">
            <h2 class="instruction-card__title" id="tips-title">
              <img src="assets/images/icons/icon-mascot.svg" alt="" aria-hidden="true" />
              <span data-i18n="tips_title"></span>
            </h2>
            <ul class="tip-list"><li data-i18n="tip_text"></li></ul>
          </section>
        </main>
        <footer class="button-row">
          <button class="cute-button cute-button--large" id="instructions-back-bottom" type="button">
            <img class="button-icon" src="assets/images/icons/icon-home.svg" alt="" aria-hidden="true" />
            <span data-i18n="home"></span>
          </button>
        </footer>
      </div>`;
    i18n.applyTranslations(section);
    const goBack = () => {
      audio?.playSfx("button");
      onBack?.();
    };
    section.querySelector("#instructions-back").addEventListener("click", goBack);
    section.querySelector("#instructions-back-bottom").addEventListener("click", goBack);
  }

  return { mount: render, refresh: render };
}
