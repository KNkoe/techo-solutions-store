import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

export const getCachedSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({
      slug: 'site-settings',
      depth: 2,
    })
  },
  ['site-settings'],
  { tags: ['global_site-settings'] },
)

export const getCachedHomePage = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({
      slug: 'home-page',
      depth: 2,
    })
  },
  ['home-page'],
  { tags: ['global_home-page'] },
)
