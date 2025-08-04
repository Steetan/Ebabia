import React, { ChangeEvent } from 'react'
import debounce from 'lodash.debounce'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { customAxios } from '../../utils/axios'
import { IVideo } from '../../pages/Video/Video'

export const Search: React.FC<{
	setFetchData: React.Dispatch<React.SetStateAction<IVideo[]>>
}> = ({ setFetchData }) => {
	const [value, setValue] = React.useState('')
	const dispatch = useAppDispatch()
	const inputRef = React.useRef<HTMLInputElement>(null)
	const { isDarkTheme } = useSelector((state: RootState) => state.authSlice)

	const clearInput = () => {
		setValue('')
		inputRef.current?.focus()
	}

	const updateSearchValue = React.useCallback(
		debounce((str) => {
			customAxios(`/quest?search=${str}`, 'get').then((fetData) => {
				setFetchData(fetData)
			})
		}, 1000),
		[],
	)

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		updateSearchValue(e.target.value)
	}

	return (
		<div className='search'>
			<input
				type='text'
				placeholder='Что ищем?'
				className='search__input'
				onChange={onChangeInput}
			/>
		</div>
	)
}
