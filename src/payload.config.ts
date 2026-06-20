import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { NotificationLogs } from './collections/NotificationLogs'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Products } from './collections/Products'
import { SellerSubmissions } from './collections/SellerSubmissions'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const hasRustfsConfig = Boolean(
  process.env.RUSTFS_BUCKET &&
    process.env.RUSTFS_ACCESS_KEY &&
    process.env.RUSTFS_SECRET_KEY &&
    process.env.RUSTFS_ENDPOINT,
)
const rustfsEndpoint = process.env.RUSTFS_ENDPOINT?.replace(/\/$/, '')
const rustfsObjectAcl =
  process.env.RUSTFS_OBJECT_ACL === 'private' ? ('private' as const) : ('public-read' as const)

const storagePlugin = hasRustfsConfig
  ? s3Storage({
      acl: rustfsObjectAcl,
      collections: {
        media: true,
      },
      bucket: process.env.RUSTFS_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.RUSTFS_ACCESS_KEY!,
          secretAccessKey: process.env.RUSTFS_SECRET_KEY!,
        },
        endpoint: rustfsEndpoint,
        region: process.env.RUSTFS_REGION || 'us-east-1',
        forcePathStyle: true,
      },
    })
  : null

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1512, height: 982 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Pages,
    Products,
    Categories,
    Brands,
    Orders,
    SellerSubmissions,
    NotificationLogs,
    Media,
    Users,
  ],
  globals: [HomePage, SiteSettings],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...(storagePlugin ? [storagePlugin] : []),
    ...plugins,
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
