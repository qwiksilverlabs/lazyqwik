import { defineConfig } from 'vite-plus';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig({
	pack: {
		target: 'es2020',
		entry: ['./src/index.ts'],
		format: ['esm'],
		dts: true,
		clean: true,
		exports: true,
	},

	resolve: {
		tsconfigPaths: true,
	},

	plugins: [qwikVite()],
});
