import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchBrands } from '../store/searchSlice';

function SearchForm() {
	const dispatch = useDispatch();
	const { number, brandsStatus } = useSelector(state => state.search);
	const [value, setValue] = useState(number);
	const isLoading = brandsStatus === 'loading';

	const handleSubmit = event => {
		event.preventDefault();
		const article = value.trim();
		if (!article || isLoading) {
			return;
		}
		dispatch(searchBrands(article));
	};

	return (
		<form onSubmit={handleSubmit} className='row g-2 align-items-end'>
			<div className='col-md-8'>
				<label htmlFor='article' className='form-label'>
					Артикул детали
				</label>
				<input
					id='article'
					className='form-control form-control-lg'
					type='text'
					value={value}
					onChange={event => setValue(event.target.value)}
					placeholder='Например, 01089'
					autoComplete='off'
					disabled={isLoading}
				/>
			</div>
			<div className='col-md-4'>
				<button
					className='btn btn-primary btn-lg w-100'
					type='submit'
					disabled={isLoading || !value.trim()}
				>
					Найти
				</button>
			</div>
		</form>
	);
}

export default SearchForm;
