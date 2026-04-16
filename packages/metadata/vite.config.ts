import { defineConfig } from 'vite-plus';

export default defineConfig({
	pack: {
		target: 'es2020',
		entry: ['./index.ts', './types.ts'],
		format: ['esm'],
		dts: true,
		clean: true,
		exports: true,
	},

	resolve: {
		tsconfigPaths: true,
	},
});
