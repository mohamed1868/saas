type PricedItem = {
  price: number
  quantity: number
}

function round2(value: number) {
  return Number(value.toFixed(2))
}

export function invoiceTotals(items: PricedItem[], discount: number, taxRate: number) {
  const subtotal = round2(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const taxable = Math.max(subtotal - discount, 0)
  const tax = round2((taxable * taxRate) / 100)

  return { subtotal, tax, total: round2(taxable + tax) }
}
