import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getCachedSiteSettings = async () => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
  })
}

export const getCachedHomePage = async () => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({
    slug: 'home-page',
    depth: 2,
  })
}
