export class AudioSettings {
  constructor(audioEngine, appState) {
    this.audio = audioEngine;
    this.state = appState;
  }

  update(partial) {
    this.state.setSettings(partial);
    this.audio.applySettings(this.state.settings);
  }
}
