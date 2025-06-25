import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApi';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper, 
  CssBaseline,
  Avatar,
  CircularProgress,
  Divider,
  useTheme,
  Fade,
  IconButton,
  InputAdornment,
  alpha,
  Chip,
  Stack
} from '@mui/material';
import { 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  Business,
  Security,
  EmailOutlined,
  KeyOutlined,
  Shield,
  VerifiedUser,
  CorporateFare,
  AdminPanelSettings
} from '@mui/icons-material';
import Button from './common/Button';
import Input from './common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, ${alpha('#1e293b', 0.02)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha('#3b82f6', 0.02)} 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }
      }}
    >
      <CssBaseline />
      
      {/* Security Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 2
        }}
      >
        <Chip
          icon={<Shield sx={{ fontSize: '18px !important' }} />}
          label="Enterprise Security"
          size="small"
          sx={{
            bgcolor: 'rgba(22, 163, 74, 0.1)',
            color: '#15803d',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      </Box>

      {/* Left Panel - Brand & Info */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: { xs: '100%', lg: '45%' },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          padding: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              mb: 3,
              mx: 'auto'
            }}
          >
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h3" fontWeight="700" sx={{ mb: 2, letterSpacing: '-1px' }}>
            Teck Catalyze
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            TeamTask Management Platform
          </Typography>
          
          <Stack spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <Security />, title: 'Bank-Grade Security' },
              { icon: <VerifiedUser />, title: 'Compliance Ready' },
              { icon: <AdminPanelSettings />, title: 'Role-Based Access' }
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 20 } })}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.4 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: { xs: 0, lg: 'auto' },
          width: { xs: '100%', lg: '55%' },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480, px: { xs: 3, sm: 0 } }}>
          
          {/* Mobile Header */}
          <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.main,
                mx: 'auto',
                mb: 2,
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <CorporateFare sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="700" color="primary" sx={{ mb: 1 }}>
              Teck Catalyze
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enterprise Management Platform
            </Typography>
          </Box>

          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5 },
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                  0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                position: 'relative'
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>
                  Secure Access Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Authenticate with your corporate credentials to access the management dashboard
                </Typography>
              </Box>

              {/* Security Status */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Shield sx={{ fontSize: 16, color: '#15803d' }} />
                  <Typography variant="caption" fontWeight="600" color="#15803d">
                    SECURE CONNECTION ESTABLISHED
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Your connection is protected by 256-bit SSL encryption
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      background: 'rgba(254, 242, 242, 0.8)',
                      '& .MuiAlert-icon': { color: '#dc2626' },
                      '& .MuiAlert-message': { fontWeight: 500 }
                    }}
                    icon={<Security fontSize="small" />}
                  >
                    {error.data?.message || 'Authentication failed. Please verify your credentials and try again.'}
                  </Alert>
                </Fade>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}
                  >
                    Corporate Email Address
                  </Typography>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@TeckCatalyze.com"
                    required
                    fullWidth
                    autoFocus
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: '#6b7280', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          borderColor: '#cbd5e1'
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}
                  >
                    Password
                  </Typography>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlined sx={{ color: '#6b7280', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: '#6b7280',
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          borderColor: '#cbd5e1'
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Forgot Password */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 2,
                    mb: 4,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
                    '&:hover': {
                      boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#9ca3af',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Authenticating...
                    </Box>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>

                

                {/* Register Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Need access to the platform?{' '}
                    <Link
                      to="/register"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Request Enterprise Account
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Fade>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
  <Typography
    variant="body1"
    sx={{ fontWeight: 600, color: 'black', fontSize: '1rem' }}
  >
    © {new Date().getFullYear()} {process.env.REACT_APP_COMPANY_NAME || 'Teck Catalyze'} TeamTask Solution. All rights reserved.
  </Typography>

  <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
    {[
      { text: 'Privacy Policy', to: '/privacy' },
      { text: 'Terms of Service', to: '/terms' },
      { text: 'Security Center', to: '/security' },
      { text: 'Support', to: '/support' }
    ].map((link) => (
      <Link
        key={link.to}
        to={link.to}
        style={{
          textDecoration: 'none',
          color: 'black',          // black text
          fontSize: '1rem',        // larger size
          fontWeight: 600          // bold
        }}
      >
        {link.text}
      </Link>
    ))}
  </Stack>
</Box>


        </Box>
      </Container>
    </Box>
  );
};

export default Login;