import { DEFAULT_SETTINGS, DIFFICULTIES, THEMES } from "../utils/constants.js";
import { el, makeButton } from "../utils/helpers.js";
import { enterScreen } from "../ui/Transitions.js";

export class SettingsScreen {
  constructor(app) {
    this.app = app;
  }

  render() {
    const settings = this.app.state.settings;

    const musicValue = el("strong", { text: `${settings.musicVolume}%` });
    const sfxValue = el("strong", { text: `${settings.sfxVolume}%` });

    const screen = el("main", { className: "screen" }, [
      el("div", { className: "screen-shell stack" }, [
        el("header", { className: "screen-topbar" }, [
          el("div", { className: "screen-title-block" }, [
            el("span", { className: "screen-kicker", text: "Settings" }),
            el("h2", { text: "設定" })
          ]),
          makeButton("返回", { on: { click: () => this.app.navigate("main-menu") } })
        ]),
        el("section", { className: "settings-list surface" }, [
          el("div", { className: "setting-row" }, [
            el("strong", { text: "背景音樂" }),
            el("div", { className: "setting-control" }, [
              el("input", {
                type: "range",
                value: settings.musicVolume,
                attrs: { min: "0", max: "100" },
                on: {
                  input: (event) => {
                    const value = Number(event.currentTarget.value);
                    musicValue.textContent = `${value}%`;
                    this.app.updateSettings({ musicVolume: value });
                  }
                }
              }),
              musicValue
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "音效" }),
            el("div", { className: "setting-control" }, [
              el("input", {
                type: "range",
                value: settings.sfxVolume,
                attrs: { min: "0", max: "100" },
                on: {
                  input: (event) => {
                    const value = Number(event.currentTarget.value);
                    sfxValue.textContent = `${value}%`;
                    this.app.updateSettings({ sfxVolume: value });
                  }
                }
              }),
              sfxValue
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "靜音" }),
            el("div", { className: "setting-control" }, [
              makeButton(settings.muted ? "已靜音" : "開啟聲音", {
                on: {
                  click: () => {
                    this.app.updateSettings({ muted: !this.app.state.settings.muted });
                    this.app.navigate("settings");
                  }
                }
              })
            ])
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "預設難度" }),
            el("div", { className: "difficulty-grid" }, DIFFICULTIES.map((difficulty) => el("button", {
              className: `difficulty-card ${settings.defaultDifficulty === difficulty.id ? "is-selected" : ""}`,
              type: "button",
              on: {
                click: () => {
                  this.app.updateSettings({ defaultDifficulty: difficulty.id });
                  this.app.navigate("settings");
                }
              }
            }, [
              el("strong", { text: difficulty.zh }),
              el("span", { text: `${difficulty.cols}×${difficulty.cols} · ${difficulty.pieces} 片` })
            ])))
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "主題" }),
            el("div", { className: "theme-grid" }, THEMES.map((theme) => el("button", {
              className: `theme-option ${settings.theme === theme.id ? "is-selected" : ""}`,
              type: "button",
              on: { click: () => this.app.setTheme(theme.id) }
            }, [
              el("span", { text: theme.label }),
              el("span", { className: "swatches" }, theme.colors.map((color) => el("span", {
                className: "swatch",
                attrs: { style: `background:${color}` }
              })))
            ])))
          ]),
          el("div", { className: "setting-row" }, [
            el("strong", { text: "語言" }),
            el("div", { className: "segmented" }, [
              makeButton("繁中", {
                on: { click: () => this.app.updateSettings({ language: "zh-TW" }) }
              }),
              makeButton("English", {
                on: { click: () => this.app.updateSettings({ language: "en" }) }
              })
            ])
          ]),
          el("div", { className: "toolbar" }, [
            makeButton("還原預設", {
              on: {
                click: () => {
                  this.app.updateSettings({ ...DEFAULT_SETTINGS });
                  this.app.setTheme(DEFAULT_SETTINGS.theme);
                  this.app.navigate("settings");
                }
              }
            })
          ])
        ])
      ])
    ]);

    enterScreen(screen);
    return screen;
  }
}
