import { FormField, FormData } from '../types/form';

export const calculateDerivedField = (field: FormField, formData: FormData): any => {
  if (!field.isDerived || !field.derivedConfig) return '';
  
  const { parentFields, formula } = field.derivedConfig;
  
  // Simple formula evaluation for age calculation
  if (formula.includes('age') && formula.includes('current_year') && formula.includes('birth_year')) {
    const birthDateField = parentFields[0];
    const birthDate = formData[birthDateField];
    
    if (birthDate) {
      const birthYear = new Date(birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    }
  }
  
  // Simple concatenation formula
  if (formula.includes('concat')) {
    const values = parentFields.map(fieldId => formData[fieldId] || '').filter(v => v);
    return values.join(' ');
  }
  
  // Simple sum formula
  if (formula.includes('sum')) {
    const values = parentFields.map(fieldId => {
      const val = formData[fieldId];
      return typeof val === 'number' ? val : (parseFloat(val) || 0);
    });
    return values.reduce((sum, val) => sum + val, 0);
  }
  
  return '';
};

export const updateDerivedFields = (fields: FormField[], formData: FormData): FormData => {
  const updatedData = { ...formData };
  
  fields.filter(field => field.isDerived).forEach(field => {
    updatedData[field.id] = calculateDerivedField(field, formData);
  });
  
  return updatedData;
};