import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  await seed({ payload })
  payload.logger.info('Baseline Techo seed complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
