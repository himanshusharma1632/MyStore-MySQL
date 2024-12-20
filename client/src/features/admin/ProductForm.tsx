import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { Product } from '../../app/models/product';
import { LoadingButton } from '@mui/lab';
import AppTextField from '../../app/components/AppTextField';
import { FieldValues, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useProducts from '../../app/hooks/useProducts';
import AppSelectList from '../../app/components/AppSelectList';
import AppDropzone from '../../app/components/AppDropzone';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './productValidation';
import { useAppDispatch } from '../../app/REDUX/configureStore';
import agent from '../../app/api/agent';
import { setProduct } from '../catalog/catalogSlice';

interface Props {
 product?: Product;
 cancelEdit: () => void;
};

export default function ProductForm({ product, cancelEdit }: Props) {
 const { control, reset, watch, handleSubmit, 
         formState : { isDirty, isSubmitting, isValid }} = useForm<FieldValues>({ 
           mode : 'all', resolver : yupResolver(validationSchema) });

 const { brandList, typeList } = useProducts();
 const watchFile = watch('file', null);
 const dispatch = useAppDispatch();

 useEffect(() => {
     if (product && !watchFile && !isDirty) reset(product);
     return () => { if (watchFile) URL.revokeObjectURL(watchFile.preview); }
 }, [product, reset, watchFile, isDirty]);

 // function(s)
 async function SubmitProduct (data : FieldValues) {
  let response : Product;
  try { if (product) { response = await agent.Admin.updateProduct(data);
                       console.log(product, ': editable product'); }
        else { response = await agent.Admin.createProduct(data); }
        dispatch(setProduct(response)); 
        cancelEdit();
      } catch (error : any) { console.log(error); }};

 return (
     <Box component={Paper} sx={{ p: 4, mt: 10 }}>
         <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
             Product Details
         </Typography>
         <form onSubmit={handleSubmit(SubmitProduct)}>
             <Grid container spacing={3}>
                 <Grid item xs={12} sm={12}>
                     <AppTextField control={control} name='name' label='Product Name' fullWidth />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                     <AppSelectList control={control} name='brand' label='Product Brand' items = {brandList} />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                     <AppSelectList control={control} name='typeofProduct' label='Product Type' items = {typeList} />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                     <AppTextField control={control} name='price' label='Price' type = {'number'} fullWidth />
                 </Grid>
                 <Grid item xs={12} sm = {6}>
                     <AppTextField control={control} name='quantityInStock' 
                      label='Quantity in Stock' type = {'number'} fullWidth />
                 </Grid>
                 <Grid item xs={12}>
                     <AppTextField control={control} name='description' 
                      label='Product Description' multiline rows = {5} fullWidth />
                 </Grid>
                 <Grid item xs={12}>
                  <Box display = {'flex'} justifyContent = {'space-between'} alignItems = {'center'}> 
                     <AppDropzone control={control} name='file' /> 
                     {watchFile ? (<img src = {watchFile.previewUrl} alt = {'preview file'} 
                                    style = {{ maxHeight : 200 }} />)
                      : (<img src = {product?.pictureUrl} alt = {product?.name} 
                          style = {{ maxHeight : 200 }} /> )} 
                  </Box>
                 </Grid>
             </Grid>
             <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                 <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                 <LoadingButton
                     loading={isSubmitting}
                     disabled = {!isValid || !isDirty}
                     type='submit'
                     variant='contained'
                     color='success'>Create Product</LoadingButton>
             </Box>
         </form>
     </Box>
 )
}