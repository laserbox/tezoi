import { parsePly } from './ply.js';
import { isSog, parseSog } from './sog.js';
self.onmessage = async ({ data: { id, buffer, options } }) => {
  try {
    const model = isSog(buffer) ? await parseSog(buffer, options) : parsePly(buffer, options);
    self.postMessage({ id, model }, [model.data.buffer, model.sh.buffer]);
  } catch (error) { self.postMessage({ id, error: error.message }); }
};
