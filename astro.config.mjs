import { defineConfig } from 'astro/config';
export default defineConfig({
 site:'https://thepacificedge.ca',
 output:'static',
 trailingSlash:'never',
 redirects:{'/capabilities':'/advisory'},
 // Keep dependency resolution consistent in Windows sandbox checkouts.
 vite:{resolve:{preserveSymlinks:true}},
});
