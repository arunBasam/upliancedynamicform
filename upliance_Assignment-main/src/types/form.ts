export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'min' | 'max';
  value?: number | string;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DerivedFieldConfig {
  parentFields: string[];
  formula: string; // Simple formula like "age = current_year - birth_year"
  description: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
  validations: ValidationRule[];
  options?: SelectOption[]; // For select, radio fields
  isDerived?: boolean;
  derivedConfig?: DerivedFieldConfig;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}