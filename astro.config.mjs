// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	base: '/TRLICU996/',
	site: 'https://dawnswwwww.github.io',
	integrations: [mdx(), sitemap()],
	trailingSlash: 'never',
});
