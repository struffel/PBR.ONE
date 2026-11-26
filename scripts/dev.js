// Local development: rebuilds ./dist on changes and serves it with permissive CORS
// Usage: bun scripts/dev.js [port]
import { join, resolve, normalize, sep } from 'node:path';
import { build, watchSources } from './build.js';

const DIST = resolve(import.meta.dir, '..', 'dist');
const port = Number(process.argv[2] ?? 8080);

await build();
watchSources();

Bun.serve({
	port,
	async fetch(req) {

		// Use permissive CORS
		const headers = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' };

		// Determine the requested file path within the dist folder
		let path = decodeURIComponent(new URL(req.url).pathname);
		if (path.endsWith('/')) path += 'index.html';
		const target = normalize(join(DIST, path));
		const file = Bun.file(target);

		// Check if the requested file exists and is within the dist folder
		if (!target.startsWith(DIST + sep) || !(await file.exists())) {
			return new Response('Not found', { status: 404, headers });
		}

		// Serve the requested file with the appropriate headers
		return new Response(file, { headers });
	},
});
console.log(`Serving ${DIST} at http://localhost:${port}/`);
