import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetTasksQuery } from '../features/tasks/taskApi';
import { setSelectedStatus } from '../features/tasks/taskSlice';
import useAuth from '../hooks/useAuth';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Button as MuiButton,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Paper,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { AdminPanelSettings, Logout, FilterList, AddTask } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedStatus } = useSelector((state) => state.tasks);
  const { data, isLoading, isError, error } = useGetTasksQuery({
    page: 1,
    limit: 10,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleFilter = (event, newStatus) => {
    if (newStatus !== null) {
      dispatch(setSelectedStatus(newStatus));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={1} sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ 
            background: 'linear-gradient(45deg, #1976d2 30%, #00bcd4 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FilterList fontSize="small" /> TeamTask
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              avatar={
    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '1rem' }}>
      {user?.username[0]?.toUpperCase()}
    </Avatar>
  }
  label={
    <Box>
      <Typography variant="body1" fontWeight={600}>
        {user?.username}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {user?.role}
      </Typography>
    </Box>
  }
  variant="outlined"
  sx={{ 
    px: 2, // more horizontal padding
    py: 1, // vertical padding (not always respected by Chip, but helps with label spacing)
    height: 48, // similar height to large button
    borderColor: 'divider',
    '.MuiChip-label': { 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start',
      gap: 0.5,
      lineHeight: 1.2
    }
              }}
            />

            {user?.role === 'manager' && (
              <MuiButton
          component={Link}
  to="/admin"
  startIcon={<AdminPanelSettings fontSize="medium" />}
  variant="text"
  color="inherit"
  size="large"
  sx={{
    textTransform: 'none',
    borderRadius: 2,
    px: 3,
    py: 1.5,
    minWidth: 140,
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.2s ease-out',
    '&:hover': {
       backgroundColor: '#e0e0e0',
      transform: 'translateY(-1px)'
    },
    '& .MuiButton-startIcon': {
      marginRight: 1,
      transition: 'transform 0.2s ease-out'
    },
    '&:hover .MuiButton-startIcon': {
      transform: 'scale(1.05)'
    }
  }}
>
  Admin Panel
              </MuiButton>
            )}

 <IconButton
  onClick={logout}
  sx={{
    color: 'error.main', 
    '&:hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.08)', 
      color: 'error.dark' 
    },
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    borderRadius: 2,
    px: 3,
    py: 1.5,
    transition: 'all 0.2s ease-in-out',
    minWidth: 120,
    minHeight: 48,
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem' 
    }
  }}
  disableRipple={false} 
>
  <Logout />
  <Typography 
    variant="h6"
    sx={{ 
      ml: 1,
      fontWeight: 600,
      fontSize: '1.125rem'
    }}
  >
    Logout
  </Typography>
</IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Action Bar */}
        <Paper elevation={0} sx={{ 
          p: 2, 
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="medium">
              Task Management
            </Typography>
            {user?.role === 'manager' && (
              <MuiButton
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddTask />}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2
                }}
                onClick={() => document.getElementById('task-form').scrollIntoView()}
              >
                New Task
              </MuiButton>
            )}
          </Stack>
        </Paper>

        {/* Task Form (for managers) */}
        {user?.role === 'manager' && (
          <Box id="task-form" sx={{ mb: 4 }}>
            <TaskForm />
          </Box>
        )}

        {/* Content Section */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <MuiButton 
                color="inherit" 
                size="small"
                onClick={() => window.location.reload()}
              >
                Retry
              </MuiButton>
            }
          >
            {error?.data?.message || 'Failed to load tasks. Please try again.'}
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ mb: 2 }}>
              {selectedStatus === 'all' ? 'All Tasks' : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Tasks`}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({data?.tasks?.length || 0} tasks)
              </Typography>
            </Typography>

            {/* Filter Controls - Moved below the heading */}
            <StyledToggleButtonGroup
              value={selectedStatus}
              onChange={handleFilter}
              exclusive
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="all" sx={{ textTransform: 'none' }}>
                All
              </ToggleButton>
              <ToggleButton value="to-do" sx={{ textTransform: 'none' }} color="warning">
                To-Do
              </ToggleButton>
              <ToggleButton value="in-progress" sx={{ textTransform: 'none' }} color="info">
                In Progress
              </ToggleButton>
              <ToggleButton value="completed" sx={{ textTransform: 'none' }} color="success">
                Completed
              </ToggleButton>
            </StyledToggleButtonGroup>

            <TaskList tasks={data?.tasks || []} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;