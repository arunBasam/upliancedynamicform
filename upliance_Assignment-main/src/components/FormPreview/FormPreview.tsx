import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  Snackbar,
} from '@mui/material';
import { Preview, CheckCircle } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updatePreviewData, setValidationErrors } from '../../store/formBuilderSlice';
import { validateForm } from '../../utils/validation';
import { updateDerivedFields } from '../../utils/derivedFields';
import FormRenderer from './FormRenderer';

const FormPreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm, currentPreviewForm, previewData, validationErrors } = useAppSelector((state) => state.formBuilder);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Use currentPreviewForm if available (from My Forms), otherwise use currentForm
  const formToPreview = currentPreviewForm || (currentForm.fields.length > 0 ? currentForm : null);
  
  const [formData, setFormData] = useState(previewData);

  useEffect(() => {
    if (formToPreview) {
      // Initialize form data with default values
      const initialData: { [key: string]: any } = {};
      formToPreview.fields.forEach(field => {
        if (field.defaultValue) {
          initialData[field.id] = field.defaultValue;
        }
      });
      setFormData({ ...initialData, ...previewData });
    }
  }, [formToPreview, previewData]);

  useEffect(() => {
    if (formToPreview) {
      // Update derived fields when form data changes
      const updatedData = updateDerivedFields(formToPreview.fields, formData);
      setFormData(updatedData);
      
      // Update the store with the latest data
      Object.keys(updatedData).forEach(fieldId => {
        if (updatedData[fieldId] !== previewData[fieldId]) {
          dispatch(updatePreviewData({ fieldId, value: updatedData[fieldId] }));
        }
      });
    }
  }, [formData, formToPreview, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    dispatch(updatePreviewData({ fieldId, value }));
  };

  const handleValidate = () => {
    if (!formToPreview) return false;
    
    const errors = validateForm(formToPreview.fields, formData);
    dispatch(setValidationErrors(errors));
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (handleValidate()) {
      setSubmitSuccess(true);
      console.log('Form submitted:', formData);
    }
  };

  if (!formToPreview || formToPreview.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Preview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No Form to Preview
        </Typography>
        <Typography color="text.secondary">
          Create a form first or select a saved form to preview it here.
        </Typography>
      </Box>
    );
  }

  const getFieldError = (fieldId: string) => {
    return validationErrors.find(error => error.fieldId === fieldId)?.message;
  };

  const sortedFields = [...formToPreview.fields].sort((a, b) => a.order - b.order);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Form Preview
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {formToPreview.name || 'Untitled Form'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is how your form will appear to end users. All validations and derived fields are active.
          </Typography>
        </CardContent>
      </Card>

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {formToPreview.name || 'Form Preview'}
          </Typography>

          {sortedFields.map((field) => (
            <FormRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={getFieldError(field.id)}
              onChange={(value) => handleFieldChange(field.id, value)}
              disabled={field.isDerived}
            />
          ))}

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
              Please fix the validation errors above before submitting.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
            >
              Submit Form
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleValidate}
            >
              Validate Form
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={4000}
        onClose={() => setSubmitSuccess(false)}
      >
        <Alert 
          onClose={() => setSubmitSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Form submitted successfully! Check the console for submitted data.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormPreview;