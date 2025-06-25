import React, { useState } from 'react';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../features/tasks/taskApi';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Chip,
  Divider,
  Avatar,
  useTheme,
  CircularProgress,
  Tooltip,
  Skeleton,
  Badge,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CompletedIcon,
  MoreTime as PendingIcon,
  Autorenew as InProgressIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  'to-do': {
    icon: <PendingIcon fontSize="small" />,
    color: 'warning',
    label: 'To Do'
  },
  'in-progress': {
    icon: <InProgressIcon fontSize="small" />,
    color: 'info',
    label: 'In Progress'
  },
  'completed': {
    icon: <CompletedIcon fontSize="small" />,
    color: 'success',
    label: 'Completed'
  }
};

const TaskList = ({ tasks = [], isLoading }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const handleStatusChange = async (task, newStatus) => {
    if (!task?._id) return;
    try {
      await updateTask({ id: task._id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteTask(id).unwrap();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const toggleDescription = (taskId) => {
    if (!taskId) return;
    setExpandedDescriptions(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  if (isLoading) {
    return (
      <Stack spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            height={150} 
            sx={{ borderRadius: 2 }} 
          />
        ))}
      </Stack>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center', 
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
      }}>
        <Typography variant="h6" color="text.secondary">
          No tasks found. Create one to get started!
        </Typography>
      </Paper>
    );
  }

  // Filter out any null/undefined tasks
  const validTasks = tasks.filter(task => task && task._id);

  return (
    <Box sx={{ maxWidth: '100%', width: 800, mx: 'auto' }}>
      <Stack spacing={2.5}>
        {validTasks.map((task) => {
          if (!task) return null;
          
          const statusData = statusConfig[task.status] || statusConfig['to-do'];
          const createdAt = task.createdAt ? new Date(task.createdAt) : new Date();
          const assignedToInitial = task.assignedTo?.username?.charAt(0)?.toUpperCase() || '?';
          const createdByInitial = task.createdBy?.username?.charAt(0)?.toUpperCase() || '?';

          return (
            <Paper
              key={task._id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 4px 20px ${theme.palette.action.hover}`
                }
              }}
            >
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                      {task.title || 'Untitled Task'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Chip
                    icon={statusData.icon}
                    label={statusData.label}
                    color={statusData.color}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      borderWidth: 1,
                      borderStyle: 'solid',
                      fontWeight: 500
                    }}
                  />
                </Box>

                {task.description && (
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: expandedDescriptions[task._id] ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {task.description}
                    </Typography>
                    {task.description.length > 100 && (
                      <Button 
                        size="small" 
                        onClick={() => toggleDescription(task._id)}
                        sx={{ 
                          mt: 1,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: expandedDescriptions[task._id] 
                            ? theme.palette.primary.light 
                            : 'transparent',
                          color: expandedDescriptions[task._id]
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                          border: `1px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText
                          },
                          transition: 'all 0.2s ease-in-out',
                          fontWeight: 500,
                          textTransform: 'none',
                          letterSpacing: 0.5
                        }}
                      >
                        {expandedDescriptions[task._id] ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          task.assignedTo?._id === user?.id ? (
                            <Avatar sx={{ 
                              width: 16, 
                              height: 16,
                              bgcolor: theme.palette.success.main,
                              fontSize: '0.6rem'
                            }}>
                              You
                            </Avatar>
                          ) : null
                        }
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: theme.palette.primary.main 
                          }}>
                            {assignedToInitial}
                          </Avatar>
                          <Typography variant="body2">
                            Assigned to: {task.assignedTo?.username || 'Unassigned'}
                          </Typography>
                        </Box>
                      </Badge>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: theme.palette.secondary.main 
                      }}>
                        {createdByInitial}
                      </Avatar>
                      <Typography variant="body2">
                        Created by: {task.createdBy?.username || 'Unknown'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Select
                      value={task.status || 'to-do'}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      disabled={
                        !user || 
                        (user.role !== 'manager' && task.assignedTo?._id !== user.id) || 
                        isUpdating
                      }
                      size="small"
                      IconComponent={ArrowDropDownIcon}
                      sx={{
                        minWidth: 150,
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          py: 1
                        },
                        '&.Mui-disabled': {
                          opacity: 0.8
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: theme.shadows[2]
                          }
                        }
                      }}
                    >
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <MenuItem key={value} value={value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {React.cloneElement(config.icon, { fontSize: 'small' })}
                            <Typography variant="body2">{config.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>

                    {user?.role === 'manager' && (
                      <Tooltip title="Delete task">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(task._id)}
                          disabled={isDeleting || !task._id}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.error.light
                            }
                          }}
                        >
                          {isDeleting ? (
                            <CircularProgress size={20} color="error" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default TaskList;