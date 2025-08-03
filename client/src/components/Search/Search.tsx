import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { customAxios } from '../../utils/axios'

const Search = ({}) => {
	const [searchValue, setSearchValue] = React.useState('')
	const navigation = useNavigate()
	const location = useLocation()

	const redirectPage = () => {
		navigation(`/quest?search=${searchValue}`)
	}
	return (
		<div className='search'>
			<input
				type='text'
				placeholder='Что ищем?'
				className='search__input'
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
			/>
			<div className='search__icon' onClick={redirectPage}>
				Найти
			</div>
		</div>
	)
}

export default Search
