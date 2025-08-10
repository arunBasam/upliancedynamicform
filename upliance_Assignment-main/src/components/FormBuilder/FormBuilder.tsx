import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  addField,
  updateField,
  deleteField,
  setFormName,
  saveCurrentForm,
  clearCurrentForm,
} from '../../store/formBuilderSlice';
import { FormField } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';
import FieldTypeSelector from './FieldTypeSelector';
import FieldConfigurator from './FieldConfigurator';
import FieldList from './FieldList';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.formBuilder);
  
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [pendingFieldType, setPendingFieldType] = useState<string | null>(null);

  const handleSelectFieldType = (type: string) => {
    setPendingFieldType(type);
    setEditingField(null);
    setConfiguratorOpen(true);
  };

  const handleSaveField = (fieldConfig: FormField) => {
    try {
      if (editingField) {
        // Update existing field
        dispatch(updateField(fieldConfig));
        setSnackbar({ open: true, message: 'Field updated successfully!', severity: 'success' });
      } else {
        // Add new field
        const newField = {
          ...fieldConfig,
          id: uuidv4(),
          type: pendingFieldType as any,
        };
        dispatch(addField(newField));
        setSnackbar({ open: true, message: 'Field added successfully!', severity: 'success' });
      }
      
      setConfiguratorOpen(false);
      setEditingField(null);
      setPendingFieldType(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving field!', severity: 'error' });
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setConfiguratorOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
    setSnackbar({ open: true, message: 'Field deleted successfully!', severity: 'success' });
  };

  const handleSaveForm = () => {
    if (!currentForm.name) {
      setSaveDialogOpen(true);
      return;
    }
    
    if (currentForm.fields.length === 0) {
      setSnackbar({ open: true, message: 'Add at least one field before saving!', severity: 'error' });
      return;
    }
    
    dispatch(saveCurrentForm());
    setSnackbar({ open: true, message: 'Form saved successfully!', severity: 'success' });
  };

  const handleConfirmSave = () => {
    if (currentForm.name && currentForm.fields.length > 0) {
      dispatch(saveCurrentForm());
      setSaveDialogOpen(false);
      setSnackbar({ open: true, message: 'Form saved successfully!', severity: 'success' });
    }
  };

  const handleClearForm = () => {
    dispatch(clearCurrentForm());
    setSnackbar({ open: true, message: 'Form cleared!', severity: 'success' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Form Builder
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleClearForm} variant="outlined" color="secondary">
            Clear Form
          </Button>
          <Button
            onClick={handleSaveForm}
            variant="contained"
            startIcon={<Save />}
            disabled={currentForm.fields.length === 0}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {/* Form Name */}
      <TextField
        fullWidth
        label="Form Name"
        value={currentForm.name}
        onChange={(e) => dispatch(setFormName(e.target.value))}
        sx={{ mb: 3 }}
        placeholder="Enter a name for your form"
      />

      {/* Field Type Selector */}
      <FieldTypeSelector onSelectFieldType={handleSelectFieldType} />

      {/* Field List */}
      <FieldList
        fields={currentForm.fields}
        onEditField={handleEditField}
        onDeleteField={handleDeleteField}
      />

      {/* Field Configurator Dialog */}
      <FieldConfigurator
        open={configuratorOpen}
        field={editingField}
        onClose={() => {
          setConfiguratorOpen(false);
          setEditingField(null);
          setPendingFieldType(null);
        }}
        onSave={handleSaveField}
      />

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            value={currentForm.name}
            onChange={(e) => dispatch(setFormName(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormBuilder;