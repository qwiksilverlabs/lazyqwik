import { defineConfig } from 'taze';

export default defineConfig({
	recursive: true,
	packageMode: {
		'@builder.io/qwik': 'minor',
	},
});
