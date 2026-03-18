import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const uniPlugin = uni?.default ?? uni

export default defineConfig({
	plugins: [uniPlugin()],
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true,
				silenceDeprecations: ['color-functions', 'global-builtin', 'legacy-js-api', 'import'],
			},
			sass: {
				quietDeps: true,
				silenceDeprecations: ['color-functions', 'global-builtin', 'legacy-js-api', 'import'],
			},
		},
	},
})
