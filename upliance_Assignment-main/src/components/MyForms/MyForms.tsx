import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Preview, Edit, Delete, List as ListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loadFormForPreview, setCurrentFormForEdit } from '../../store/formBuilderSlice';
import { FormSchema } from '../../types/form';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector((state) => state.formBuilder);

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(loadFormForPreview(form));
    navigate('/preview');
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(setCurrentFormForEdit(form));
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldTypeCounts = (form: FormSchema) => {
    const counts: { [key: string]: number } = {};
    form.fields.forEach(field => {
      counts[field.type] = (counts[field.type] || 0) + 1;
    });
    return counts;
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ListIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No Saved Forms
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          You haven't created any forms yet. Start building your first form!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
          size="large"
        >
          Create Your First Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Forms
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
          startIcon={<Edit />}
        >
          Create New Form
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        You have {savedForms.length} saved form{savedForms.length !== 1 ? 's' : ''}. 
        Click "Preview" to test a form or "Edit" to modify it.
      </Alert>

      <Grid container spacing={3}>
        {savedForms.map((form) => {
          const fieldCounts = getFieldTypeCounts(form);
          const derivedFieldsCount = form.fields.filter(f => f.isDerived).length;
          const requiredFieldsCount = form.fields.filter(f => f.required).length;

          return (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {form.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Created: {formatDate(form.createdAt)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {Object.entries(fieldCounts).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${count} ${type}`}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      ))}
                    </Box>

                    {derivedFieldsCount > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'secondary.main' }}>
                        {derivedFieldsCount} derived field{derivedFieldsCount !== 1 ? 's' : ''}
                      </Typography>
                    )}
                    
                    {requiredFieldsCount > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'error.main' }}>
                        {requiredFieldsCount} required field{requiredFieldsCount !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Preview />}
                    onClick={() => handlePreviewForm(form)}
                    variant="contained"
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditForm(form)}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MyForms;