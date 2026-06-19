

export default {
  mainCard: {

  },
  statusCard: {
    card: {
      height: '100%',
      alignItems: 'center',
      justifyContent: "center",
      display: 'flex'
    },
    cardClickable: {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }
    },
    content: {
      p: 2, pb: '16px !important'
    }
  },
  chip: {
    maxWidth: "180px",
    borderRadius: "8px",
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    // paddingLeft: 8,
    // paddingRight: 8,
  }
}