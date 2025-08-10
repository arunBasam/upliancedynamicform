import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from '@mui/material';
import {
  TextFields,
  Numbers,
  Subject,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  DateRange,
} from '@mui/icons-material';

interface FieldTypeSelectorProps {
  onSelectFieldType: (type: string) => void;
}

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelectFieldType }) => {
  const fieldTypes = [
    { type: 'text', label: 'Text', icon: <TextFields /> },
    { type: 'number', label: 'Number', icon: <Numbers /> },
    { type: 'textarea', label: 'Textarea', icon: <Subject /> },
    { type: 'select', label: 'Select', icon: <ArrowDropDown /> },
    { type: 'radio', label: 'Radio', icon: <RadioButtonChecked /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckBox /> },
    { type: 'date', label: 'Date', icon: <DateRange /> },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add New Field
        </Typography>
        <Grid container spacing={2}>
          {fieldTypes.map((fieldType) => (
            <Grid item xs={12} sm={6} md={3} key={fieldType.type}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={fieldType.icon}
                onClick={() => onSelectFieldType(fieldType.type)}
                sx={{
                  py: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '80px',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <Box sx={{ fontSize: '1rem' }}>{fieldType.label}</Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FieldTypeSelector;