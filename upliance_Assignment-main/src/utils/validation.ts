import { FormField, ValidationRule, ValidationError, FormData } from '../types/form';

export const validateField = (field: FormField, value: any, allData: FormData): string | null => {
  // Check if field is required
  if (field.required && (value === null || value === undefined || value === '')) {
    return `${field.label} is required`;
  }

  // If field is empty and not required, skip other validations
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Apply validation rules
  for (const rule of field.validations) {
    const error = applyValidationRule(rule, value, field.label);
    if (error) return error;
  }

  return null;
};

const applyValidationRule = (rule: ValidationRule, value: any, fieldLabel: string): string | null => {
  switch (rule.type) {
    case 'required':
      return value === null || value === undefined || value === '' ? rule.message : null;
    
    case 'minLength':
      return typeof value === 'string' && value.length < (rule.value as number) ? rule.message : null;
    
    case 'maxLength':
      return typeof value === 'string' && value.length > (rule.value as number) ? rule.message : null;
    
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && !emailRegex.test(value) ? rule.message : null;
    
    case 'password':
      const hasNumber = /\d/.test(value);
      const minLength = value.length >= 8;
      return !(hasNumber && minLength) ? rule.message : null;
    
    case 'min':
      return typeof value === 'number' && value < (rule.value as number) ? rule.message : null;
    
    case 'max':
      return typeof value === 'number' && value > (rule.value as number) ? rule.message : null;
    
    default:
      return null;
  }
};

export const validateForm = (fields: FormField[], formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  fields.forEach(field => {
    const error = validateField(field, formData[field.id], formData);
    if (error) {
      errors.push({ fieldId: field.id, message: error });
    }
  });
  
  return errors;
};