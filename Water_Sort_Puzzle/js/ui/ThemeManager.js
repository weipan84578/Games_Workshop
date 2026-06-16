export const THEMES = ['ocean', 'forest', 'sunset', 'midnight'];

export const ThemeManager = {
  apply(theme = 'ocean') {
    const safeTheme = THEMES.includes(theme) ? theme : 'ocean';
    document.documentElement.dataset.theme = safeTheme;
    const app = document.querySelector('#app');
    if (app) app.dataset.theme = safeTheme;
  },
};
