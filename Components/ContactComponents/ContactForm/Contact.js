'use client'

import { Box, Button, CircularProgress, OutlinedInput, Typography, useTheme } from "@mui/material";
import { ContactSvg } from "@/public/icons/icons";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Heading from "@/Components/AboutComponents/Heading";
import Dropdown from "@/Components/DropdownField/Dropdown";
import Label from "@/Components/Label/Label";

export default function ContactComponent({ details, topics, disabled, maxWidth = { xs: '80%', lg: '50%' } }) {
    const formik = useFormik({
        initialValues: { firstName: '', lastName: '', email: '', message: '', topic: '' },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().required('Required'),
            message: Yup.string().required('Required'),
            topic: Yup.string().required('Required'),
        }),
        onSubmit: async value => {
            /* const body = {
                firstName: value?.firstName, lastName: value?.lastName,
                email: value?.email, message: value?.message,
            } */
            console.log('submitting', value);
        }
    })

    const textField = ({ id, type, placeholder, multiline, fullWidth, style = {} }) => {
        return <Box sx={{ mb: 4, width: '100%' }}>
            <OutlinedInput fullWidth variant="outlined" id={id}
                placeholder={`${placeholder} *`} type={type} sx={{
                    fontSize: 14, bgcolor: '#FBFBFB',
                    fontWeight: 500, borderRadius: '8px', ...style
                }}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values[id]} multiline={multiline} rows={5}
            />
            {formik.touched[id] && formik.errors[id] ? (
                <Typography sx={{ fontSize: 12, color: 'red' }}>{formik.errors[id]}</Typography>
            ) : null}
        </Box>
    }

    const handleTopicChange = (value) => {
        formik.setFieldValue('topic', value);
    }

    const Renderer = ({ value }) => {
        return <Typography sx={{ fontSize: 13, pl: 1, py: 1.5 }}>
            {value}
        </Typography>
    }


    return <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', border: '3px solid #E6F1FF',
        maxWidth: maxWidth, mx: 'auto', my: { xs: 4, md: 6 }, borderRadius: '16px',
        boxShadow: '0px 8px 16px 0px #0000000F', justifyContent: 'center', py: { xs: 2, md: 2 }, px: { xs: 2, md: 4, lg: 6 }
    }}>
        <Heading icon={<ContactSvg style={{ height: '23px', width: '23px' }} />} title='Contact' color='primary.main' />

        <Typography sx={{
            fontSize: { xs: 14, md: 14 }, fontWeight: 400, color: 'text.secondary', whiteSpace: 'break-spaces', textAlign: 'center',
            maxWidth: { xs: '90%', md: '80%', lg: '100%' }, mx: 'auto',
        }}>
            {details}
        </Typography>

        <Box sx={{
            display: 'flex', alignItems: 'center', my: 4, width: '100%', justifyContent: 'center', flexWrap: 'wrap'
        }}>
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <Label label={'Optional'} color={'#0E60BF'} />
                <Box sx={{ mb: 2 }}>
                    <Dropdown items={topics?.map(i => {
                        return { value: i?._id, component: <Renderer value={i?.title} /> }
                    })}
                        placeholder={'Select a prayer request topic'}
                        selectedItem={formik.values.topic}
                        handleChange={handleTopicChange}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' }, justifyContent: 'space-between', }}>
                    {textField({
                        id: 'firstName', type: 'text', placeholder: 'Firstname', fullWidth: true,
                        style: { maxWidth: '90%' }
                    })}
                    <Box sx={{ flexGrow: 1 }} />
                    {textField({ id: 'lastName', type: 'text', placeholder: 'Lastname', fullWidth: true })}
                </Box>

                {textField({ id: 'email', type: 'email', placeholder: 'email', fullWidth: true })}

                {textField({ id: 'message', type: 'text', placeholder: 'Your Message', fullWidth: true, multiline: true })}

                <Box sx={{ textAlign: 'center' }}>
                    <Button type="submit" variant="contained" disabled={disabled || formik.isSubmitting} sx={{
                        color: 'white', px: 3, py: 1, mt: 2, borderRadius: '32px',
                        fontSize: 14, fontWeight: 600
                    }}>
                        {formik.isSubmitting && <CircularProgress id='formSubmit' size={20}
                            sx={{ mr: 2, color: '#08e8de' }} />}
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    </Box>
}