import type {NextConfig} from 'next'

const config: NextConfig = {
	images: {
		remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
	},
	compiler: {
		styledComponents: true,
	},
}

export default config
