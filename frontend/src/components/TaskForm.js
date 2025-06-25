import React, { useState } from 'react';
import { useCreateTaskMutation } from '../features/tasks/taskApi';
import { useGetUsersQuery } from '../features/users/userApi';
import { 
  Box, 
  Typography, 
  Alert, 
  Paper, 
  Stack,
  CircularProgress,
  Divider,
  Fade
} from '@mui/material';
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  AssignmentInd as AssignIcon,
  Checklist as StatusIcon,
  AddTask as CreateIcon
} from '@mui/icons-material';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('to-do');
  const [assignedTo, setAssignedTo] = useState('');
  const [createTask, { isLoading, error }] = useCreateTaskMutation();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ page: 1, limit: 100 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({ title, description, status, assignedTo }).unwrap();
      setTitle('');
      setDescription('');
      setStatus('to-do');
      setAssignedTo('');
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  const statusOptions = [
    { value: 'to-do', label: 'To-Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const userOptions = [
    { value: '', label: 'Select User' },
    ...(usersData?.users?.map((user) => ({
      value: user._id,
      label: user.username,
    })) || []),
  ];

  return (
    <Paper elevation={4} sx={{ 
      p: 4,
      borderRadius: 3,
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      my: 4,
      background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)',
      border: '1px solid rgba(0, 0, 0, 0.08)'
    }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" fontWeight={600} color="primary" gutterBottom>
          <CreateIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 32 }} />
          Create New Task
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the task details below
        </Typography>
        <Divider sx={{ my: 3 }} />
      </Box>

      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.data?.message || 'Failed to create task'}
          </Alert>
        </Fade>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Task Title"
            required
            fullWidth
            variant="outlined"
            icon={<TitleIcon color="action" />}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}
          />

          <Input
            type="text"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            fullWidth
            variant="outlined"
            icon={<DescriptionIcon color="action" />}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}
          />

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            label="Status"
            required
            fullWidth
            icon={<StatusIcon color="action" />}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}
          />

          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            options={userOptions}
            label="Assign To"
            required
            disabled={isUsersLoading}
            fullWidth
            icon={<AssignIcon color="action" />}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}
          />
          {isUsersLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Loading team members...
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            disabled={isLoading || isUsersLoading}
            fullWidth
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
            sx={{
              py: 2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            {isLoading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TaskForm;