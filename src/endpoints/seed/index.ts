import type { Payload, PayloadRequest } from 'payload'

import { storeAddress } from '@/config/storeLocation'
import { simpleLexical } from '@/utilities/lexical'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const categorySeeds = [
  { title: 'Phones', inventoryType: 'pre-owned' as const, slug: 'phones' },
  { title: 'Laptops', inventoryType: 'pre-owned' as const, slug: 'laptops' },
  { title: 'Tablets', inventoryType: 'pre-owned' as const, slug: 'tablets' },
  { title: 'Accessories', inventoryType: 'brand-new' as const, slug: 'accessories' },
  { title: 'Gaming', inventoryType: 'pre-owned' as const, slug: 'gaming' },
  { title: 'Televisions', inventoryType: 'brand-new' as const, slug: 'televisions' },
  { title: 'Fridges', inventoryType: 'pre-owned' as const, slug: 'fridges' },
  { title: 'Freezers', inventoryType: 'pre-owned' as const, slug: 'freezers' },
  { title: 'Cookers', inventoryType: 'pre-owned' as const, slug: 'cookers' },
  { title: 'Microwaves', inventoryType: 'brand-new' as const, slug: 'microwaves' },
  { title: 'Kitchen appliances', inventoryType: 'brand-new' as const, slug: 'kitchen-appliances' },
  { title: 'Wardrobes', inventoryType: 'pre-owned' as const, slug: 'wardrobes' },
  { title: 'Beds and mattresses', inventoryType: 'pre-owned' as const, slug: 'beds-and-mattresses' },
  { title: 'Sofas and lounges', inventoryType: 'pre-owned' as const, slug: 'sofas-and-lounges' },
  { title: 'Dining sets', inventoryType: 'pre-owned' as const, slug: 'dining-sets' },
  { title: 'Office furniture', inventoryType: 'pre-owned' as const, slug: 'office-furniture' },
  { title: 'Laundry appliances', inventoryType: 'pre-owned' as const, slug: 'laundry-appliances' },
  { title: 'Home essentials', inventoryType: 'brand-new' as const, slug: 'home-essentials' },
  { title: 'Baby items', inventoryType: 'pre-owned' as const, slug: 'baby-items' },
  { title: 'Fashion and shoes', inventoryType: 'pre-owned' as const, slug: 'fashion-and-shoes' },
]

const brandSeeds = ['Apple', 'Samsung', 'HP', 'Dell', 'Lenovo', 'Sony', 'Hisense']

