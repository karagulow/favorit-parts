import { useDispatch, useSelector } from 'react-redux'
import { searchOffers } from '../store/searchSlice'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

function BrandList() {
  const dispatch = useDispatch()
  const { number, brands, brandsStatus, brandsError, selectedBrand, offersStatus } =
    useSelector((state) => state.search)

  if (brandsStatus === 'idle') {
    return <p className="text-secondary mb-0">Введите артикул, чтобы получить список производителей.</p>
  }

  if (brandsStatus === 'loading') {
    return <Loader text="Ищем производителей…" />
  }

  if (brandsStatus === 'failed') {
    return <ErrorAlert message={brandsError} />
  }

  if (!brands.length) {
    return <ErrorAlert message="По этому артикулу производители не найдены." />
  }

  const offersLoading = offersStatus === 'loading'

  return (
    <div className="list-group">
      {brands.map((item) => {
        const isActive = selectedBrand === item.brand
        return (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
              isActive ? 'active' : ''
            }`}
            disabled={offersLoading}
            onClick={() => dispatch(searchOffers({ number, brand: item.brand }))}
          >
            <div>
              <div className="fw-semibold">{item.brand}</div>
              <small className={isActive ? 'text-white-50' : 'text-secondary'}>
                {item.name || 'Без наименования'}
                {item.number ? ` · ${item.number}` : ''}
              </small>
            </div>
            <span className={`badge ${isActive ? 'text-bg-light' : 'text-bg-secondary'}`}>
              {item.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default BrandList
