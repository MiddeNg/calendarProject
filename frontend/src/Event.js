import { Card, CardContent, Typography, Button } from "@mui/material"

function Event({event, onEditClick}){
  const {name, description, startDateTime, endDateTime} = event
  return(
    <Card sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      '&:hover': {
        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
      },
    }} style={{ marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {startDateTime.format('YYYY/MM/DD, h:mm a')} - {endDateTime.format('YYYY/MM/DD, h:mm a')}
        </Typography>
        <Button size="small" onClick={() => onEditClick(event)} variant="contained" color="primary">
          Edit
        </Button>
      </CardContent>
    </Card>
  )
}

export default Event

