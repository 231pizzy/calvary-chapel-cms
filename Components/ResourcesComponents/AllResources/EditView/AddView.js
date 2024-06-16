'use client'

import BackButton from "@/Components/BackButton/BackButton";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import FormTextField from "@/Components/TextField/TextField";
import ModalMessage from "@/Components/ModalMessage/ModalMessage";
import { postRequestHandler2 } from "@/Components/requestHandler";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import ErrorMessage from "@/Components/ErrorMessage";
import { BibleStudyDynSvg, ChildrenSvgDyn, ConferenceDynSvg, DownloadSvg, MenSvgDyn, NoteSvgDyn, PdfSvg, PulpitDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import DropdownItemsBuilder from "@/Components/DropdownField/DropdownItemsBuilder";
import DropdownField from "@/Components/DropdownField/DropdownField";
import generateFileUrl from "@/utils/getImageUrl";
import RadioList from "@/Components/RadioList/RadioList";
import CheckboxWithoutTextFieldList from "@/Components/Checkbox/CheckboxWithoutTextField";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import SubSectionHeading from "@/Components/subSectionHeading/subSectionHeading";
import Loader from "@/Components/Loader/Loader";
import { bibleData } from "../bible";
import LinearUploadField from "@/Components/LinearUploadFieid/LinearUploadField";
import { urlRegex } from "@/Components/HomePageComponent/EditView/EditView";

export default function AddNewResourceView({ submitEndpoint, returnUrl }) {
    const router = useRouter();
    const params = useSearchParams();

    const [showForm, setShowForm] = useState(false);

    const id = params.get('id');
    const [saving, setSaving] = useState(false);

    const [isDraft, setIsDraft] = useState(false);


    const [initialValues, setInitialValues] = useState({
        date: '', title: '', scripture: '', bookOfScripture: '', chapter: null,
        verse: { start: null, end: null }, serviceType: '', speaker: '', isThereCharacterStudies: false,
        bibleCharacters: [], isThereTopicalStudies: false, topicalStudies: [], video: '', audio: '',
        audioDownload: [], documentDownload: [], conferences: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        date: Yup.string().required('Please set the exact date of this event'),
        title: Yup.string().required('Title is required'),
        scripture: Yup.string().required('Scripture is required'),
        bookOfScripture: Yup.string().required('This field is required'),
        chapter: Yup.number().required('Chapter is required'),
        verse: Yup.object().shape({
            start: Yup.number().required('Please specify the from verse'),
            end: Yup.number().nullable()
        }),
        serviceType: Yup.string().required('Service Type is required'),
        speaker: Yup.string().required('Speaker is required'),
        isThereCharacterStudies: Yup.boolean().nullable(),
        bibleCharacters: Yup.array().when('isThereCharacterStudies', {
            is: value => value,
            then: () => Yup.array()
                .min(1, 'Please choose a Bible character')
                .required('Please choose a Bible character'),
            otherwise: () => Yup.array().notRequired()
        }),
        isThereTopicalStudies: Yup.boolean().nullable(),
        topicalStudies: Yup.array().when('isThereTopicalStudies', {
            is: value => value,
            then: () => Yup.array()
                .min(1, 'Please choose a topic')
                .required('Please choose a topic'),
            otherwise: () => Yup.array().notRequired()
        }),
        conferences: Yup.string().when('serviceType', {
            is: value => value === 'conferences',
            then: () => Yup.string()
                .required('Please choose a conference'),
            otherwise: () => Yup.string().notRequired()
        }),
        video: Yup.string().matches(urlRegex, 'Please enter a valid URL'),
        audio: Yup.string().matches(urlRegex, 'Please enter a valid URL'),
        audioDownload: Yup.array(),
        documentDownload: Yup.array(),
    })

    const [message, setMessage] = useState(null);
    const [saved, setSaved] = useState(false)

    const [allSpeakers, setAllSpeakers] = useState(null)
    const [allBibleCharacter, setAllBibleCharacter] = useState(null);
    const [allTopics, setAllTopics] = useState(null);
    const [allConferences, setAllConferences] = useState(null);

    useEffect(() => {
        //Get all the guest speakers and leaders
        fetch(('/api/data-for-new-resource' + (id ? `?id=${id}` : '')), { method: 'GET' }).then(
            async response => {
                const data = response.status === 200 && await response.json();

                data?.loginRedirect && window.location.replace('/login')
                if (data) {
                    const result = data?.result;

                    setAllSpeakers(result?.speakers?.map(i => {
                        return {
                            value: i?._id, label: i?.name, image: generateFileUrl(i?.image)
                        }
                    }))

                    setAllBibleCharacter(result?.bibleCharacters?.filter(i => i?.name)?.map(i => {
                        return {
                            value: i?._id, label: i?.name,
                        }
                    }))

                    setAllTopics(result?.topics?.map(i => {
                        return {
                            value: i?._id, label: i?.sectionTitle,
                        }
                    }))

                    const conferences = {};

                    result?.conferences?.filter(i => i?.name).forEach(i => {
                        !conferences[i?.sectionTitle] ? (conferences[i?.sectionTitle] = [{ value: i?._id, label: i?.name, parent: i?.sectionTitle }])
                            : conferences[i?.sectionTitle].push({ value: i?._id, label: i?.name, parent: i?.sectionTitle })
                    })

                    setAllConferences(conferences)

                    if (id) {
                        setInitialValues(
                            {
                                ...result?.existingData,
                                audioDownload: result?.existingData?.audioDownload?.length > 0
                                    ? [{ [result?.existingData?.audioDownload]: generateFileUrl(result?.existingData?.audioDownload) }]
                                    : [],
                                documentDownload: result?.existingData?.documentDownload?.length > 0
                                    ? [{ [result?.existingData?.documentDownload]: generateFileUrl(result?.existingData?.documentDownload) }]
                                    : [],
                            })

                        setIsDraft(result?.existingData?.status === 'saved')
                    }

                    setTimeout(() => {
                        setShowForm(true)
                    }, 1000);
                }
            }
        )
    }, [])

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }


    const handleFormSubmit = async (value) => {
        console.log('submit called');
        setMessage(null)
        const body = {
            ...value, bibleCharacters: value?.bibleCharacters && JSON.stringify(value?.bibleCharacters),
            topicalStudies: value?.topicalStudies && JSON.stringify(value?.topicalStudies),
            verse: JSON.stringify(value?.verse), status: isDraft ? 'published' : value?.status,
            audioDownload: value?.audioDownload?.length && getImageFromArray(value?.audioDownload[0])?.file,
            documentDownload: value?.documentDownload?.length && getImageFromArray(value?.documentDownload[0])?.file,
            ...(id ? { id: params.get('id') } : {})
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    setSaved(true)
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else if (body?.error) {
                    message = body.error
                }
                else {
                    console.log('update failed');
                    message = 'Data was not saved'
                }

                setMessage(message)
                setSaving(false)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
                setSaving(false)
            }
        })
    }


    const closeSuccessAlert = () => {
        setSaved(false)
        //  router.replace(returnUrl);
        window.location.replace(returnUrl)
    }

    const handleDropdownSelect = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)
    }

    const handleDropdownSelect2 = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)

        value !== 'conferences' && setTimeout(() => {
            formProps.setFieldValue('conferences', '')
        }, 200)
    }

    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };

    const iconStyle = { height: '20px', width: '20px' }
    const serviceList = [
        { label: `Men's Ministry`, icon: <MenSvgDyn style={iconStyle} />, value: 'men-service' },
        { label: `Women's Ministry`, icon: <WomenSvgDyn style={iconStyle} />, value: 'women-service' },
        { label: `Youth's Ministry`, icon: <YouthSvgDyn style={iconStyle} />, value: 'youth-service' },
        { label: `Children's Ministry`, icon: <ChildrenSvgDyn style={iconStyle} />, value: 'children-service' },
        { label: 'Wednesday Service', icon: <BibleStudyDynSvg style={iconStyle} />, value: 'wednesday-service' },
        { label: 'Sunday Service', icon: <PulpitDynSvg style={iconStyle} />, value: 'sunday-service' },
        { label: 'Conferences', icon: <ConferenceDynSvg style={iconStyle} />, value: 'conferences' },
    ];

    const yesNoItems = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ]

    const testaments = [
        { value: 'new testament', label: 'New Testament' },
        { value: 'old testament', label: 'Old Testament' },
    ]

    const createDraft = async (formProps) => {
        if (formProps.isValid) {
            setSaving(true)
            await handleFormSubmit({ ...formProps.values, draft: true })
        }
    }

    return <Box sx={{ width: '100%' }}>
        <BackButton title={id ? 'Edit Resource' : 'Create New Resource'} />

        {showForm ? <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
            <Box sx={{ maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', mt: 4 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={() => Yup.object(validationSchema)}
                    onSubmit={handleFormSubmit}>
                    {(formProps) => {
                        console.log('form values', formProps.values);

                        return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                                {/* Date */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Date'} />

                                    {/* Textfield */}
                                    <FormTextField type='date' placeholder={''} name='date' />
                                </Box>

                                {/* Title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Resource Title'} name='title' />
                                </Box>

                                {/*Scripture*/}
                                {<Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Scripture'} />

                                    {/* Radio list */}
                                    <RadioList name='scripture' items={testaments} />
                                </Box>}

                                {/* Book of bible */}
                                {formProps.values.scripture && <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Drop down field */}
                                    <DropdownField
                                        items={DropdownItemsBuilder({
                                            capitalize: true,
                                            items: Object.keys(bibleData[formProps.values.scripture])?.map(i => {
                                                return { value: i, label: i }
                                            })
                                        })}
                                        handleChange={(value) => { handleDropdownSelect(value, 'bookOfScripture', formProps) }}
                                        placeholder={'Book'} formProps={formProps} name='bookOfScripture'
                                        selectedItem={formProps.values.bookOfScripture}
                                    />
                                </Box>}

                                {/* Chapter and verse */}
                                {formProps.values.scripture && formProps.values.bookOfScripture && <Box sx={{ mb: 2, width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                                    {/* Chapter */}
                                    <Box sx={{ mb: 2, width: 'max-content', mr: 3 }}>
                                        {/* Label */}
                                        <FieldLabel label={'Chapter'} />

                                        {/* Textfield */}
                                        <FormTextField min={1} noValidation={true} type={'number'} small={true} placeholder={''} name='chapter' />

                                        {formProps.errors?.chapter ? (
                                            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{formProps.errors?.chapter}</Typography>
                                        ) : null}
                                    </Box>

                                    {/* Verse */}
                                    <Box sx={{ mb: 2, width: 'max-content' }}>
                                        {/* Label */}
                                        <Box sx={{ ml: 6 }}>
                                            <FieldLabel label={'Verse'} />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: 'max-content' }}>
                                            {/* Start verse*/}
                                            <Typography sx={{ fontSize: 14, ml: -2, mr: 4, mt: 1 }}>
                                                From
                                            </Typography>

                                            <FormTextField min={1} noValidation={true} type={'number'} small={true} placeholder={''} name='verse.start' />

                                            <Typography sx={{ fontSize: 14, mx: 2, mt: 1 }}>
                                                To
                                            </Typography>

                                            {/* End verse*/}
                                            <FormTextField min={1} noValidation={true} type={'number'} small={true} placeholder={''} name='verse.end' />
                                        </Box>

                                        {formProps.errors?.verse?.start ? (
                                            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{formProps.errors?.verse?.start}</Typography>
                                        ) : null}
                                    </Box>
                                </Box>}

                                {/* Service type */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Service Type'} />

                                    {/* Drop down field */}
                                    <DropdownField
                                        items={DropdownItemsBuilder({ items: serviceList })}
                                        handleChange={(value) => { handleDropdownSelect2(value, 'serviceType', formProps) }}
                                        placeholder={'Type of Service'} formProps={formProps} name='serviceType'
                                        selectedItem={formProps.values.serviceType}
                                    />
                                </Box>

                                {/* Conferences */}
                                {formProps.values.serviceType === 'conferences' && <Box sx={{
                                    mb: 2, width: '100%', border: '1px solid #1414171A',
                                    boxShadow: '0px 8px 16px 0px #0000000F',
                                }}>
                                    {/* Heading */}
                                    <Typography sx={{
                                        textTransform: 'uppercase', color: 'primary.main', fontSize: 14,
                                        textAlign: 'center', width: '100%', py: 1, mb: 1, fontWeight: 600
                                    }}>
                                        Select a conference
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {Object.keys(allConferences).map((item, index) => {
                                            return <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography sx={{
                                                    maxWidth: '100%', mb: 1, textTransform: 'uppercase',
                                                    bgcolor: '#F5F5F5', px: 2, py: 1, fontSize: 13, fontWeight: 600
                                                }}>
                                                    {item}
                                                </Typography>

                                                <Box sx={{ px: 2, py: .5 }}>
                                                    <RadioList wrap={true}
                                                        name='conferences'
                                                        items={allConferences[item]}
                                                    />
                                                </Box>
                                            </Box>
                                        })}
                                    </Box>
                                </Box>}

                                {/* Speaker */}
                                {<Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Speakers'} />

                                    {/* Drop down field */}
                                    <DropdownField
                                        items={DropdownItemsBuilder({ items: allSpeakers ?? [] })}
                                        handleChange={(value) => { handleDropdownSelect(value, 'speaker', formProps) }}
                                        placeholder={'Speaker'} formProps={formProps} name='speaker'
                                        selectedItem={formProps.values.speaker}
                                    />
                                </Box>}

                                {/* Is there character studies */}
                                {<Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Will there be bible character studies?'} required={false} />

                                    {/* Radio list */}
                                    <RadioList name='isThereCharacterStudies' items={yesNoItems} />
                                </Box>}

                                {/* List of bible characters (if there is character studies) */}
                                {formProps.values.isThereCharacterStudies && <Box sx={{
                                    mb: 2, width: '100%', border: '1px solid #1414171A',
                                    boxShadow: '0px 8px 16px 0px #0000000F',
                                }}>
                                    {/* Heading */}
                                    <Typography sx={{
                                        textTransform: 'uppercase', color: 'primary.main', fontSize: 14,
                                        textAlign: 'center', width: '100%', py: 1, mb: 1, fontWeight: 600
                                    }}>
                                        Select a bible character
                                    </Typography>

                                    <CheckboxWithoutTextFieldList name='bibleCharacters' items={allBibleCharacter ?? []}
                                        valueKey={'value'}
                                    />
                                </Box>}

                                {/* Is there topical studies */}
                                {<Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Will there be topical studies?'} required={false} />
                                    {/* Radio list */}
                                    <RadioList name='isThereTopicalStudies' items={yesNoItems} />
                                </Box>}

                                {/* List of topics (if there is topical studies)*/}
                                {formProps.values.isThereTopicalStudies && <Box sx={{
                                    mb: 2, width: '100%', border: '1px solid #1414171A',
                                    boxShadow: '0px 8px 16px 0px #0000000F',
                                }}>
                                    {/* Heading */}
                                    <Typography sx={{
                                        textTransform: 'uppercase', color: 'primary.main', fontSize: 14,
                                        textAlign: 'center', width: '100%', py: 1, mb: 1, fontWeight: 600
                                    }}>
                                        Topical Studies
                                    </Typography>

                                    <CheckboxWithoutTextFieldList name='topicalStudies' items={allTopics ?? []}
                                        valueKey={'value'}
                                    />
                                </Box>}

                                {/* Video Resource */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Video Resource'} required={false} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Eg. https://youtube.com/some-video'} name='video' />
                                </Box>

                                {/* Audio Resource */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Audio Resource'} required={false} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Eg. https://soundcloud.com/some-audio'} name='audio' />
                                </Box>

                                {/* Audio upload */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Audio Download'} required={false} />

                                    {/* Linear upload field */}
                                    <LinearUploadField icon={<DownloadSvg />}
                                        accept={['.mp3', '.wav', '.ogg', '.pcm', '.mp4', '.aac', '.aiff', '.alac', '.m4a', '.dsd', '.flac']}
                                        handleChange={(file) => {
                                            handleFileUpload(file, formProps, 'audioDownload')
                                        }} placeholder={formProps.values.audioDownload[0] ? '1 audio file uploaded' : 'Upload Audio File'}
                                        name='audioDownload'
                                    />
                                </Box>

                                {/* Document upload */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Document Download'} required={false} />

                                    {/* Linear upload field */}
                                    <LinearUploadField icon={<NoteSvgDyn />}
                                        accept={['.doc', '.pdf', '.docx', '.xls', '.xlsx', '.csv', '.csvx', '.txt', '.ppt', '.pptx']}
                                        handleChange={(file) => {
                                            handleFileUpload(file, formProps, 'documentDownload')
                                        }} placeholder={formProps.values.documentDownload[0] ? '1 document file uploaded' : 'Upload Document'} name='documentDownload' />
                                </Box>

                                {/* UI Message */}
                                {message && <ErrorMessage message={message} />}

                                {/* Publish button */}
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', mt: 4,
                                    justifyContent: 'center', maxWidth: '100%'
                                }}>
                                    {/* !isDraft && */ (isDraft || !id) && <Button variant="outlined" disabled={!formProps.isValid || saving} onClick={async () => { await createDraft(formProps) }}
                                        sx={{ borderRadius: '24px', mr: 4 }}>
                                        {saving ? <CircularProgress id='loginSubmit' size={20}
                                            sx={{ mr: 2, color: '#08e8de' }} /> : isDraft ? 'Save' : 'Save (Not Published)'}
                                    </Button>}

                                    {<SubmitButton disabled={!formProps.isValid} fullWidth={false}
                                        marginTop={0} label={isDraft ? 'Publish' : id ? 'Save' : 'Publish'} formProps={formProps}
                                    />}
                                </Box>

                            </Box>
                        </Form>)
                    }
                    }
                </Formik>
            </Box>

        </Box> : <Loader />}


        {saved && <ModalMessage
            title={id ? 'Resource Updated' : 'Resource Created'} open={saved} handleCancel={closeSuccessAlert} type='success'
            message={`You have just ${id ? 'updated this' : 'created a new'} resource`} />}

    </Box >
}