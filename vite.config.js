import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	base: './',
	server: {
		port: 8081,
		host: '0.0.0.0',
		open: true
	},
	build: {
		assetsDir: 'assets',
		sourcemap: false,
		target: 'esnext',
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks(id) {
					return 'index';
				},
				
				entryFileNames: 'index.js',
				chunkFileNames: 'index.js', // Это гарантирует, что даже если Rollup создаст "чанк", он будет называться index.js
				assetFileNames: 'assets/[name].[hash][extname]',
			}
		},
		assetsInlineLimit: 0,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 2,
				dead_code: true,
			},
			mangle: {
				toplevel: true,
				eval: true,
			},
			format: {
				comments: false,
			},
		},
		chunkSizeWarningLimit: 2000,
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify('production')
	},
	alias: {
		crypto: false,
		stream: false,
		buffer: false,
	},
	esbuild: {
		target: 'esnext'
	},
	plugins: [
		viteImagemin({
			webp: {
				quality: 75,
			},
			pngquant: false,
			mozjpeg: false,
			gifsicle: false,
			svgo: true,
		}),
		visualizer({
			open: true,
			gzipSize: true,
			brotliSize: true,
			template: 'treemap',
			filename: 'stats.html'
		})
	],
});
