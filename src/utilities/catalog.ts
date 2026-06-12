import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { isVisibleInventoryStatus } from './productState'

export const getFeaturedProducts = async (limit = 8) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit,
    sort: '-updatedAt',
    where: {
      and: [
        {
          status: {
            in: ['approved', 'sold'],
          },
        },
        {
          featured: {
            equals: true,
          },
        },
      ],
    },
  })

  return result.docs
}

export const getRecentProducts = async (limit = 8) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit,
    sort: '-createdAt',
    where: {
      status: {
        in: ['approved', 'sold'],
      },
    },
  })

  return result.docs
}

export const getHotDeals = async (limit = 4) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit,
    sort: '-updatedAt',
    where: {
      and: [
        {
          status: {
            in: ['approved', 'sold'],
          },
        },
        {
          hotDeal: {
            equals: true,
          },
        },
      ],
    },
  })

  return result.docs
}

export const getCatalogFacets = async () => {
  const payload = await getPayload({ config: configPromise })

  const [categories, brands] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
    }),
    payload.find({
      collection: 'brands',
      limit: 100,
      sort: 'title',
    }),
  ])

  return {
    categories: categories.docs,
    brands: brands.docs,
  }
}

export const getProductBySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            in: ['approved', 'sold'],
          },
        },
      ],
    },
  })

  return result.docs[0] || null
}

export const searchCatalog = async (params: {
  availability?: string
  brand?: string
  category?: string
  condition?: string
  inventoryType?: string
  maxPrice?: number
  minPrice?: number
  page?: number
  q?: string
}) => {
  const payload = await getPayload({ config: configPromise })
  const and: any[] = [
    {
      status: {
        in: ['approved', 'sold'],
      },
    },
  ]

  if (params.category) {
    and.push({
      'category.slug': {
        equals: params.category,
      },
    })
  }

  if (params.brand) {
    and.push({
      'brand.slug': {
        equals: params.brand,
      },
    })
  }

  if (params.condition) {
    and.push({
      condition: {
        equals: params.condition,
      },
    })
  }

  if (params.inventoryType) {
    and.push({
      inventoryType: {
        equals: params.inventoryType,
      },
    })
  }

  if (typeof params.minPrice === 'number') {
    and.push({
      price: {
        greater_than_equal: params.minPrice,
      },
    })
  }

  if (typeof params.maxPrice === 'number') {
    and.push({
      price: {
        less_than_equal: params.maxPrice,
      },
    })
  }

  if (params.availability === 'available') {
    and.push({
      status: {
        equals: 'approved',
      },
    })
  }

  if (params.availability === 'sold') {
    and.push({
      status: {
        equals: 'sold',
      },
    })
  }

  if (params.q) {
    and.push({
      or: [
        { title: { like: params.q } },
        { shortDescription: { like: params.q } },
        { model: { like: params.q } },
        { storage: { like: params.q } },
      ],
    })
  }

  return payload.find({
    collection: 'products',
    depth: 2,
    limit: 12,
    page: params.page || 1,
    sort: '-updatedAt',
    where: {
      and,
    },
  })
}

export const isProductVisible = (status: string | null | undefined) => isVisibleInventoryStatus(status)
