import React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProblemIcon from '@mui/icons-material/ReportProblem';
import VisitIcon from '@mui/icons-material/LocalHospital';
import AppointmentIcon from '@mui/icons-material/Event';
import TransactionIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const DashboardContainer = styled('div')({
  display: 'flex',
  minHeight: '100vh',
});

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  zIndex: 1,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.spacing(8), // Adjust based on Navbar height
  zIndex: 0,
}));

const ToolbarSpacer = styled('div')(({ theme }) => theme.mixins.toolbar);

const CustomListItem = styled(ListItem)(({ theme }) => ({
  fontSize: '30px',
  '& .MuiListItemIcon-root': {
    fontSize: '30px', 
  },
}));

function UserDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <CssBaseline />
      <CustomDrawer variant="permanent">
        <Box>
          <ToolbarSpacer />
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, link: '.' },
              { text: 'Orders', icon: <ShoppingCartIcon />, link: 'orders' },
              { text: 'Reports', icon: <BarChartIcon />, link: 'reports' },
              { text: 'Notifications', icon: <NotificationsIcon />, link: 'notifications' },
              { text: 'Problems', icon: <ProblemIcon />, link: 'problems' },
              { text: 'Visits', icon: <VisitIcon />, link: 'visits' },
              { text: 'Appointments', icon: <AppointmentIcon />, link: 'appointments' },
              { text: 'Transactions', icon: <TransactionIcon />, link: 'transactions' },
              { text: 'Settings', icon: <SettingsIcon />, link: 'settings' },
            ].map((item, index) => (
              <CustomListItem button key={item.text} style={{ borderBottom: index === 8 ? 'none' : '1px solid #2cb3b53c' }} component={Link} to={item.link}>
                <ListItemIcon style={{ color: '#2cb2b5' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '1rem' } }} />
              </CustomListItem>
            ))}
          </List>
          <Divider />
        </Box>
        <Box>
          <List>
            <CustomListItem button>
              <ListItemIcon>
                <HelpOutlineIcon style={{ fontSize: 20 , color: '#2cb2b5' }} />
              </ListItemIcon>
              <ListItemText primary="Help" primaryTypographyProps={{ style: { fontSize: '1rem' } }} />
            </CustomListItem>
          </List>
          <Divider />
          <Typography color="#737777" align="center" style={{ padding: '10px',fontSize:'0.7rem' }}>
            &copy; {new Date().getFullYear()} MedConnect. All rights reserved.
          </Typography>
        </Box>
      </CustomDrawer>
      <Content>
        <Outlet />
      </Content>
    </DashboardContainer>
  );
}

export default UserDashboard;
