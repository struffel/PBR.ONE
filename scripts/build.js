// Builds the deployable PBR.ONE folder (./dist) from ./src.
// Usage: bun scripts/build.js [--watch]
import { cp, readdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, resolve } from 'node:path';

// Get the project root
const ROOT = resolve(import.meta.dir, '..');

// Get the actual source folder and other paths within the project
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const VIEWS = join(SRC, 'js', 'views');

// Build the project into the dist folder. Existing files are overwritten but not removed (see the "build" script in package.json).
export async function build() {

	// Static files: everything in src except the JS sources, which get bundled below.
	await cp(SRC, DIST, {
		recursive: true,
		filter: (source) => resolve(source) !== join(SRC, 'js'),
	});

	// Bundle JS views with Bun's build system
	const entrypoints = (await readdir(VIEWS)).filter(f => f.endsWith('.js')).map(f => join(VIEWS, f));
	const result = await Bun.build({
		entrypoints,
		outdir: join(DIST, 'js', 'views'),
		root: VIEWS,
		target: 'browser',
		format: 'esm',
		splitting: true,
		minify: true,
		sourcemap: 'none',
	});
	if (!result.success) {
		for (const log of result.logs) console.error(log);
		throw new Error('Bundling failed.');
	}

	console.log(`Built ${result.outputs.length} JS files into ${DIST}`);
}

// Rebuilds on changes. If REBUILD_INTERVAL (seconds) is set, rebuilds periodically instead,
// for setups where file events are not delivered (e.g. Docker Desktop with WSL2).
export function watchSources() {
	const seconds = Number(process.env.REBUILD_INTERVAL);
	const safeBuild = () => build().catch(e => console.error(e.message));

	if (seconds > 0) {
		const loop = async () => {
			await safeBuild();
			setTimeout(loop, seconds * 1000);
		};
		setTimeout(loop, seconds * 1000);
		console.log(`Rebuilding every ${seconds}s...`);
	} else {
		let timer;
		watch(SRC, { recursive: true }, () => {
			clearTimeout(timer);
			timer = setTimeout(safeBuild, 100);
		});
		console.log(`Watching ${SRC} for changes...`);
	}
}

if (import.meta.main) {
	await build();
	if (process.argv.includes('--watch')) watchSources();
}
