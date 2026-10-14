// Serves dist-explore/ with Pages-like routing on localhost (default 4322). Review only; nothing is published.
import path from 'node:path';
import { serve } from './lib/serve.mjs';

const port = Number(process.env.PORT ?? 4322);
const { port: p } = await serve(path.resolve('dist-explore'), port);
console.log(`Exploration preview: http://localhost:${p}/explore/  (Ctrl+C to stop)`);
