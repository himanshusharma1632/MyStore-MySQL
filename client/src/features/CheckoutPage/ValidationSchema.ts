import * as yup from "yup";

export const validationSchema = [
    yup.object({
        fullName : yup.string().required('Your Full Name is a mandatory field'),
        address1 : yup.string().required('Cannot leave address as empty'),
        address2 : yup.string().required(),
        city : yup.string().required('Please mention your city'),
        state : yup.string().required('Please mention your state'),
        zipCode : yup.string().required('Please mention your Zip Code'),
        country : yup.string().required('Cannot leave country as empty')
    }),
    yup.object(),
    yup.object({
        cardHolderName : yup.string().required('Please enter your name here')
    })
]