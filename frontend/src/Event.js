import { Card, CardContent, Typography, Button } from "@mui/material"

function Event({event, onEditClick, onDeleteClick}) {
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
        marginLeft: {lg:"1%", md:"0%", sm:"0%", xs:"0%"},
      }}
      style={{ marginBottom: '10px', cursor: 'pointer' }}
      // onClick={() => onEditClick(event)}
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
        {<Button sx={{display: { xs: 'inline-block', md: 'inline-block' }, marginRight: '10px'}} size="small" variant="contained" color="primary" onClick={() => onEditClick(event)}>
          Edit
        </Button>}
        {<Button size="small" variant="contained" color="secondary" onClick={() => onDeleteClick(event)}>
          Delete
        </Button>}
      </CardContent>
    </Card>
  )
}

export default Event