const productSeeds = [
  {
    brand: 'Apple',
    category: 'phones',
    condition: 'excellent' as const,
    currency: 'LSL',
    hotDeal: true,
    imageAlt: 'Techo Solutions promotional image for a pre-owned iPhone',
    imageUrl:
      'https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/696337032_993257583086151_4735091314309744268_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=p600x600&_nc_cat=107&ccb=1-7&_nc_sid=b96d88&_nc_ohc=zKddlKjRtzsQ7kNvwH1Tryj&_nc_oc=AdpQB703XkTkUd2_8zMNr6p2Opvnel-xB2G0UdRfqxjk9Pf2JthM3du6L7qCyQ05xk0&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=mt90Lnu77BL0jJV3GZXmyQ&_nc_ss=7b20f&oh=00_Af-npgNAYHjbxCFcwYxnKM1fpAIdmaTqsskCV3XOArpddw&oe=6A30B277',
    inventoryType: 'pre-owned' as const,
    knownIssues: 'No known issues were listed publicly. Inspect at pickup before collection.',
    model: 'iPhone 13 128GB',
    network: 'Unlocked',
    price: 7500,
    shortDescription:
      'Certified pre-owned iPhone 13 promoted by Techo Solutions on Facebook.',
    slug: 'certified-pre-owned-iphone-13-128gb',
    status: 'approved' as const,
    title: 'Certified Pre-Owned iPhone 13 128GB',
    whatIsIncluded: 'Phone only unless otherwise confirmed by staff on WhatsApp.',
  },
  {
    brand: 'HP',
    category: 'laptops',
    condition: 'good' as const,
    currency: 'LSL',
    featured: true,
    imageAlt: 'Techo Solutions laptop promotion thumbnail',
    imageUrl:
      'https://scontent-jnb2-1.xx.fbcdn.net/v/t15.5256-10/630890173_916243830939158_2025019232125806336_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a27664&_nc_ohc=2ysfXjyLZjYQ7kNvwHNYdWA&_nc_oc=AdrWx9zE-5GIoj8pK4RZCemzCtgN_b9AUS48Z5ukGJh0J1eT4Wp39F9OKZa9uGq6PGQ&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=TNaVBYXu6v2bhe63g5Zynw&_nc_ss=7b20f&oh=00_Af_-Z8wbUM3iXA2JjCp5wIw1i8w7bp6vLmMTaDU_WUNhfQ&oe=6A308C53',
    inventoryType: 'pre-owned' as const,
    knownIssues: 'Public post did not list defects. Verify battery and ports at pickup.',
    model: 'Core i7 8th Gen Laptop',
    network: 'Wi-Fi',
    price: 6800,
    ram: '16GB',
    shortDescription:
      'Core i7 8th Gen laptop with 16GB RAM and fingerprint scan, based on Techo Solutions public Facebook post.',
    slug: 'core-i7-8th-gen-laptop-16gb',
    status: 'approved' as const,
    storage: '512GB SSD',
    title: 'Core i7 8th Gen Laptop 16GB RAM',
    whatIsIncluded: 'Laptop and charger, subject to in-store confirmation.',
  },
  {
    brand: 'Hisense',
    category: 'accessories',
    condition: 'new' as const,
    currency: 'LSL',
    hotDeal: true,
    imageAlt: 'Techo Solutions 58 inch Hisense TV promotional image',
    imageUrl:
      'https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/717805121_1015595190852390_144292298373023939_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=p228x119&_nc_cat=106&ccb=1-7&_nc_sid=77f5bd&_nc_ohc=yKYNy_HkWxMQ7kNvwHaCaGJ&_nc_oc=AdoJbu3iZG0BB9UZ5mc0obEvIqjrpCOpyDgJU38KzQTUpDgYF2sHDIghiYl7CF4cZEs&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=V9jgP1OQPO-rkSTvjXtkgw&_nc_ss=7b20f&oh=00_Af8_D-fhXPSDaa0_0cHvvNyqgJx5-glPMBE6rTMf15lGlA&oe=6A30B10E',
    inventoryType: 'brand-new' as const,
    knownIssues: 'No issues stated publicly.',
    model: '58 Inch Hisense TV',
    network: 'Smart TV',
    price: 5800,
    shortDescription: '58 inch Hisense TV publicly promoted by Techo Solutions.',
    slug: 'hisense-58-inch-tv',
    status: 'approved' as const,
    title: 'Hisense 58 Inch TV',
    whatIsIncluded: 'TV and standard accessories as confirmed at pickup.',
  },
  {
    brand: 'Hisense',
    category: 'accessories',
    condition: 'new' as const,
    currency: 'LSL',
    featured: true,
    imageAlt: 'Techo Solutions Hisense TV promotion reused from public post',
    imageUrl:
      'https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/717805121_1015595190852390_144292298373023939_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=p228x119&_nc_cat=106&ccb=1-7&_nc_sid=77f5bd&_nc_ohc=yKYNy_HkWxMQ7kNvwHaCaGJ&_nc_oc=AdoJbu3iZG0BB9UZ5mc0obEvIqjrpCOpyDgJU38KzQTUpDgYF2sHDIghiYl7CF4cZEs&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=V9jgP1OQPO-rkSTvjXtkgw&_nc_ss=7b20f&oh=00_Af8_D-fhXPSDaa0_0cHvvNyqgJx5-glPMBE6rTMf15lGlA&oe=6A30B10E',
    inventoryType: 'brand-new' as const,
    knownIssues: 'No issues stated publicly.',
    model: '40 Inch Hisense Smart TV',
    network: 'Smart TV',
    price: 3200,
    shortDescription:
      '40 inch Hisense Smart TV priced from a recent Techo Solutions Facebook promotion.',
    slug: 'hisense-40-inch-smart-tv',
    status: 'approved' as const,
    title: 'Hisense 40 Inch Smart TV',
    whatIsIncluded: 'TV and standard accessories as confirmed at pickup.',
  },
]

const galleryVariants = [
  { key: 'gallery-1', width: 1200, height: 1200, position: 'centre' as const },
  { key: 'gallery-2', width: 1200, height: 900, position: 'entropy' as const },
]

const pageSeeds = [
  {
    slug: 'about',
    title: 'About Techo Solutions',
    eyebrow: 'Our Story',
    summary: 'A Maseru-based second-hand goods business focused on practical buying and selling.',
    content: simpleLexical('Techo Solutions', [
      'Techo Solutions buys and sells second-hand goods with a strong focus on trust, condition clarity, and direct human support.',
      'The business is built around real photos, clear availability, local pickup, and WhatsApp communication that keeps both buyers and sellers informed.',
      `Visit us at ${storeAddress}`,
    ]),
  },
  {
    slug: 'how-it-works',
    title: 'How It Works',
    eyebrow: 'Simple Process',
    summary: 'Techo Solutions keeps both buying and selling straightforward.',
    content: simpleLexical('How buying and selling works', [
      'Buyers browse the live catalog, choose an item, pay, and collect it after WhatsApp confirmation.',
      'Sellers start by confirming their number, submit item details and photos, then wait for review and possible inspection.',
    ]),
  },
  {
    slug: 'contact',
    title: 'Contact',
    eyebrow: 'Support',
    summary: 'Reach Techo Solutions through WhatsApp for questions about a product, order, or seller submission.',
    content: simpleLexical('Contact Techo Solutions', [
      'WhatsApp support is the fastest path for product questions, pickup coordination, and selling inquiries.',
    ]),
  },
  {
    slug: 'terms',
    title: 'Terms and Conditions',
    eyebrow: 'Legal',
    summary: 'Pickup-focused terms for items sold through Techo Solutions.',
    content: simpleLexical('Terms', [
      'All items should be inspected at pickup. Listings aim to show the real condition of each item clearly.',
    ]),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    summary: 'How Techo Solutions handles customer and seller data.',
    content: simpleLexical('Privacy', [
      'Techo Solutions uses customer and seller information only for order handling, seller review, and WhatsApp communication.',
    ]),
  },
  {
    slug: 'returns',
    title: 'Returns and Inspection',
    eyebrow: 'Legal',
    summary: 'A conservative policy focused on condition transparency and inspection at pickup.',
    content: simpleLexical('Returns and inspection', [
      'Buyers are expected to inspect items at pickup. Techo Solutions aims to document condition and known issues clearly before purchase.',
    ]),
  },
]

