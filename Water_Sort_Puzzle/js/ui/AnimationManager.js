export const AnimationManager = {
  markPour(container, from, to) {
    const source = container.querySelector(`[data-tube="${from}"]`);
    const target = container.querySelector(`[data-tube="${to}"]`);
    source?.classList.add('tube--source');
    target?.classList.add('tube--target');
    window.setTimeout(() => {
      source?.classList.remove('tube--source');
      target?.classList.remove('tube--target');
    }, 380);
  },
};
