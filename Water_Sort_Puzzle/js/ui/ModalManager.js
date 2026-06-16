export const ModalManager = {
  show({ title, body, actions = [] }) {
    this.close();
    const root = document.createElement('div');
    root.className = 'modal-root';
    root.innerHTML = `
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-modal-close aria-label="關閉">×</button>
        </div>
        <div class="modal__body">${body}</div>
        <div class="modal__actions">
          ${actions.map((action, idx) => `<button class="btn ${action.primary ? 'btn--primary' : 'btn--ghost'}" data-action="${idx}">${action.label}</button>`).join('')}
        </div>
      </section>
    `;

    root.addEventListener('click', (event) => {
      if (event.target === root || event.target.closest('[data-modal-close]')) {
        this.close();
        return;
      }

      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = actions[Number(button.dataset.action)];
      if (action?.handler) action.handler();
      if (action?.close !== false) this.close();
    });

    document.body.append(root);
    root.querySelector('[data-modal-close]')?.focus();
    return root;
  },
  close() {
    document.querySelector('.modal-root')?.remove();
  },
};
