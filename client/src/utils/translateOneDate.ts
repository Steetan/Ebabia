export const translateOneDate = (data: any) => {
	const dateObj = new Date(data)

	const formattedDate = dateObj.toLocaleString('ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	const formattedTime = dateObj.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})

	return `${formattedDate} ${formattedTime}`
}
