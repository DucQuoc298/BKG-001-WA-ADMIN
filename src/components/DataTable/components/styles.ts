
export default {
	pagination: {
		container: {
			display: 'flex',
			gap: 1,
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		rowPerPage: {
			display: 'flex',
			gap: 1,
			alignItems: 'center',
		},
		numberField: {
			width: '60px',
			'& .MuiInputBase-root': {
				height: '40px',
				'& .MuiInputBase-input': {
					padding: '0px 8px !important',
				},
			}
		},
		pagination: {
			display: 'flex',
			gap: 1,
			alignItems: 'center',
		}
	}
}