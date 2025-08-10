import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Edit, Delete, DragIndicator, Functions } from '@mui/icons-material';
import { FormField } from '../../types/form';

interface FieldListProps {
  fields: FormField[];
  onEditField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({ fields, onEditField, onDeleteField }) => {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" align="center">
            No fields added yet. Start by selecting a field type above.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Form Fields ({fields.length})
        </Typography>
        
        <List>
          {sortedFields.map((field) => (
            <ListItem key={field.id} divider>
              <DragIndicator sx={{ mr: 1, color: 'text.secondary' }} />
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">{field.label}</Typography>
                    <Chip 
                      label={field.type} 
                      size="small" 
                      variant="outlined" 
                      sx={{ textTransform: 'capitalize' }}
                    />
                    {field.required && (
                      <Chip label="Required" size="small" color="error" />
                    )}
                    {field.isDerived && (
                      <Chip 
                        label="Derived" 
                        size="small" 
                        color="secondary"
                        icon={<Functions />}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    {field.defaultValue && (
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Default: {field.defaultValue}
                      </Typography>
                    )}
                    {field.validations.length > 0 && (
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Validations: {field.validations.map(v => v.type).join(', ')}
                      </Typography>
                    )}
                    {field.isDerived && field.derivedConfig && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'secondary.main' }}>
                        Formula: {field.derivedConfig.formula}
                      </Typography>
                    )}
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <IconButton onClick={() => onEditField(field)} size="small">
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => onDeleteField(field.id)} 
                  size="small" 
                  color="error"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FieldList;