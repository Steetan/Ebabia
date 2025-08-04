import React from 'react'

const Comment: React.FC<{ description: string; name: string; fname: string; icon_url: string }> = ({
	description,
	name,
	fname,
	icon_url,
}) => {
	return (
		<div className='fullvideo__comment'>
			<div className='fullvideo__comment-top'>
				<img
					src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${icon_url}`}
					alt=''
					className='fullvideo__comment-img'
				/>
				<h4>{`${name} ${fname}`}</h4>
			</div>
			<p className='fullvideo__comment-desc'>{description}</p>
		</div>
	)
}

export default Comment
