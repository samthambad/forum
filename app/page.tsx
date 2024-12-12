import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";

export default function Home() {
  return <div>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Threads
        </ListSubheader>
      }
    >
      <ListItemButton>Home</ListItemButton>
    </List>
  </div>
}