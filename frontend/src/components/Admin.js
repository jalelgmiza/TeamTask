import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUsersQuery } from '../features/users/userApi';
import { useRegisterMutation } from '../features/auth/authApi';
import useAuth from '../hooks/useAuth';
import { 
  Container, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Alert, 
  Button as MuiButton,
  Paper,
  Skeleton,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Avatar,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  People as PeopleIcon, 
  ArrowBack as ArrowBackIcon, 
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery({ page: 1, limit: 10 });
  const [register, { isLoading: isRegistering, error: registerError }] = useRegisterMutation();
  const [searchTerm, setSearchTerm] = useState('');

  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'manager') navigate('/dashboard');
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password, role }).unwrap();
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('user');
      setShowAddUser(false);
      refetch();
    } catch (err) {
    
    }
  };

  const filteredUsers = data?.users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: 0, 
        borderRadius: 4,
        
        bgcolor: 'background.paper',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        
        <Box sx={{
          p: 4,
          bgcolor: 'primary.main',
          color: 'black',
          background: 'white'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                bgcolor: 'white', 
                width: 56, 
                height: 56,
                color: 'primary.main'
              }}>
                <PeopleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                User Management
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <MuiButton 
  variant="contained" 
  startIcon={showAddUser ? <ArrowBackIcon /> : <AddIcon />}
  onClick={() => setShowAddUser(!showAddUser)}
  sx={{ 
    textTransform: 'none',
    borderRadius: 2,
    px: 3,
    boxShadow: 'none',
    backgroundColor: '#1976d2', 
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    }
  }}
>
  {showAddUser ? 'Back to List' : 'Add New User'}
</MuiButton>

              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <MuiButton 
                  variant="outlined" 
                  color="inherit"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Dashboard
                </MuiButton>
              </Link>
            </Stack>
          </Stack>
        </Box>

        
        <Box sx={{ p: 4 }}>
          {showAddUser ? (
           
            <Card sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              border: 'none',
              boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    width: 48,
                    height: 48
                  }}>
                    <PersonAddIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="medium">
                    Create New User Account
                  </Typography>
                </Stack>
                
                {registerError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {registerError.data?.message || 'User creation failed. Please check your inputs.'}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        variant="outlined"
                        SelectProps={{
                          native: true,
                        }}
                        sx={{ mb: 2 }}
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                      </TextField>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: 2
                  }}>
                    <MuiButton
                      variant="outlined"
                      color="secondary"
                      onClick={() => setShowAddUser(false)}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      Cancel
                    </MuiButton>
                    <MuiButton 
                      type="submit" 
                      disabled={isRegistering} 
                      variant="contained"
                      color="primary"
                      startIcon={isRegistering ? <CircularProgress size={20} color="inherit" /> : null}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        minWidth: '150px'
                      }}
                    >
                      {isRegistering ? 'Creating...' : 'Create User'}
                    </MuiButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" fontWeight="medium">
                  All Users ({data?.users?.length || 0})
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Search users..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: '300px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              {isLoading ? (
                <Box sx={{ width: '100%' }}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton 
                      key={index} 
                      animation="wave" 
                      height={72} 
                      sx={{ 
                        mb: 1,
                        borderRadius: 2
                      }} 
                    />
                  ))}
                </Box>
              ) : isError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error?.data?.message || 'Failed to load users. Please try again later.'}
                </Alert>
              ) : (
                <Paper sx={{ 
                  width: '100%', 
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers?.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow 
                            key={user._id}
                            hover
                            sx={{ 
                              '&:last-child td': { border: 0 },
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ 
                                  width: 40, 
                                  height: 40,
                                  bgcolor: user.role === 'manager' ? 'primary.main' : 'grey.300',
                                  color: user.role === 'manager' ? 'primary.contrastText' : 'text.primary'
                                }}>
                                  {user.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography fontWeight="medium">{user.username}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <EmailIcon color="action" fontSize="small" />
                                <Typography>{user.email}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip 
                                label={user.role} 
                                color={user.role === 'manager' ? 'primary' : 'default'} 
                                size="small"
                                sx={{ 
                                  borderRadius: 1,
                                  fontWeight: 'medium',
                                  textTransform: 'capitalize',
                                  px: 1
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                              {searchTerm ? 'No matching users found' : 'No users available'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin;