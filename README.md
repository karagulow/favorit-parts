# Поиск автозапчастей (Favorit Parts)

Клиентское React-приложение для двухэтапного подбора номенклатуры через веб-сервис [«Проценка»](https://lk.favorit-parts.ru/static/wsprice.pdf).

## Как работает

1. По артикулу запрашивается список производителей: `GET /hs/hsprice/?key=…&number=…`
2. После выбора бренда запрашиваются аналоги и предложения: `GET /hs/hsprice/?key=…&number=…&brand=…&analogues=on`

Цена берётся из массива `warehouses` (минимальная по складам), остаток — из `count`.

## Запуск

```bash
npm install
npm run dev
```

Ключ покупателя задаётся в `.env`:

```
VITE_API_URL=https://api.favorit-parts.ru/hs/hsprice/
VITE_API_KEY=your-customer-key
```

В репозитории по умолчанию указан демо-ключ из документации API.