export const seed = async ({ payload }: { payload: Payload; req?: PayloadRequest }) => {
  for (const category of categorySeeds) {
    const existing = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { slug: { equals: category.slug } },
    })

    if (!existing.docs.length) {
      await payload.create({ collection: 'categories', draft: false, data: category })
    }
  }

  for (const brand of brandSeeds) {
    const existing = await payload.find({
      collection: 'brands',
      limit: 1,
      where: { title: { equals: brand } },
    })

    if (!existing.docs.length) {
      await payload.create({
        collection: 'brands',
        draft: false,
        data: {
          featured: false,
          slug: brand.toLowerCase().replace(/\s+/g, '-'),
          title: brand,
        },
      })
    }
  }

  const categoryMap = new Map(
    (
      await payload.find({
        collection: 'categories',
        limit: 100,
        pagination: false,
      })
    ).docs.map((doc) => [doc.slug, doc]),
  )

  const brandMap = new Map(
    (
      await payload.find({
        collection: 'brands',
        limit: 100,
        pagination: false,
      })
    ).docs.map((doc) => [doc.title, doc]),
  )

  const mediaCache = new Map<string, any>()
  const sourceBufferCache = new Map<string, Buffer>()
  const homepageBannerAlt = 'Techo Solutions homepage banner'
  const existingHomepageBanner = await payload.find({
    collection: 'media',
    limit: 1,
    where: {
      alt: {
        equals: homepageBannerAlt,
      },
    },
  })

  let homepageBanner = existingHomepageBanner.docs[0]

  if (!homepageBanner) {
    const bannerPath = fileURLToPath(new URL('../../../public/hero.webp', import.meta.url))
    const bannerBuffer = await readFile(bannerPath)

    homepageBanner = await payload.create({
      collection: 'media',
      draft: false,
      data: {
        alt: homepageBannerAlt,
      },
      file: {
        data: bannerBuffer,
        mimetype: 'image/webp',
        name: 'hero.webp',
        size: bannerBuffer.byteLength,
      },
    })
  }

  for (const product of productSeeds) {
    const existing = await payload.find({
      collection: 'products',
      limit: 1,
      where: {
        slug: {
          equals: product.slug,
        },
      },
    })

    const category = categoryMap.get(product.category)
    const brand = brandMap.get(product.brand)

    if (!category || !brand) {
      throw new Error(`Missing category or brand while seeding ${product.title}`)
    }

    let mediaDoc = mediaCache.get(product.imageUrl)
    let sourceBuffer: Buffer | null = sourceBufferCache.get(product.imageUrl) || null
    let mimeType = 'image/jpeg'
    let extension = 'jpg'

    if (!sourceBuffer) {
      try {
        const response = await fetch(product.imageUrl)
        if (response.ok) {
          sourceBuffer = Buffer.from(await response.arrayBuffer())
          mimeType = response.headers.get('content-type') || 'image/jpeg'
          extension = mimeType.includes('png') ? 'png' : 'jpg'
        } else {
          payload.logger.warn(`Seed image unavailable for ${product.title}; using local fallback.`)
        }
      } catch {
        payload.logger.warn(`Seed image fetch failed for ${product.title}; using local fallback.`)
      }

      if (!sourceBuffer) {
        const fallbackPath = fileURLToPath(new URL('../../../public/hero.webp', import.meta.url))
        sourceBuffer = await readFile(fallbackPath)
        mimeType = 'image/webp'
        extension = 'webp'
      }

      sourceBufferCache.set(product.imageUrl, sourceBuffer)
    }

    if (!mediaDoc) {
      mediaDoc = await payload.create({
        collection: 'media',
        draft: false,
        data: {
          alt: product.imageAlt,
        },
        file: {
          data: sourceBuffer,
          mimetype: mimeType,
          name: `${product.slug}.${extension}`,
          size: sourceBuffer.byteLength,
        },
      })

      mediaCache.set(product.imageUrl, mediaDoc)
    }

    const galleryMedia = await Promise.all(
      galleryVariants.map(async (variant) => {
        const alt = `${product.title} ${variant.key}`
        const existingMedia = await payload.find({
          collection: 'media',
          limit: 1,
          where: {
            alt: {
              equals: alt,
            },
          },
        })

        if (existingMedia.docs[0]) return existingMedia.docs[0]

        const derivedBuffer = await sharp(sourceBuffer)
          .resize({
            width: variant.width,
            height: variant.height,
            fit: 'cover',
            position: variant.position,
          })
          .jpeg({ quality: 88 })
          .toBuffer()

        return payload.create({
          collection: 'media',
          draft: false,
          data: {
            alt,
          },
          file: {
            data: derivedBuffer,
            mimetype: 'image/jpeg',
            name: `${product.slug}-${variant.key}.jpg`,
            size: derivedBuffer.byteLength,
          },
        })
      }),
    )

    const productData = {
      brand: brand.id,
      category: category.id,
      condition: product.condition,
      currency: product.currency,
      featured: product.featured || false,
      hotDeal: product.hotDeal || false,
      images: [{ image: mediaDoc.id }, ...galleryMedia.map((image) => ({ image: image.id }))],
      inventoryType: product.inventoryType,
      knownIssues: product.knownIssues,
      model: product.model,
      network: product.network,
      pickupOnly: true,
      price: product.price,
      ram: product.ram,
      recentlyAdded: true,
      shortDescription: product.shortDescription,
      slug: product.slug,
      status: product.status,
      storage: product.storage,
      title: product.title,
      trustNotes: [
        { note: 'Publicly promoted by Techo Solutions on Facebook.' },
        { note: 'Pickup in Maseru only.' },
        { note: 'WhatsApp support available for clarification before purchase.' },
      ],
      whatIsIncluded: product.whatIsIncluded,
    }

    if (existing.docs.length) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data: productData,
        draft: false,
      })
    } else {
      await payload.create({
        collection: 'products',
        draft: false,
        data: productData,
      })
    }
  }

  for (const page of pageSeeds) {
    const existing = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: page.slug } },
    })

    if (!existing.docs.length) {
      await payload.create({
        collection: 'pages',
        data: {
          ...page,
          _status: 'published',
        },
      })
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      adminNotificationNumbers: [{ phone: '26650000001' }],
      pickup: {
        address: storeAddress,
        businessHours: 'Mon-Sat, 08:00 - 17:00',
        instructions: 'Wait for the ready-for-pickup WhatsApp before coming to collect your item.',
        locationName: 'Techo Solutions Store',
      },
      policies: {
        inspectionSummary: 'Inspect your item at pickup before leaving the store.',
        returnsSummary: 'Returns are handled conservatively and depend on the documented item condition.',
      },
      seo: {
        defaultDescription:
          'Techo Solutions sells second-hand goods in Maseru with real photos, clear availability, and WhatsApp support.',
        defaultTitle: 'Techo Solutions | Buy and sell second-hand goods in Maseru',
      },
      siteName: 'Techo Solutions',
      supportWhatsAppNumber: '26650000001',
      tagline: 'Buy and sell good second-hand items in Maseru.',
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      announcement: {
        label: 'Maseru pickup',
        message: 'Real photos, clear availability, and WhatsApp support for every order.',
      },
      faq: [
        {
          answer: 'No. Techo Solutions uses direct single-item checkout so inventory remains accurate.',
          question: 'Do I need a cart to buy?',
        },
        {
          answer: 'No. Seller submissions are reviewed first and may require physical inspection before a purchase decision.',
          question: 'Does submission guarantee Techo will buy my item?',
        },
      ],
      hero: {
        description:
          'Shop second-hand goods with real photos, clear availability, and fast WhatsApp follow-up in Maseru.',
        eyebrow: 'Trusted local tech commerce',
        image: homepageBanner.id,
        primaryCTA: 'Shop items',
        secondaryCTA: 'Sell an item',
        supportLabel: 'Clean. Practical. Transaction-focused.',
        title: 'Buy trusted items. Sell what you are ready to let go.',
      },
      howItWorks: {
        buyers: [
          { title: 'Browse the live catalog', description: 'See real photos, condition details, and straightforward pricing.' },
          { title: 'Pay directly', description: 'Use MoPay for a simple one-item payment flow.' },
          { title: 'Pick up in Maseru', description: 'Techo confirms the handover through WhatsApp once your order is ready.' },
        ],
        sellers: [
          { title: 'Confirm your WhatsApp number', description: 'A quick code check happens before the seller form opens.' },
          { title: 'Send the item details', description: 'Share model, condition, price, location, and real photos.' },
          { title: 'Wait for review', description: 'Techo responds with the next step, including inspection if needed.' },
        ],
      },
      sellerCTA: {
        buttonLabel: 'Start selling',
        description:
          'Tell Techo about the item you want to sell, add photos, and wait for review or a buying decision.',
        title: 'Ready to sell something that still works?',
      },
      trustPillars: [
        { title: 'Trusted listings', description: 'Listings are curated around trust, condition clarity, and real operational follow-up.' },
        { title: 'Real photos', description: 'Each product page is designed to represent the actual item, not a placeholder mockup.' },
        { title: 'Pickup in Maseru', description: 'The buyer journey stays simple: one item, one payment, one pickup path.' },
        { title: 'Fast WhatsApp support', description: 'Buyers and sellers both get status updates through WhatsApp.' },
      ],
    },
  })
}
