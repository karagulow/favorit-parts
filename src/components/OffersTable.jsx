import { useSelector } from 'react-redux'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

function formatPrice(price) {
  if (price == null) {
    return '—'
  }

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(price)
}

function OffersTable() {
  const { selectedBrand, offers, offersStatus, offersError } = useSelector((state) => state.search)

  if (offersStatus === 'idle') {
    return <p className="text-secondary mb-0">Выберите производителя, чтобы увидеть аналоги и предложения.</p>
  }

  if (offersStatus === 'loading') {
    return <Loader text={`Загружаем предложения ${selectedBrand}…`} />
  }

  if (offersStatus === 'failed') {
    return <ErrorAlert message={offersError} />
  }

  if (!offers.length) {
    return <ErrorAlert message="Аналоги и предложения не найдены." />
  }

  return (
    <div className="table-responsive offers-table">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light sticky-top">
          <tr>
            <th>Название / Производитель</th>
            <th>Артикул</th>
            <th className="text-end">Стоимость</th>
            <th className="text-end">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((item, index) => (
            <tr key={`${item.goodsID || index}-${item.brand}-${item.number}`}>
              <td>
                <div className="fw-semibold">{item.name || 'Без наименования'}</div>
                <div className="text-secondary small">
                  {item.brand}
                  {item.isAnalogue ? (
                    <span className="badge text-bg-info ms-2">аналог</span>
                  ) : (
                    <span className="badge text-bg-primary ms-2">исходная</span>
                  )}
                </div>
              </td>
              <td>{item.number || '—'}</td>
              <td className="text-end text-nowrap">{formatPrice(item.price)}</td>
              <td className="text-end">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OffersTable
