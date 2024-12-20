import { FormControl, FormHelperText, SxProps, Theme, Typography } from '@mui/material';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import {UploadFile} from '@mui/icons-material';

interface Props extends UseControllerProps<FieldValues, any>{};

export default function AppDropzone (props : Props) {
// react-hook-form
const {field, fieldState} = useController({ ...props, defaultValue : null });

// function(s)
const onDrop = useCallback((acceptedFiles : File[]) => {
 acceptedFiles[0] = Object.assign(acceptedFiles[0], { previewUrl : URL.createObjectURL(acceptedFiles[0])});
 field.onChange(acceptedFiles[0]);
}, [field]);

// react-dropzone
const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

// style(s)
const dzStyles : SxProps<Theme> = {
 display : 'flex',
 justifyContent : 'center',
 alignItems : 'center',
 border : '3px dashed #eee',
 borderColor : '#eee',
 backgroundColor : 'rgba(137, 196, 244, 0.1)',
 borderRadius : 10,
 paddingTop : 4,
 width : 400,
 height : 250,
 cursor : 'pointer'
};

const dzActive : SxProps<Theme> = {
 borderColor : 'green',
};

  return (
    <div {...getRootProps()}>
      <FormControl error = {!!fieldState.error} 
       sx = {isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
        <input {...getInputProps()} />
          <UploadFile fontSize = {'large'} color = {'success'} />
          <Typography variant = {'h6'} fontWeight = {500}>{'Drop Product Image Here.'}</Typography>
          <Typography variant = {'subtitle1'} fontWeight = {400}>{'Files Supported : JPG, JPEG & PNG'}</Typography>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  )
}