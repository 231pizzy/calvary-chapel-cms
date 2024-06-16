'use client'

import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import BackButton from "@/Components/BackButton/BackButton";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import FormTextField from "@/Components/TextField/TextField";
import ModalMessage from "@/Components/ModalMessage/ModalMessage";
import { postRequestHandler2 } from "@/Components/requestHandler";
import { Box, Button, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FormTextArea from "@/Components/TextArea/TextArea";
import ErrorMessage from "@/Components/ErrorMessage";
import { BibleStudyDynSvg, ChildrenSvgDyn, ConferenceDynSvg, MenSvgDyn, PulpitDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import DropdownItemsBuilder from "@/Components/DropdownField/DropdownItemsBuilder";
import DropdownField from "@/Components/DropdownField/DropdownField";
import generateFileUrl from "@/utils/getImageUrl";
import RadioList from "@/Components/RadioList/RadioList";
import CheckboxWithoutTextFieldList from "@/Components/Checkbox/CheckboxWithoutTextField";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import SubSectionHeading from "@/Components/subSectionHeading/subSectionHeading";
import Loader from "@/Components/Loader/Loader";
import { Close, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import moment from "moment";
import { urlRegex } from "@/Components/HomePageComponent/EditView/EditView";
import { getLocalTime } from "@/utils/getLocalTime";
import Dropdown from "@/Components/DropdownField/Dropdown";

export default function AddNewScheduleView({ submitEndpoint, returnUrl }) {
    const router = useRouter();
    const params = useSearchParams();

    const [showForm, setShowForm] = useState(false);

    const id = params.get('id');


    const [initialValues, setInitialValues] = useState({
        title: '', details: '', location: '', serviceType: '', speaker: '', weeklyRepeatDays: [],
        isThereCharacterStudies: false, bibleCharacters: [], isThereTopicalStudies: false,
        topicalStudies: [], frequency: '', date: '', endDate: '', //time: '', 
        duration: [{ time: '', hours: '', minutes: '' }], conferences: '',
        monthlyRepeatDays: {}, monthlyRepeatType: '', liveLink: ''
        //scheduleBrief: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        title: Yup.string().required('Title is required'),
        details: Yup.string().required('Details is required'),
        location: Yup.string().required('Location is required'),
        serviceType: Yup.string().required('Service Type is required'),
        speaker: Yup.string().required('Speaker is required'),
        isThereCharacterStudies: Yup.boolean().nullable(),
        bibleCharacters: Yup.array().when('isThereCharacterStudies', {
            is: value => value == true,
            then: () => Yup.array()
                .min(1, 'Please choose a Bible character')
                .required('Please choose a Bible character'),
            otherwise: () => Yup.array().min(0).notRequired()
        }),
        isThereTopicalStudies: Yup.boolean().nullable(),
        topicalStudies: Yup.array().when('isThereTopicalStudies', {
            is: value => value == true,
            then: () => Yup.array()
                .min(1, 'Please choose a topic')
                .required('Please choose a topic'),
            otherwise: () => Yup.array().min(0).notRequired()
        }),
        frequency: Yup.string().required('Schedule occurrence type is required'),
        liveLink: Yup.string(),
        endDate: Yup.string().nullable().notRequired(),
        weeklyRepeatDays: Yup.array().when('frequency', {
            is: value => value && value === 'weekly',
            then: () => Yup.array().min(1, 'Please choose the days to repeat this event').required('Please Choose the days to repeat this event'),
            otherwise: () => Yup.array().min(0).notRequired()
        }),
        monthlyRepeatType: Yup.string().when('frequency', {
            is: value => value && value === 'monthly',
            then: () => Yup.string().required('Please choose how this schedule should be repeated'),
            otherwise: () => Yup.string().notRequired()
        }),
        monthlyRepeatDays: Yup.object().shape({
            date: Yup.string().when('monthlyRepeatType', {
                is: value => value && value === 'date',
                then: () => Yup.string().required('Date is required'),
                otherwise: () => Yup.string().notRequired(),
            }),
            day: Yup.string().when('monthlyRepeatType', {
                is: value => value && value === 'day',
                then: () => Yup.string().required('This field is required'),
                otherwise: () => Yup.string().notRequired(),
            }),
            position: Yup.string().when('monthlyRepeatType', {
                is: value => value && value === 'day',
                then: () => Yup.string().required('This field is required'),
                otherwise: () => Yup.string().notRequired(),
            }),
        }),
        date: Yup.string().when('frequency', {
            is: value => value && (value === 'once' || value === 'daily'),
            then: () => Yup.string().required('Please set the date of this event'),
            otherwise: () => Yup.string().notRequired()
        }),
        conferences: Yup.string().when('serviceType', {
            is: value => value === 'conferences',
            then: () => Yup.string()
                .required('Please choose a conference'),
            otherwise: () => Yup.string().notRequired()
        }),
        duration: Yup.array().of(Yup.object().shape({
            time: Yup.string().required('Please set the time of this event'),
            hours: Yup.number().test({
                name: 'hours',
                exclusive: true,
                message: 'Hours is required',
                test: (value, context) => {
                    return value || context.parent.minutes
                }
            }),
            minutes: Yup.number().test({
                name: 'minutes',
                exclusive: true,
                message: 'Minutes is required',
                test: (value, context) => {
                    return value || context.parent.hours
                }
            }),
        })),
    })

    const [message, setMessage] = useState(null);
    const [saved, setSaved] = useState(false)

    const [allSpeakers, setAllSpeakers] = useState(null)
    const [allBibleCharacter, setAllBibleCharacter] = useState(null);
    const [allTopics, setAllTopics] = useState(null);
    const [locations, setLocations] = useState(null);
    const [liveLinks, setLiveLinks] = useState(null);
    const [allConferences, setAllConferences] = useState(null);

    useEffect(() => {
        //Get all the guest speakers and leaders
        fetch(('/api/data-for-new-schedule' + (id ? `?id=${id}` : '')), { method: 'GET' }).then(
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

                    setLocations(result?.locations)

                    setLiveLinks(result?.liveLinks)

                    const conferences = {};

                    result?.conferences?.filter(i => i?.name).forEach(i => {
                        !conferences[i?.sectionTitle] ? (conferences[i?.sectionTitle] = [{ value: i?._id, label: i?.name, parent: i?.sectionTitle }])
                            : conferences[i?.sectionTitle].push({ value: i?._id, label: i?.name, parent: i?.sectionTitle })
                    })

                    setAllConferences(conferences)

                    if (id) {
                        setInitialValues({
                            ...(result?.existingData ?? {}),
                            monthlyRepeatDays: result?.existingData?.monthlyRepeatDays ?? {},
                            duration: [{
                                ...result?.existingData?.duration,
                                time: getLocalTime({
                                    date: result?.existingData?.date,
                                    time: result?.existingData?.duration?.time,
                                    type: 'time'
                                })
                            }]
                        })
                    }

                    setTimeout(() => {
                        setShowForm(true)
                    }, 1000);
                }
            }
        )
    }, [])

    const handleFormSubmit = async (value) => {
        console.log('submit called');
        setMessage(null)
        const body = {
            ...value, bibleCharacters: value?.bibleCharacters && JSON.stringify(value?.bibleCharacters),
            topicalStudies: value?.topicalStudies && JSON.stringify(value?.topicalStudies),
            duration: JSON.stringify(value?.duration), monthlyRepeatDays: JSON.stringify(value?.monthlyRepeatDays),
            weeklyRepeatDays: JSON.stringify(value?.weeklyRepeatDays),
            endDate: value?.endDate || moment().format(`yyyy-${12}-${31}`).toString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
            }
        })
    }


    const closeSuccessAlert = () => {
        setSaved(false)
        window.location.replace(returnUrl)
        // router.replace(returnUrl);
    }

    const handleDropdownSelect = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)
    }

    const handleDropdownSelect2 = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)
        formProps.setFieldValue('monthlyRepeatType', 'day')
        formProps.setFieldValue('monthlyRepeatDays.date', '')
    }

    const handleMonthlyRepeatSelection = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)
        if (value === 'date') {
            formProps.setFieldValue('monthlyRepeatDays.day', '')
            formProps.setFieldValue('monthlyRepeatDays.position', '')
        }
        if (value === 'day') {
            formProps.setFieldValue('monthlyRepeatDays.date', '')
        }
    }

    const handleSetMonthlyRepeatDate = (value, fieldId, formProps) => {
        formProps.setFieldValue(fieldId, value)
        formProps.setFieldValue('monthlyRepeatType', 'date')
        formProps.setFieldValue('monthlyRepeatDays.day', '')
        formProps.setFieldValue('monthlyRepeatDays.position', '')
    }

    const switchRepeatType = (value, formProps) => {
        formProps.setFieldValue('frequency', value)

        setTimeout(() => {
            if (value === 'once' || value === 'daily') {
                formProps.setFieldValue('date', '')
                formProps.setFieldValue('weeklyRepeatDays', [])
                formProps.setFieldValue('monthlyRepeatDays', {})
                formProps.setFieldValue('monthlyRepeatType', '')
            }
            else if (value === 'weekly') {
                formProps.setFieldValue('date', '')
                formProps.setFieldValue('monthlyRepeatDays', {})
                formProps.setFieldValue('monthlyRepeatType', '')
            }
            else if (value === 'monthly') {
                formProps.setFieldValue('date', '')
                formProps.setFieldValue('weeklyRepeatDays', [])
            }
        }, 200);
    }

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

    const frequencyItems = [
        { value: 'once', label: 'Once' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ]

    const days = [
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thur' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
    ]

    const days2 = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
    ]

    const position = [
        { value: 'first', label: 'First' },
        { value: 'second', label: 'Second' },
        { value: 'third', label: 'Third' },
        { value: 'fourth', label: 'Fourth' },
        { value: 'last', label: 'Last' },
    ]

    const scheduleBriefGenerator = ({ type, startDate, endDate, timeArray, weekDays,
        position, monthDate, monthDay, monthRepeatType }) => {

        endDate = endDate || moment().format(`yyyy-${12}-${31}`).toString()
        const dayTrandformer = {
            0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'
        };

        const getTime = ({ minutes, hours }) => {
            console.log('get time ', { hours, minutes })
            const minuteLabel = `minute${Number(minutes) > 1 ? 's' : ''}`;
            const hourLabel = `hour${Number(hours) > 1 ? 's' : ''}`;

            return hours && minutes
                ? `${hours} ${hourLabel} ${minutes} ${minuteLabel}`
                : hours
                    ? `${hours} ${hourLabel}`
                    : minutes
                        ? `${minutes} ${minuteLabel}`
                        : ''
        }

        const getUntilMessage = () => {
            if (id) return ''
            if (type === 'once') {
                return '' //startDate && `<div><span>This schedule will occur only on ${moment(startDate).format('DD/MM/yyyy')} at</span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)}</ul></div`
            }
            if (type === 'daily') {
                return `${endDate && ('until ' + moment(endDate).format('DD/MM/yyyy'))}` //startDate && `<div><span>This schedule will occur daily from ${moment(startDate).format('DD/MM/yyyy')} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })} </li>`)} </ul> <span>${endDate && ('until ' + moment(endDate).format('DD/MM/yyyy'))}</span></div`
            }
            if (type === 'weekly') {
                console.log('week data max', endDate, weekDays, Math.max(...weekDays.map(i => i?.id)))
                const lastDay = moment(endDate).startOf('week').add(Math.max(...weekDays.map(i => Number(i?.id))), 'days').format('yyyy-MM-DD');

                return `${endDate && ('until ' + (moment(endDate).isSameOrAfter(moment(lastDay), 'date') ? lastDay/* .format('DD/MM/yyyy') */ : moment(endDate).subtract(1, 'week').startOf('week').add(Math.max(...weekDays.map(i => Number(i?.id))), 'days').format('DD/MM/yyyy')))}` //weekDays?.length > 0 && `This schedule will occur weekly on ${weekDays?.map(i => dayTrandformer[i?.id])?.join(', ')} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${endDate && ('until ' + moment(endDate).format('DD/MM/yyyy'))}</span></div`
            }
            if (type === 'monthly') {
                return monthRepeatType === 'day'
                    ? `${endDate && ('until ' + `${position} ${dayTrandformer[monthDay]} of ${moment(endDate).format('MMMM')} ${moment().format('yyyy')}`)}` //position && monthDay && `This schedule will occur on the ${position} ${dayTrandformer[monthDay]} of every month at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${endDate && ('until ' + moment(endDate).format('DD/MM/yyyy'))}</span></div`
                    : `${endDate && ('until ' + `${moment(endDate).format(`${moment(monthDate).format('DD')}/MM/yyyy`)}`)}`//monthDate && `This schedule will occur on ${moment(monthDate).format('Do')} of every month at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${endDate && ('until ' + moment(endDate).format('DD/MM/yyyy'))}</span></div`
            }
        }


        if (timeArray?.length > 1) {
            if (type === 'once') {
                return startDate && `<div><span>This schedule will occur ${id ? '' : 'only'}  on ${moment(startDate).format('DD/MM/yyyy')} at</span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)}</ul></div`
            }
            if (type === 'daily') {
                return startDate && `<div><span>This schedule will occur ${id ? 'on' : 'daily from'} ${moment(startDate).format('DD/MM/yyyy')} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })} </li>`)} </ul> <span>${getUntilMessage()}</span></div`
            }
            if (type === 'weekly') {
                return weekDays?.length > 0 && `This schedule will occur ${id ? '' : 'weekly'} on ${id ? moment(startDate).format('DD/MM/yyyy') : weekDays?.map(i => dayTrandformer[i?.id])?.join(', ')} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${getUntilMessage()}</span></div`
            }
            if (type === 'monthly') {
                return monthRepeatType === 'day'
                    ? position && monthDay && `This schedule will occur on ${id ? moment(startDate).format('DD/MM/yyyy') : `the ${position} ${dayTrandformer[monthDay]} of every month`} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${getUntilMessage()}</span></div`
                    : monthDate && `This schedule will occur on ${id ? moment(startDate).format('DD/MM/yyyy') : `${moment(monthDate).format('Do')} of every month`} at </span> <ul> ${timeArray?.map(i => i?.time && (i?.hours || i?.minutes) && `<li>${moment(i?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: i?.hours, minutes: i?.minutes })}</li>`)} </ul> <span>${getUntilMessage()}</span></div`
            }
        }
        else {
            if (type === 'once') {
                return startDate && timeArray[0]?.time && (timeArray[0]?.hours || timeArray[0]?.minutes) && `This schedule will occur ${id ? '' : 'only'} on ${moment(startDate).format('DD/MM/yyyy')} at ${moment(timeArray[0]?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: timeArray[0]?.hours, minutes: timeArray[0]?.minutes })}.`
            }
            if (type === 'daily') {
                return startDate && timeArray[0]?.time && (timeArray[0]?.hours || timeArray[0]?.minutes) && `This schedule will occur ${id ? 'on' : 'daily from'} ${moment(startDate).format('DD/MM/yyyy')} at ${moment(timeArray[0]?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: timeArray[0]?.hours, minutes: timeArray[0]?.minutes })}  ${getUntilMessage()}.`
            }
            if (type === 'weekly') {
                return !Boolean(weekDays?.length > 0 && timeArray[0]?.time && (timeArray[0]?.hours || timeArray[0]?.minutes)) ? null : `This schedule will occur ${id ? '' : 'weekly'} on ${id ? moment(startDate).format('DD/MM/yyyy') : weekDays?.map(i => dayTrandformer[i?.id])?.join(', ')} for ${getTime({ hours: timeArray[0]?.hours, minutes: timeArray[0]?.minutes })} ${getUntilMessage()}.`
            }
            if (type === 'monthly') {
                return monthRepeatType === 'day'
                    ? position && monthDay && timeArray[0]?.time && (timeArray[0]?.hours || timeArray[0]?.minutes) && `This schedule will occur on ${id ? moment(startDate).format('DD/MM/yyyy') : `the ${position} ${dayTrandformer[monthDay]} of every month`} at ${moment(timeArray[0]?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: timeArray[0]?.hours, minutes: timeArray[0]?.minutes })} ${getUntilMessage()}.`
                    : monthDate && timeArray[0]?.time && (timeArray[0]?.hours || timeArray[0]?.minutes) && `This schedule will occur on ${id ? moment(startDate).format('DD/MM/yyyy') : `${moment(monthDate).format('Do')} of every month`} at ${moment(timeArray[0]?.time, 'hh:mm').format('h:mm a')} for ${getTime({ hours: timeArray[0]?.hours, minutes: timeArray[0]?.minutes })} ${getUntilMessage()}.`
            }
        }
    }

    const hours = Array.from({ length: 24 }).map((item, index) => {
        return { value: index, label: index }
    })

    const minutes = Array.from({ length: 60 }).map((item, index) => {
        return { value: index, label: index }
    })

    const addNewTimeFrame = (formProps) => {
        formProps.setFieldValue('duration', [...formProps?.values?.duration, { time: '', hours: '', minutes: '' }])
    }

    const removeTimeFrame = (formProps, index) => {
        formProps.setFieldValue('duration', formProps.values?.duration?.filter((i, indx) => indx !== index))
    }

    const Renderer = ({ value }) => {
        return <Typography sx={{ fontSize: 13, pl: 1, py: 1.5 }}>
            {value}
        </Typography>
    }

    const handleChangeAddress = (value, formProps) => {
        formProps.setFieldValue('location', value)
    }

    const handleChangeLiveLink = (value, formProps) => {
        formProps.setFieldValue('liveLink', value)
    }

    return <Box sx={{ width: '100%' }}>
        <BackButton title={id ? 'Edit Schedule' : 'Create New Schedule'} />

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

                                {/* Title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Schedule Title'} name='title' />
                                </Box>

                                {/*Details*/}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Details'} />

                                    {/* Textfield */}
                                    <FormTextArea placeholder={'Schedule details'} name='details' />
                                </Box>

                                {/* Location */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Location'} />

                                    <Dropdown items={locations?.map(i => {
                                        return { value: i?.id, component: <Renderer value={`${i?.title} (${i?.address})`} /> }
                                    })}
                                        placeholder={'Select an address'}
                                        selectedItem={formProps.values.location || null}
                                        handleChange={(value) => { handleChangeAddress(value, formProps) }}
                                    />

                                </Box>

                                {/* Service type */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Service Type'} />

                                    {/* Drop down field */}
                                    <DropdownField
                                        items={DropdownItemsBuilder({ items: serviceList })}
                                        handleChange={(value) => { handleDropdownSelect(value, 'serviceType', formProps) }}
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


                                {/* Live Link */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Live Link'} required={false} />

                                    <Dropdown items={liveLinks?.map(i => {
                                        return { value: i?.id, component: <Renderer value={`${i?.title} (${i?.link})`} /> }
                                    })}
                                        placeholder={'Select an live link'}
                                        selectedItem={formProps.values.liveLink || null}
                                        handleChange={(value) => { handleChangeLiveLink(value, formProps) }}
                                    />
                                </Box>

                                <Box sx={{ width: '100%', mt: 2 }}>
                                    {/* Section header */}
                                    <Typography sx={{
                                        textTransform: 'capitalize', color: 'primary.main', fontSize: 14,
                                        py: 1, fontWeight: 600, width: '97%',
                                        px: 1, bgcolor: '#E6F1FF', mb: 2,
                                    }}>
                                        Schedule occurrence type
                                    </Typography>

                                    {/* Frequency */}
                                    {<Box sx={{ mb: 2, width: '100%', position: 'relative' }}>
                                        {/* Radio list */}
                                        <RadioList handleChange={(value) => { switchRepeatType(value, formProps) }}
                                            name='frequency'
                                            items={frequencyItems}
                                        />
                                        {id && <div style={{ position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 }}></div>}
                                    </Box>}

                                    {/* Date (if frequency is once or daily) */}
                                    {(formProps.values.frequency === 'once' || formProps.values.frequency === 'daily')
                                        && <Box sx={{ mb: 2, width: '100%', position: 'relative' }}>
                                            {/* Sub section heading */}
                                            <SubSectionHeading label={formProps.values.frequency === 'once' ? 'Occurs Once On' : 'Occurs Daily From'} />

                                            <FieldLabel label={'Date'} />
                                            {/* Text field */}
                                            <FormTextField name='date' type='date' />
                                            {id && <div style={{ position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 }}></div>}
                                        </Box>}

                                    {/* Date (if frequency is weekly) */}
                                    {(formProps.values.frequency === 'weekly')
                                        && <Box sx={{ mb: 2, width: '100%', position: 'relative' }}>
                                            {/* Sub section heading */}
                                            <SubSectionHeading label={'Occurs Weekly On Every'} />

                                            {/* Check boxes */}
                                            <CheckboxWithoutTextFieldList name='weeklyRepeatDays' items={days ?? []}
                                                valueKey={'value'}
                                            />
                                            {id && <div style={{ position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 }}></div>}
                                        </Box>}

                                    {/* Date (if frequency is monthly) */}
                                    {(formProps.values.frequency === 'monthly')
                                        && <Box sx={{ mb: 2, width: '100%', position: 'relative' }}>
                                            {/* Sub section heading */}
                                            <SubSectionHeading label={'Occurs Monthly On Every'} />

                                            {/* Event Repeat Options */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                {/* Date */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    {/* Checkbox */}
                                                    <Box sx={{ mr: 2 }}
                                                        onClick={() => { handleMonthlyRepeatSelection('date', 'monthlyRepeatType', formProps) }}>
                                                        {formProps.values.monthlyRepeatType === 'date' ? <RadioButtonChecked sx={{ color: 'primary.main' }} />
                                                            : <RadioButtonUnchecked sx={{ color: '#8D8D8D' }} />}
                                                    </Box>

                                                    {/* Date input */}
                                                    <Box sx={{ width: '100%' }}>
                                                        <FormTextField onChange={(e) => { handleSetMonthlyRepeatDate(e.currentTarget.value, 'monthlyRepeatDays.date', formProps) }} name='monthlyRepeatDays.date' type='date' />
                                                    </Box>

                                                    <Typography sx={{
                                                        ml: 2, fontSize: 13, minWidth: 'max-content',
                                                        fontWeight: 400
                                                    }}>
                                                        Of Every Month
                                                    </Typography>
                                                </Box>

                                                {/* day */}
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2, width: '100%' }}>
                                                    {/* Checkbox */}
                                                    <Box sx={{ mt: 1.5, mr: 2 }}
                                                        onClick={() => { handleMonthlyRepeatSelection('day', 'monthlyRepeatType', formProps) }}>
                                                        {formProps.values.monthlyRepeatType === 'day' ? <RadioButtonChecked sx={{ color: 'primary.main' }} />
                                                            : <RadioButtonUnchecked sx={{ color: '#8D8D8D' }} />}
                                                    </Box>

                                                    {/* Position */}
                                                    <Box sx={{ width: '200px', mr: 2 }}>
                                                        <DropdownField
                                                            items={DropdownItemsBuilder({ items: position ?? [] })}
                                                            handleChange={(value) => { handleDropdownSelect2(value, 'monthlyRepeatDays.position', formProps) }}
                                                            placeholder={'Eg. First'} name={'monthlyRepeatDays.position'} formProps={formProps}
                                                            selectedItem={formProps.values.monthlyRepeatDays.position}
                                                        />
                                                    </Box>

                                                    {/* Day */}
                                                    <Box sx={{ width: '200px' }}>
                                                        <DropdownField
                                                            items={DropdownItemsBuilder({ items: days2 ?? [] })}
                                                            handleChange={(value) => { handleDropdownSelect2(value, 'monthlyRepeatDays.day', formProps) }}
                                                            placeholder={'Eg. Sunday'} name={'monthlyRepeatDays.day'} formProps={formProps}
                                                            selectedItem={formProps.values.monthlyRepeatDays.day}
                                                        />
                                                    </Box>

                                                    <Typography sx={{ ml: 2, fontSize: 13, mt: 1.5, fontWeight: 400 }}>
                                                        Of Every Month
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {id && <div style={{ position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 }}></div>}
                                        </Box>}

                                    {/* Time */}
                                    {<Box sx={{ mb: 2, width: '100%' }}>
                                        {formProps.values.duration?.map((item, index) => {
                                            return <Box key={index} sx={{ mb: 2, width: '100%' }}>
                                                {/* Sub section heading */}
                                                <SubSectionHeading
                                                    label={formProps.values.duration?.length > 1
                                                        ? `Time frame - ${index + 1}`
                                                        : 'Time Frame'}
                                                    endComponentArray={index === formProps.values.duration?.length - 1
                                                        ? !id && [<Button
                                                            onClick={() => { addNewTimeFrame(formProps) }}
                                                            variant='text'
                                                            sx={{ color: 'primary.main', fontSize: 11 }}>
                                                            + Add New Time Frame
                                                        </Button>,
                                                        formProps.values.duration?.length > 1 && <Close onClick={() => { removeTimeFrame(formProps, index) }}
                                                            sx={{ ml: 2, fontSize: 18, cursor: 'pointer', color: 'red' }}
                                                        />]
                                                        : !id && [formProps.values.duration?.length > 1 && <Close onClick={() => { removeTimeFrame(formProps, index) }}
                                                            sx={{ color: 'red', cursor: 'pointer', fontSize: 18, }}
                                                        />]} />

                                                <Box sx={{ width: '100%', mb: 2 }}>
                                                    {/* Time */}
                                                    <FieldLabel label={'Start Time'} />
                                                    {/* Text field */}
                                                    <FormTextField name={`duration[${index}].time`} type='time' />
                                                </Box>

                                                {/* Duration */}
                                                <FieldLabel label={'Duration'} />
                                                <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start', width: '100%', justifyContent: 'space-between' }}>
                                                    {/* Drop down field */}
                                                    <Box sx={{ mr: 2, width: '100%' }}>
                                                        <DropdownField
                                                            items={DropdownItemsBuilder({ items: hours ?? [], postFix: 'hours' })}
                                                            handleChange={(value) => { handleDropdownSelect(value, `duration[${index}].hours`, formProps) }}
                                                            placeholder={'Hours'} name={`duration[${index}].hours`} formProps={formProps}
                                                            selectedItem={formProps.values.duration[index]?.hours}
                                                        />
                                                    </Box>

                                                    {/* Drop down field */}
                                                    <Box sx={{ ml: 2, width: '100%' }}>
                                                        <DropdownField
                                                            items={DropdownItemsBuilder({ items: minutes ?? [], postFix: 'minutes' })}
                                                            handleChange={(value) => { handleDropdownSelect(value, `duration[${index}].minutes`, formProps) }}
                                                            placeholder={'Minutes'} name={`duration[${index}].minutes`}
                                                            selectedItem={formProps.values.duration[index]?.minutes}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        })}
                                    </Box>}

                                    {/* End date */}
                                    {formProps.values.frequency && formProps.values.frequency !== 'once'
                                        && <Box sx={{ mb: 2, width: '100%', mt: 2, position: 'relative' }}>
                                            {/* Sub section heading */}
                                            <SubSectionHeading optional={true} label={'End Date'} />

                                            {/* Text field */}
                                            <FormTextField name='endDate' type='date' />
                                            {id && <div style={{ position: 'absolute', background: '#34343413', top: 0, left: 0, right: 0, bottom: 0, zIndex: 111 }}></div>}
                                        </Box>}

                                    {/* Schedule brief */}
                                    <Box sx={{ width: '100%', mb: 2 }}>
                                        {/* Time */}
                                        <SubSectionHeading label={'Schedule Brief'} />
                                        {/* Display */}
                                        {formProps.isValid && <Typography sx={{ fontSize: 14 }}
                                            dangerouslySetInnerHTML={{
                                                __html: scheduleBriefGenerator({
                                                    type: formProps.values.frequency,
                                                    startDate: formProps.values?.date,
                                                    endDate: formProps.values?.endDate,
                                                    timeArray: formProps.values.duration,
                                                    weekDays: formProps.values?.weeklyRepeatDays,
                                                    position: formProps.values?.monthlyRepeatDays?.position,
                                                    monthDate: formProps.values?.monthlyRepeatDays?.date,
                                                    monthDay: formProps.values?.monthlyRepeatDays?.day,
                                                    monthRepeatType: formProps.values?.monthlyRepeatType,
                                                })
                                            }} >
                                        </Typography>}
                                    </Box>


                                </Box>

                                {/* UI Message */}
                                {message && <ErrorMessage message={message} />}

                                {/* Publish button */}
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', mt: 4,
                                    justifyContent: 'center', maxWidth: '100%'
                                }}>
                                    {id && <Button variant="outlined" onClick={() => { router.back() }}
                                        sx={{ borderRadius: '24px', mr: 4 }}>
                                        Cancel
                                    </Button>}

                                    {<SubmitButton disabled={!formProps.isValid} fullWidth={false}
                                        marginTop={0} label={id ? 'Save' : 'Publish'} formProps={formProps}
                                    />}
                                </Box>

                            </Box>
                        </Form>)
                    }
                    }
                </Formik>
            </Box>

        </Box> : <Loader />
        }


        {
            saved && <ModalMessage
                title={id ? 'Schedule Updated' : 'Schedule Created'} open={saved} handleCancel={closeSuccessAlert} type='success'
                message={`You have just ${id ? 'updated this' : 'created a new'} schedule`} />
        }

    </Box >
}