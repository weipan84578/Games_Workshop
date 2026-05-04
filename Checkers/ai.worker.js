// Optional placeholder for deployments that want to move hard-mode search off-thread.
// The current app keeps all scripts directly loadable from file:// without module bundling.
self.onmessage = event => {
  self.postMessage(event.data?.fallbackMove || null);
};
