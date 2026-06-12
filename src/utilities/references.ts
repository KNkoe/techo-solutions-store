import crypto from 'crypto'

const suffix = () => crypto.randomBytes(3).toString('hex').toUpperCase()

export const makeProductReference = () => `TSP-${suffix()}`
export const makeOrderReference = () => `TSO-${suffix()}`
export const makeSellerReference = () => `TSS-${suffix()}`
export const makeNotificationReference = () => `TSN-${suffix()}`

export const toProviderReference = (value: string) => value.replace(/[^a-z0-9]/gi, '').toUpperCase()
