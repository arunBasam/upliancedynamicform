import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FormData, ValidationError } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  previewData: FormData;
  validationErrors: ValidationError[];
  currentPreviewForm: FormSchema | null;
}

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: [],
  previewData: {},
  validationErrors: [],
  currentPreviewForm: null,
};

// Load saved forms from localStorage
const loadSavedForms = (): FormSchema[] => {
  try {
    const saved = localStorage.getItem('formBuilder_savedForms');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save forms to localStorage
const saveForms = (forms: FormSchema[]) => {
  localStorage.setItem('formBuilder_savedForms', JSON.stringify(forms));
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState: {
    ...initialState,
    savedForms: loadSavedForms(),
  },
  reducers: {
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      // Reorder remaining fields
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload.map((field, index) => ({
        ...field,
        order: index,
      }));
    },
    
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    
    saveCurrentForm: (state) => {
      if (state.currentForm.name && state.currentForm.fields.length > 0) {
        const newForm: FormSchema = {
          id: uuidv4(),
          name: state.currentForm.name,
          fields: [...state.currentForm.fields],
          createdAt: new Date().toISOString(),
        };
        state.savedForms.push(newForm);
        saveForms(state.savedForms);
        
        // Reset current form
        state.currentForm = { name: '', fields: [] };
      }
    },
    
    loadFormForPreview: (state, action: PayloadAction<FormSchema>) => {
      state.currentPreviewForm = action.payload;
      state.previewData = {};
      state.validationErrors = [];
    },
    
    updatePreviewData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.previewData[action.payload.fieldId] = action.payload.value;
    },
    
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    
    clearCurrentForm: (state) => {
      state.currentForm = { name: '', fields: [] };
    },
    
    setCurrentFormForEdit: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = {
        name: action.payload.name,
        fields: [...action.payload.fields],
      };
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  setFormName,
  saveCurrentForm,
  loadFormForPreview,
  updatePreviewData,
  setValidationErrors,
  clearCurrentForm,
  setCurrentFormForEdit,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;