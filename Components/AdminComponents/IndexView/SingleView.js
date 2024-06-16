'use client'

import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import EditButton from "@/Components/EditButton/EditButton";
import FormTextField from "@/Components/TextField/TextField";
import { getRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import generateFileUrl from "@/utils/getImageUrl";
import { Avatar, Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FieldValue from "../../FieldValue/FieldValue";
import Edit from "@/Components/BackButtonActions/Edit";
import Delete from "@/Components/BackButtonActions/Delete";

export default function SingleView({ editUrl, submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');

    const [initialValues, setInitialValues] = useState({
        profilePicture: [], fullName: '', email: '',// password: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        profilePicture: Yup.array(),
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string().email('Please enter a valid email address').required('Email address is required'),
        //  password: Yup.string().required('Password is required'),
    })

    const [data, setData] = useState(null)

    const [message, setMessage] = useState(null);

    const [showForm, setShowForm] = useState(false)


    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }

    useEffect(() => {
        getRequestHandler({
            route: `/api/admin-view?id=${id}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setData({
                        ...result,
                        profilePicture: generateFileUrl(result?.profilePicture),
                    })

                    setTimeout(() => {
                        setShowForm(true)
                    }, 2000)
                }
                else {
                    setShowForm(true)
                }
            },
            errorCallback: err => {
                setShowForm(true)
                console.log('Something went wrong', err)
            }
        })
    }, [])


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'View Admin'} components={
            [
                <Edit url={`${editUrl}?id=${id}`} />,
                <Delete
                    returnUrl={`/admin/admin`}
                    id={id}
                    title={'Admin'}
                    deleteEndpoint={'/api/delete-admin'}
                />
            ]
        } />

        {showForm ?
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', px: 2, py: 2, my: 4,
                border: '1px solid #1414171A', borderRadius: '16px', boxShadow: '0px 8px 16px 0px #0000000F'
            }}>

                {/* Profile picture */}
                <Box sx={{
                    mb: 2, width: '95%', p: 2, bgcolor: '#F5F5F5', border: '1px solid #1414171A',
                    borderRadius: '12px'
                }}>
                    <FieldValue color='#0E60BF' label={'Avatar'} />
                    <Avatar
                        src={data?.profilePicture}
                        sx={{ height: '60px', width: '60px' }}
                    />
                </Box>

                {/* Full name */}
                <Box sx={{
                    mb: 2, width: '95%', p: 2, bgcolor: '#F5F5F5', border: '1px solid #1414171A',
                    borderRadius: '12px'
                }}>
                    {/* Label */}
                    <FieldValue color='#0E60BF' label={'Full Name'} />

                    {/* Textfield */}
                    <FieldValue label={data?.fullName} />
                </Box>

                {/* Email address */}
                <Box sx={{
                    width: '95%', p: 2, bgcolor: '#F5F5F5', border: '1px solid #1414171A',
                    borderRadius: '12px'
                }}>
                    {/* Label */}
                    <FieldValue color='#0E60BF' label={'Email Address'} />

                    {/* Textfield */}
                    <FieldValue label={data?.email} />
                </Box>
            </Box> : <Loader />
        }
    </Box >
}