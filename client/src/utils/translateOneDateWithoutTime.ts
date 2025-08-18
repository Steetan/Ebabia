export const translateOneDateWithoutTime = (data: any) => {
	const dateObj = new Date(data)

	const formattedDate = dateObj.toLocaleString('ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	return `${formattedDate}`
}
