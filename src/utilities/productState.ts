export const isPurchasableStatus = (status: string | null | undefined) => status === 'approved'

export const isVisibleInventoryStatus = (status: string | null | undefined) =>
  status === 'approved' || status === 'sold'
