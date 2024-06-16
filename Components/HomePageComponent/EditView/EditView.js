'use client'

import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import FileUpload from "@/Components/FileUpload/FileUpload";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import FormTextArea from "@/Components/TextArea/TextArea";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import Preview from "./Preview";
import generateFileUrl from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";
import CheckBoxList from "@/Components/Checkbox/Checkbox";
import DropdownField from "@/Components/DropdownField/DropdownField";
import { BibleDynSvg, BibleStudyDynSvg, CancelSvg, CharacterStudiesDynSvg, ChildrenSvgDyn, ConferenceDynSvg, ContactSvg, FaithSvgDyn, GuestSpeakerDynSvg, HomePageSvg, LeadershipSvgDyn, MenSvgDyn, MinistrySvg, NoteSvgDyn, PulpitDynSvg, ResourceSvg, ScheduleSvg, TopicalStudiesDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import IconUpload from "@/Components/IconUpload/IconUpload";
import ImageUpload from "@/Components/IconUpload/ImageUpload";
import AddNewCard from "./AddNewCard";
import DropdownItemsBuilder from "@/Components/DropdownField/DropdownItemsBuilder";
import Loader from "@/Components/Loader/Loader";

require('dotenv/config')

export const urlRegex = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

export default function EditView({ ministry, submitEndpoint, returnUrl, pageName = 'homepage' }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '', services: [], navigation: [
            { order: 1, title: '', details: '', logo: [], link: '', type: 'internal' }
        ],
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),

        services: Yup.array().of(Yup.object().shape({
            id: Yup.string().required('This field is required'),
            startTime: Yup.string().required('Please set the starting time of the service')
        })).min(1, 'Service is required').required('Please select at least one service'),

        navigation: Yup.array().of(Yup.object().shape({
            title: Yup.string().when('type', {
                is: value => value && (value !== 'imageCard'),
                then: () => Yup.string().required('Title is required'),
                otherwise: () => Yup.string().notRequired()
            }),
            details: Yup.string(),
            logo: Yup.array().nullable(),

            link: Yup.string()/* .when('type', { is: 'external', then: Yup.string().url('A valid URL is required') }) */.required('Please select the page to navigate to'),
            type: Yup.string().default('internal'),
            order: Yup.number()
        })),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showCardTypes, setShowCardTypes] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const services = [
        { value: 'sunday_service', label: 'Sunday Service' },
        { value: 'wednesday_service', label: 'Wednesday Service' },
        { value: 'conference', label: 'Conference' },
        { value: 'men_ministry', label: "Men's Ministry" },
        { value: 'Women_ministry', label: "Women's Ministry" },
        { value: 'youth_ministry', label: "Youth's Ministry" },
        { value: 'children_minstry', label: "Children's Ministry" },
    ]


    useEffect(() => {
        getRequestHandler({
            route: `/api/homepage`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                        navigation: result?.navigation?.map(i => {
                            return {
                                ...i, logo: i?.logo && [{ [i.logo]: i.logo }]
                            }
                        })
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

    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };

    const handleShowPreview = (formProps) => {
        console.log('form values', formProps?.values)
        setShowPreview(true)
    }

    const handleClosePreview = () => {
        setShowPreview(false)
    }

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }

    const buildFilePayload = (values) => {
        //Email address of the leaders will be used to identify their image
        const fileObject = {};
        values?.forEach((item, index) => item?.logo?.length && (fileObject[item?.order] = getImageFromArray(item?.logo[0])?.file))

        return fileObject
    }


    const handleFormSubmit = async (value) => {
        const body = {
            ...value, banner: getImageFromArray(value?.banner[0])?.file,
            services: JSON.stringify(value?.services), pageName,
            navigation: JSON.stringify(value?.navigation),
            ...buildFilePayload(value?.navigation), pageName,
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    router.replace('/');
                    message = 'Home page updated'
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else {
                    console.log('update failed');
                    message = 'Update failed'
                }
                handleClosePreview();
                router.replace(returnUrl)

                setMessage(message)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
            }
        })
    }

    const handleDropdownSelect = (value, index, fieldId, formProps) => {
        const copy = formProps.values[fieldId];
        copy[index] = { ...copy[index], link: value }
        formProps.setFieldValue(fieldId, copy)
    }

    const iconStyle = { height: '20px', width: '20px' }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const pages = [
        { label: 'Home', icon: <HomePageSvg style={iconStyle} />, link: `${siteUrl}` },
        { label: 'Ministry', icon: <MinistrySvg style={iconStyle} />, link: `${siteUrl}/ministry` },
        { label: `Men's Ministry`, icon: <MenSvgDyn style={iconStyle} />, link: `${siteUrl}/ministry?ministry=men-service` },
        { label: `Women's Ministry`, icon: <WomenSvgDyn style={iconStyle} />, link: `${siteUrl}/ministry?ministry=women-service` },
        { label: `Youth's Ministry`, icon: <YouthSvgDyn style={iconStyle} />, link: `${siteUrl}/ministry?ministry=youth-service` },
        { label: `Children's Ministry`, icon: <ChildrenSvgDyn style={iconStyle} />, link: `${siteUrl}/ministry?ministry=children-service` },
        { label: 'Resources', icon: <ResourceSvg style={iconStyle} />, link: `${siteUrl}/resources` },
        { label: 'Verse by verse', icon: <BibleDynSvg style={iconStyle} />, link: `${siteUrl}/resources/verse-by-verse` },
        { label: 'Wednesday Service', icon: <BibleStudyDynSvg style={iconStyle} />, link: `${siteUrl}/resources/wednesday-service` },
        { label: 'Sunday Service', icon: <PulpitDynSvg style={iconStyle} />, link: `${siteUrl}/resources/sunday-service` },
        { label: 'Guest Speakers', icon: <GuestSpeakerDynSvg style={iconStyle} />, link: `${siteUrl}/resources/guest-speakers` },
        { label: 'Character Studies', icon: <CharacterStudiesDynSvg style={iconStyle} />, link: `${siteUrl}/resources/character-studies` },
        { label: 'Topical Studies', icon: <TopicalStudiesDynSvg style={iconStyle} />, link: `${siteUrl}/resources/topical-studies` },
        { label: 'Conferences', icon: <ConferenceDynSvg style={iconStyle} />, link: `${siteUrl}/resources/conferences` },
        { label: 'Schedule', icon: <ScheduleSvg style={iconStyle} />, link: `${siteUrl}/resources/schedule` },
        { label: 'History of CCT', icon: <NoteSvgDyn style={iconStyle} />, link: `${siteUrl}/about?view=history` },
        { label: 'Statement of Faith', icon: <FaithSvgDyn style={iconStyle} />, link: `${siteUrl}/about?view=statement-of-faith` },
        { label: 'Leadership', icon: <LeadershipSvgDyn style={iconStyle} />, link: `${siteUrl}/about?view=leadership` },
        { label: 'Contact', icon: <ContactSvg style={iconStyle} />, link: `${siteUrl}/contact` },
    ];

    const removeCard = (fieldId, formProps, order) => {
        formProps.setFieldValue('navigation', formProps.values['navigation']?.filter(i => i?.order !== order))
    }

    const addCard = (fieldId, formProps,) => {
        //Get the highest order and add 1 to it to get the order of this new entry 
        const highestOrder = Math.max(...([...(formProps.values['navigation'] ?? [])]?.map(i => Number(i?.order))))
        console.log('order', { highestOrder })
        const copy = formProps.values['navigation'];

        copy.push({ uuid: 1, title: '', details: '', link: '', logo: [], type: fieldId === 'internalNavigation' ? 'internal' : fieldId === 'externalNavigation' ? 'external' : 'imageCard', order: highestOrder + 1 })

        formProps.setFieldValue('navigation', copy)
    }

    return <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
        maxWidth: { xs: '95%', lg: '90%' }, py: { xs: 1, md: 2, lg: 3 }, mx: 'auto'
    }}>
        {showForm ? <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => {
                console.log('prop values', formProps.values);
                const navigations = ([...(formProps.values?.navigation ?? [])]).sort((a, b) => a?.order - b?.order)

                console.log('navigations', { navigations, errors: Object.values(formProps.errors) });

                return (
                    <Form style={{ width: '100%', marginBottom: '36px' }}>
                        {/* Hero Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            {/* Section header */}
                            <SectionHeading label={'hero section'} />

                            {/* Image upload */}
                            <Box sx={{ mb: 2 }}>
                                {/* label */}
                                <FieldLabel label={'Upload hero image here'} />
                                {/* File upload Field */}
                                <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'banner') }}
                                    fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} height={'15vw'} width='100%'
                                    multiple={false} fileArray={formProps?.values?.banner}
                                    error={(formProps.errors?.banner) ? formProps.errors?.banner : null}
                                    accept={{ 'image/*': ['.png', '.gif'], }}
                                    extensionArray={['PNG', 'JPG']}
                                />
                            </Box>

                            {/* Hero Text */}
                            <Box sx={{ mb: 2 }}>
                                {/* Label */}
                                <FieldLabel label={'Hero Text'} />

                                {/* Textfield */}
                                <FormTextField placeholder={'Hero text'} name='heroText' />
                            </Box>

                            {/* Hero subtitle */}
                            <Box sx={{ mb: 2 }}>
                                {/* Label */}
                                <FieldLabel label={'Hero Subtitle'} required={false} />

                                {/* Textfield */}
                                <FormTextArea placeholder={'Subtitle'} name='heroSubtitle' />
                            </Box>
                        </Box>


                        {/* /////////////////////////////////////////////////////////////////////// */}


                        {/* Weekly service section */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 8 }}>
                            {/* Section header */}
                            <SectionHeading label={'weekly services'} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid #1414171A' }}>
                                <CheckBoxList items={services} valueKey={'id'} name='services' />
                            </Box>
                        </Box>


                        {/* /////////////////////////////////////////////////////////////////////// */}

                        {/* Body section */}
                        {/* Section header */}
                        <SectionHeading label={'body section'} />

                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 2, bgcolor: '#F8F8F8' }}>

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
                            }}>{
                                    navigations.map((nav, index) => {
                                        const type = nav?.type;
                                        const actualIndex = index //formProps.values[type === 'internal' ? 'internalNavigation' : 'externalNavigation']?.findIndex(i => i?.uuid === nav?.uuid)
                                        return nav?.type === 'internal'
                                            ? <Box key={index} sx={{ width: '100%', }}>
                                                {/* Card container label */}
                                                <Box sx={{
                                                    width: '100%', bgcolor: '#E8E8E8', border: '1px solid #1414171A', py: 1,
                                                    display: 'flex', alignItems: 'center'
                                                }}>
                                                    <Typography sx={{ px: 2 }}>
                                                        Card - {index + 1}
                                                    </Typography>

                                                    <Box sx={{ flexGrow: 1 }} />

                                                    {index === (navigations?.length - 1) && <AddNewCard showCardTypes={showCardTypes}
                                                        setShowCardTypes={setShowCardTypes}
                                                        addCard={addCard} formProps={formProps}
                                                    />}
                                                    {formProps.values?.navigation?.length > 1 && < CancelSvg style={{ cursor: 'pointer', marginRight: '16px' }}
                                                        onClick={() => { removeCard('internalNavigation', formProps, nav?.order,) }}
                                                    />}
                                                </Box>

                                                <Box sx={{ px: 3, py: 2 }}>
                                                    {/* Title */}
                                                    <Box sx={{ mb: 2, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Body Title'} />

                                                        {/* Textfield */}
                                                        <FormTextField placeholder={'Body Title'} name={`navigation[${actualIndex}].title`} />
                                                    </Box>

                                                    {/* Details */}
                                                    <Box sx={{ mb: 2, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Body Details'} required={false} />

                                                        {/* Textfield */}
                                                        < FormTextArea placeholder={'Body Details'} name={`navigation[${actualIndex}].details`} />
                                                    </Box>

                                                    {/* Navigate to */}
                                                    <Box sx={{ mb: 2, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Navigate To'} />

                                                        {/* Drop down field */}
                                                        <DropdownField
                                                            items={DropdownItemsBuilder({ items: pages })}
                                                            handleChange={(value) => { handleDropdownSelect(value, actualIndex, 'navigation', formProps) }}
                                                            placeholder={'Select the page you want to navigate to when the button is clicked.'}
                                                            selectedItem={formProps.values.navigation[actualIndex].link}
                                                            name={`navigation[${actualIndex}].link`}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            : nav?.type === 'external'
                                                ? <Box key={index} sx={{ width: '100%' }}>
                                                    {/* Card container label */}
                                                    <Box sx={{
                                                        width: '100%', bgcolor: '#E8E8E8', border: '1px solid #1414171A', py: 1,
                                                        display: 'flex', alignItems: 'center'
                                                    }}>
                                                        <Typography sx={{ px: 2 }}>
                                                            Card - {index + 1}
                                                        </Typography>

                                                        <Box sx={{ flexGrow: 1 }} />

                                                        {index === (navigations?.length - 1) && <AddNewCard showCardTypes={showCardTypes}
                                                            setShowCardTypes={setShowCardTypes}
                                                            addCard={addCard} formProps={formProps}
                                                        />}

                                                        {formProps.values?.navigation?.length > 1 && < CancelSvg style={{ cursor: 'pointer', marginRight: '16px' }}
                                                            onClick={() => { removeCard('navigation', formProps, nav?.order,) }}
                                                        />}
                                                    </Box>

                                                    <Box sx={{ px: 3, py: 2 }}>
                                                        {/* Logo */}
                                                        <Box sx={{ minWidth: '150px', mb: 2, maxWidth: '150px' }}>
                                                            {/* Label */}
                                                            <FieldLabel label={'Logo'} required={false} />

                                                            <IconUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `navigation[${actualIndex}].logo`) }}
                                                                fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                                                multiple={false} fileArray={(formProps.values.navigation ?? [])[actualIndex]?.logo}
                                                                error={((formProps.errors.navigation ?? [])[actualIndex]?.logo) ? (formProps.errors.navigation ?? [])[actualIndex]?.logo : null}
                                                                accept={{ 'image/*': ['.png', '.gif'], }}
                                                                extensionArray={['PNG', 'JPG']}
                                                            />
                                                        </Box>

                                                        {/* Title */}
                                                        <Box sx={{ mb: 2, width: '100%' }}>
                                                            {/* Label */}
                                                            <FieldLabel label={'Link Title'} />

                                                            {/* Textfield */}
                                                            <FormTextField placeholder={'Title'} name={`navigation[${actualIndex}].title`} />
                                                        </Box>

                                                        {/* Link */}
                                                        <Box sx={{ mb: 2, width: '100%' }}>
                                                            {/* Label */}
                                                            <FieldLabel label={'Link'} />

                                                            {/* Textfield */}
                                                            <FormTextField placeholder={'https://link.com'} name={`navigation[${actualIndex}].link`} />
                                                        </Box>

                                                    </Box>
                                                </Box>
                                                : <Box key={index} sx={{ width: '100%' }}>
                                                    {/* Card container label */}
                                                    <Box sx={{
                                                        width: '100%', bgcolor: '#E8E8E8', border: '1px solid #1414171A', py: 1,
                                                        display: 'flex', alignItems: 'center'
                                                    }}>
                                                        <Typography sx={{ px: 2 }}>
                                                            Card - {index + 1}
                                                        </Typography>

                                                        <Box sx={{ flexGrow: 1 }} />

                                                        {index === (navigations?.length - 1) && <AddNewCard showCardTypes={showCardTypes}
                                                            setShowCardTypes={setShowCardTypes}
                                                            addCard={addCard} formProps={formProps}
                                                        />}

                                                        {formProps.values?.navigation?.length > 1 && < CancelSvg style={{ cursor: 'pointer', marginRight: '16px' }}
                                                            onClick={() => { removeCard('navigation', formProps, nav?.order,) }}
                                                        />}
                                                    </Box>

                                                    <Box sx={{ px: 3, py: 2 }}>
                                                        {/* Logo */}
                                                        <Box sx={{ minWidth: '150px', mb: 2, maxWidth: '150px' }}>
                                                            {/* Label */}
                                                            <FieldLabel label={'Upload Image'} />

                                                            <ImageUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `navigation[${actualIndex}].logo`) }}
                                                                fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                                                multiple={false} fileArray={(formProps.values.navigation ?? [])[actualIndex]?.logo}
                                                                error={((formProps.errors.navigation ?? [])[actualIndex]?.logo) ? (formProps.errors.navigation ?? [])[actualIndex]?.logo : null}
                                                                accept={{ 'image/*': ['.png', '.gif'], }}
                                                                extensionArray={['PNG', 'JPG']}
                                                            />
                                                        </Box>

                                                        {/* Link */}
                                                        <Box sx={{ mb: 2, width: '100%' }}>
                                                            {/* Label */}
                                                            <FieldLabel label={'Link'} />

                                                            {/* Textfield */}
                                                            <FormTextField placeholder={'https://link.com'} name={`navigation[${actualIndex}].link`} />
                                                        </Box>

                                                    </Box>
                                                </Box>
                                    })
                                }

                            </Box>

                            {/* Add New section Button */}

                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                            <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                sx={{ width: '60%', borderRadius: '24px', py: 1 }}
                                disabled={!formProps.isValid}>
                                Preview
                            </Button>

                        </Box>

                        {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                            formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                    </Form>
                )
            }}
        </Formik>
            : <Loader />}
    </Box >
}