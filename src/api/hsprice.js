const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

function isFilledGood(item) {
  return Boolean(item && (item.brand || item.goodsID || item.name || item.number))
}

export function normalizeGoods(payload) {
  if (payload?.error) {
    const message = Array.isArray(payload.error)
      ? payload.error.join('; ')
      : String(payload.error)
    throw new Error(message)
  }

  const goods = Array.isArray(payload?.goods) ? payload.goods.filter(isFilledGood) : []
  return goods
}

export async function fetchGoods({ number, brand, analogues } = {}) {
  if (!API_KEY) {
    throw new Error('Не указан ключ покупателя (VITE_API_KEY)')
  }
  if (!number) {
    throw new Error('Укажите номер детали')
  }

  const params = new URLSearchParams({
    key: API_KEY,
    number,
  })

  if (brand) {
    params.set('brand', brand)
  }
  if (analogues) {
    params.set('analogues', 'on')
  }

  let response
  try {
    response = await fetch(`${API_URL}?${params.toString()}`)
  } catch {
    throw new Error('Сбой сети. Проверьте подключение и повторите попытку.')
  }

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`)
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('Некорректный ответ API')
  }

  return normalizeGoods(payload)
}

export function uniqueBrands(goods) {
  const seen = new Set()
  const brands = []

  goods.forEach((item) => {
    if (!item.brand || seen.has(item.brand)) {
      return
    }
    seen.add(item.brand)
    brands.push({
      brand: item.brand,
      name: item.name || '',
      number: item.number || '',
      count: item.count ?? 0,
    })
  })

  return brands
}

function warehousePrice(item) {
  const prices = (item.warehouses || [])
    .map((warehouse) => warehouse.price)
    .filter((price) => typeof price === 'number' && Number.isFinite(price) && price > 0)

  if (!prices.length) {
    return null
  }

  return Math.min(...prices)
}

export function flattenOffers(goods) {
  const rows = []

  goods.forEach((item) => {
    rows.push({
      goodsID: item.goodsID,
      brand: item.brand,
      name: item.name,
      number: item.number,
      count: item.count ?? 0,
      price: warehousePrice(item),
      isAnalogue: false,
    })

    ;(item.analogues || []).forEach((analogue) => {
      if (!isFilledGood(analogue)) {
        return
      }
      rows.push({
        goodsID: analogue.goodsID,
        brand: analogue.brand,
        name: analogue.name,
        number: analogue.number,
        count: analogue.count ?? 0,
        price: warehousePrice(analogue),
        isAnalogue: true,
      })
    })
  })

  return rows
}
