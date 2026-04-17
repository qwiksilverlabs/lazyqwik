import { defineConfig } from 'vitepress';
import { metadata } from '@lazyqwik/metadata';
import { upperFirst } from 'es-toolkit';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';

const Guide = [
	{ text: 'Get Started', link: '/guide/' },
	{ text: 'Best Practice', link: '/guide/best-practice' },
	{ text: 'Contributing', link: '/contributing' },
];

const Modules = metadata.map((v) => ({
	text: upperFirst(v.module),
	link: `/hooks`,
}));

const DefaultSideBar = [
	{ text: 'Guide', items: Guide },
	{ text: 'Modules', items: Modules },
];

const Hooks = metadata.map((v) => ({
	text: upperFirst(v.module),
	items: v.hooks.map((hook) => ({
		text: hook.name,
		link: `/${v.module}/${hook.name}/`,
	})),
}));

const HookSideBar = [...Hooks];

const ModuleSideBar = Object.fromEntries(metadata.map((v) => [`/${v.module}/`, HookSideBar]));

const HookNavBar = metadata.map((v) => ({
	text: upperFirst(v.module),
	link: `/hooks#module=${v.module}`,
	activeMatch: '(?!)',
}));

export default defineConfig({
	title: 'LazyQwik',
	description: 'Collection of essential Qwik hooks',
	lang: 'en-US',
	ignoreDeadLinks: true,

	vite: {},

	markdown: {
		codeTransformers: [transformerTwoslash()],
		languages: ['tsx'],
	},

	sitemap: {
		hostname: 'https://lazyqwik.qwiksilverlabs.com',
	},

	rewrites: {
		':module/src/:slug*': ':module/:slug*',
	},

	themeConfig: {
		logo: '/favicon.svg',

		search: {
			provider: 'local',
		},

		editLink: {
			pattern: 'https://github.com/qwiksilverlabs/lazyqwik/tree/main/packages/:path',
			text: 'Suggest changes to this page',
		},

		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2026 Qwiksilver Labs and LazyQwik contributors',
		},

		nav: [
			{
				text: 'Guide',
				items: [{ text: 'Guide', items: Guide }],
			},
			{
				text: 'Hooks',
				activeMatch: '^/hooks',
				items: [{ text: 'All hooks', link: '/hooks', activeMatch: '(?!)' }, ...HookNavBar],
			},
		],

		sidebar: {
			'/guide/': DefaultSideBar,
			'/contributing': DefaultSideBar,
			'/hooks': HookSideBar,
			...ModuleSideBar,
		},

		socialLinks: [{ icon: 'github', link: 'https://github.com/qwiksilverlabs/lazyqwik' }],
	},
});
