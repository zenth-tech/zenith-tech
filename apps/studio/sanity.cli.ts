import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_PROJECT_ID || 'uw4odwl8'
const dataset = process.env.SANITY_DATASET || 'production'
const appId = process.env.SANITY_APP_ID!
export default defineCliConfig({
  api: {
    projectId,
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId,
    autoUpdates: true,
  },
})
