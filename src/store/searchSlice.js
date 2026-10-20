import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchGoods, flattenOffers, uniqueBrands } from '../api/hsprice'

export const searchBrands = createAsyncThunk(
  'search/brands',
  async (number) => {
    const goods = await fetchGoods({ number })
    return uniqueBrands(goods)
  },
)

export const searchOffers = createAsyncThunk(
  'search/offers',
  async ({ number, brand }) => {
    const goods = await fetchGoods({ number, brand, analogues: true })
    return flattenOffers(goods)
  },
)

const initialState = {
  number: '',
  brands: [],
  brandsStatus: 'idle',
  brandsError: null,
  selectedBrand: null,
  offers: [],
  offersStatus: 'idle',
  offersError: null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.brandsStatus = 'loading'
        state.brandsError = null
        state.brands = []
        state.selectedBrand = null
        state.offers = []
        state.offersStatus = 'idle'
        state.offersError = null
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brandsStatus = 'succeeded'
        state.brands = action.payload
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.brandsStatus = 'failed'
        state.brandsError = action.error.message || 'Не удалось получить производителей'
      })
      .addCase(searchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand
        state.offersStatus = 'loading'
        state.offersError = null
        state.offers = []
      })
      .addCase(searchOffers.fulfilled, (state, action) => {
        state.offersStatus = 'succeeded'
        state.offers = action.payload
      })
      .addCase(searchOffers.rejected, (state, action) => {
        state.offersStatus = 'failed'
        state.offersError = action.error.message || 'Не удалось получить предложения'
      })
  },
})

export const { resetSearch } = searchSlice.actions
export default searchSlice.reducer
