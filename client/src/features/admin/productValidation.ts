import * as yup from "yup";

export const validationSchema = yup.object({
 name: yup.string().required('please enter the product name'),
 description: yup.string().required('please enter the product description'),
 price: yup.number().moreThan(100).required('please enter the price'),
 typeofProduct : yup.string().required('please enter the product-type'),
 brand : yup.string().required('please enter the product-brand'),
 file : yup.mixed().when('pictureUrl', {
   is : (value : string) => !value,
   then : schema => schema.required('please upload a photograph of the product'),
   otherwise : schema => schema.notRequired()
 }),
 quantityInStock : yup.number()
                   .min(0).max(200)
                   .required('please enter the overall quantity available for product')
});