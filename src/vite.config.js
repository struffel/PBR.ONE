import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				"index": 'index.html',
				"hdri-exposure": 'hdri-exposure.html',
				"hdri-shading": 'hdri-shading.html',
				"material-shading": 'material-shading.html',
				"texture-tiling": 'texture-tiling.html'
			}
		}
	},

});