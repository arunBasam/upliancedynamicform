import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, Add, Delete } from '@mui/icons-material';
import { FormField, ValidationRule, SelectOption, DerivedFieldConfig } from '../../types/form';
import { useAppSelector } from '../../hooks/useAppSelector';

interface FieldConfiguratorProps {
  open: boolean;
  field: FormField | null;
  onClose: () => void;
  onSave: (field: FormField) => void;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({
  open,
  field,
  onClose,
  onSave,
}) => {
  const { currentForm } = useAppSelector((state) => state.formBuilder);
  const [config, setConfig] = useState<Partial<FormField>>({});
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [newOption, setNewOption] = useState({ value: '', label: '' });
  const [isDerived, setIsDerived] = useState(false);
  const [derivedConfig, setDerivedConfig] = useState<DerivedFieldConfig>({
    parentFields: [],
    formula: '',
    description: '',
  });

  useEffect(() => {
    if (field) {
      setConfig(field);
      setOptions(field.options || []);
      setIsDerived(field.isDerived || false);
      setDerivedConfig(field.derivedConfig || {
        parentFields: [],
        formula: '',
        description: '',
      });
    } else {
      setConfig({});
      setOptions([]);
      setIsDerived(false);
      setDerivedConfig({
        parentFields: [],
        formula: '',
        description: '',
      });
    }
  }, [field]);

  const handleSave = () => {
    if (!config.type || !config.label) return;

    const validations: ValidationRule[] = config.validations || [];
    
    const fieldToSave: FormField = {
      id: config.id || '',
      type: config.type as any,
      label: config.label,
      required: config.required || false,
      defaultValue: config.defaultValue,
      validations,
      options: ['select', 'radio'].includes(config.type as string) ? options : undefined,
      isDerived,
      derivedConfig: isDerived ? derivedConfig : undefined,
      order: config.order || 0,
    };

    onSave(fieldToSave);
    onClose();
  };

  const addOption = () => {
    if (newOption.value && newOption.label) {
      setOptions([...options, newOption]);
      setNewOption({ value: '', label: '' });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addValidation = (type: ValidationRule['type']) => {
    const validations = config.validations || [];
    const newRule: ValidationRule = {
      type,
      message: `Invalid ${config.label}`,
    };
    
    setConfig({
      ...config,
      validations: [...validations, newRule],
    });
  };

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    const validations = [...(config.validations || [])];
    validations[index] = { ...validations[index], ...updates };
    setConfig({ ...config, validations });
  };

  const removeValidation = (index: number) => {
    const validations = config.validations?.filter((_, i) => i !== index) || [];
    setConfig({ ...config, validations });
  };

  const availableParentFields = currentForm.fields.filter(f => 
    f.id !== config.id && !f.isDerived
  );

  const getFormulaTemplates = () => {
    switch (config.type) {
      case 'number':
        return [
          'age = current_year - birth_year',
          'sum = field1 + field2',
          'total = price * quantity',
        ];
      case 'text':
        return [
          'concat = field1 + " " + field2',
          'fullname = firstname + " " + lastname',
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {field ? 'Edit Field' : 'Configure Field'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Configuration */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Field Label"
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                margin="normal"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.required || false}
                    onChange={(e) => setConfig({ ...config, required: e.target.checked })}
                  />
                }
                label="Required Field"
              />
              
              <TextField
                fullWidth
                label="Default Value"
                value={config.defaultValue || ''}
                onChange={(e) => setConfig({ ...config, defaultValue: e.target.value })}
                margin="normal"
                type={config.type === 'number' ? 'number' : config.type === 'date' ? 'date' : 'text'}
                InputLabelProps={config.type === 'date' ? { shrink: true } : undefined}
              />
            </Grid>

            {/* Options for Select/Radio */}
            {['select', 'radio'].includes(config.type as string) && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Options
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    label="Value"
                    value={newOption.value}
                    onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  />
                  <TextField
                    size="small"
                    label="Label"
                    value={newOption.label}
                    onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  />
                  <Button onClick={addOption} startIcon={<Add />}>
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option.label}
                      onDelete={() => removeOption(index)}
                      deleteIcon={<Delete />}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Derived Field Configuration */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDerived}
                    onChange={(e) => setIsDerived(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                label="Derived Field"
                onClick={(e) => e.stopPropagation()}
              />
            </AccordionSummary>
            
            {isDerived && (
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Parent Fields</InputLabel>
                      <Select
                        multiple
                        value={derivedConfig.parentFields}
                        onChange={(e) => setDerivedConfig({
                          ...derivedConfig,
                          parentFields: e.target.value as string[]
                        })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => {
                              const field = availableParentFields.find(f => f.id === value);
                              return <Chip key={value} label={field?.label || value} size="small" />;
                            })}
                          </Box>
                        )}
                      >
                        {availableParentFields.map((field) => (
                          <MenuItem key={field.id} value={field.id}>
                            {field.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Formula"
                      value={derivedConfig.formula}
                      onChange={(e) => setDerivedConfig({
                        ...derivedConfig,
                        formula: e.target.value
                      })}
                      margin="normal"
                      multiline
                      rows={2}
                      helperText="Example templates: age = current_year - birth_year, concat = field1 + ' ' + field2"
                    />
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption">Quick templates:</Typography>
                      {getFormulaTemplates().map((template, index) => (
                        <Chip
                          key={index}
                          label={template}
                          size="small"
                          sx={{ ml: 1, mt: 0.5 }}
                          onClick={() => setDerivedConfig({
                            ...derivedConfig,
                            formula: template
                          })}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={derivedConfig.description}
                      onChange={(e) => setDerivedConfig({
                        ...derivedConfig,
                        description: e.target.value
                      })}
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            )}
          </Accordion>

          {/* Validation Rules */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Validation Rules</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Button onClick={() => addValidation('minLength')} size="small" sx={{ mr: 1 }}>
                  Min Length
                </Button>
                <Button onClick={() => addValidation('maxLength')} size="small" sx={{ mr: 1 }}>
                  Max Length
                </Button>
                <Button onClick={() => addValidation('email')} size="small" sx={{ mr: 1 }}>
                  Email Format
                </Button>
                <Button onClick={() => addValidation('password')} size="small" sx={{ mr: 1 }}>
                  Password Rules
                </Button>
                {config.type === 'number' && (
                  <>
                    <Button onClick={() => addValidation('min')} size="small" sx={{ mr: 1 }}>
                      Min Value
                    </Button>
                    <Button onClick={() => addValidation('max')} size="small" sx={{ mr: 1 }}>
                      Max Value
                    </Button>
                  </>
                )}
              </Box>
              
              {(config.validations || []).map((rule, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ minWidth: 100 }}>
                    {rule.type}
                  </Typography>
                  
                  {['minLength', 'maxLength', 'min', 'max'].includes(rule.type) && (
                    <TextField
                      size="small"
                      type="number"
                      label="Value"
                      value={rule.value || ''}
                      onChange={(e) => updateValidation(index, { value: Number(e.target.value) })}
                    />
                  )}
                  
                  <TextField
                    size="small"
                    label="Error Message"
                    value={rule.message}
                    onChange={(e) => updateValidation(index, { message: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                  
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeValidation(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigurator;