// Browsers retain failed ES-module graphs for the life of a document. A fresh
// page can retry every dependency; a repeated import cannot guarantee that.
export class ViewerModuleError extends Error {
  constructor(cause) {
    super('Viewer module could not be loaded', { cause });
    this.name = 'ViewerModuleError';
    this.code = 'VIEWER_MODULE_LOAD_FAILED';
  }
}
export async function importViewerModule(url) {
  try { return await import(url); }
  catch (cause) { throw new ViewerModuleError(cause); }
}
