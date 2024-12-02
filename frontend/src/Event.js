import { Card, CardContent, Typography, Button } from "@mui/material"

function Event({event, onEditClick}){
  const {name, description, startDateTime, endDateTime} = event
  return(
    <Card
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
        },
        display: { xs: 'block', md: 'flex' },
        width: "95%",
        marginLeft: "1%",
      }}
      style={{ marginBottom: '10px', cursor: 'pointer' }}
      onClick={() => onEditClick(event)}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" sx={{display: { xs: 'none', md: 'block' }}}>
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {startDateTime.format('YYYY/MM/DD, h:mm a')} - {endDateTime.format('YYYY/MM/DD, h:mm a')}
        </Typography>
        {<Button sx={{display: { xs: 'none', md: 'block' }}} size="small" variant="contained" color="primary">
          Edit
        </Button>}
      </CardContent>
    </Card>
  )
}

export default Event
