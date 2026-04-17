import DefaultTheme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';

// @ts-ignore
import '@shikijs/vitepress-twoslash/style.css';
// @ts-ignore
import './custom.css';
import { EnhanceAppContext } from 'vitepress';

export default {
	extends: DefaultTheme,
	enhanceApp({ app }: EnhanceAppContext) {
		app.use(TwoslashFloatingVue);
	},
};
