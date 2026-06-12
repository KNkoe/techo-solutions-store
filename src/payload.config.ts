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

const bucket = process.env.STORAGE_S3_BUCKET || process.env.RUSTFS_BUCKET
const accessKey = process.env.STORAGE_S3_ACCESS_KEY || process.env.RUSTFS_ACCESS_KEY
const secretKey = process.env.STORAGE_S3_SECRET_KEY || process.env.RUSTFS_SECRET_KEY
const endpoint = (process.env.STORAGE_S3_ENDPOINT || process.env.RUSTFS_ENDPOINT || '').replace(
  /\/$/,
  '',
)
const region = process.env.STORAGE_S3_REGION || process.env.RUSTFS_REGION || 'us-east-1'
const objectAcl =
  process.env.STORAGE_S3_OBJECT_ACL === 'private' || process.env.RUSTFS_OBJECT_ACL === 'private'
    ? ('private' as const)
    : ('public-read' as const)

const hasS3Config = Boolean(bucket && accessKey && secretKey && endpoint)

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
    ...(hasS3Config
      ? [
          s3Storage({
            acl: objectAcl,
            collections: {
              media: true,
            },
            bucket: bucket!,
            config: {
              credentials: {
                accessKeyId: accessKey!,
                secretAccessKey: secretKey!,
              },
              endpoint,
              region,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
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
