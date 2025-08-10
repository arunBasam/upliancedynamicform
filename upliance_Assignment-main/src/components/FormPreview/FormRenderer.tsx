import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Typography,
  Box,
  FormHelperText,
} from '@mui/material';
import { FormField } from '../../types/form';

interface FormRendererProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  disabled?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  field,
  value,
  error,
  onChange,
  disabled = false,
}) => {
  const commonProps = {
    fullWidth: true,
    margin: 'normal' as const,
    error: !!error,
    helperText: error || (field.derivedConfig?.description && field.isDerived ? field.derivedConfig.description : undefined),
    disabled,
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.defaultValue}
            required={field.required}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.defaultValue}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.defaultValue}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              label={field.label}
              required={field.required}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...commonProps} component="fieldset">
            <Typography variant="body1" component="legend" sx={{ mb: 1 }}>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl {...commonProps} component="fieldset">
            <Typography variant="body1" component="legend" sx={{ mb: 1 }}>
              {field.label} {field.required && '*'}
            </Typography>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option.value)}
                      onChange={(e) => {
                        const currentValue = value || [];
                        if (e.target.checked) {
                          onChange([...currentValue, option.value]);
                        } else {
                          onChange(currentValue.filter((v: string) => v !== option.value));
                        }
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {renderField()}
      {field.isDerived && (
        <Typography variant="caption" color="secondary.main" sx={{ display: 'block', mt: 1 }}>
          Computed field: {field.derivedConfig?.formula}
        </Typography>
      )}
    </Box>
  );
};

export default FormRenderer;