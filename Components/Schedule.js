'use client'

import { AudioSvg, BibleStudySvg, CanceledSvg, ChildrenSvg, ConferenceSvg, DownloadSvg, MenSvg, PdfSvg, PulpitSvg, SoonSvg, TickSvg, VideoLink, VideoSvg, WomenSvg, YouthSvg } from "@/public/icons/icons";
import { Box, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import ScheduleDetail from "./ScheduleDetail";

export default function ScheduleTemplate({ noCurvedTop = false, openDetail, currentDate = moment().toDate() }) {
    const [currentTab, setCurrentTab] = useState('upcoming');
    const [showDetails, setShowDetails] = useState(false);
    const [details, setDetails] = useState({});

    const darkMode = useTheme().palette.mode === 'dark';

    const [items, setItems] = useState([]);

    const iconStyle1 = { marginLeft: '8px' }
    const iconStyle2 = { marginRight: '8px', height: '24px', width: '24px' }
    const iconStyle3 = { height: '24px', width: '24px', cursor: 'pointer' }

    const sampleDetails = `Lorem ipsum dolor sit amet consectetur. Neque facilisis consequat aliquam ante at. Ultricies morbi eu ultrices proin euismod malesuada. Sit odio viverra tortor nibh faucibus. Malesuada velit et ridiculus non quam ut nunc ipsum in. Aliquet pellentesque diam cum scelerisque pretium tristique aliquet a. Orci enim imperdiet nisl tellus dui tortor. Dui etiam fringilla eget.`

    const status = {
        now: { label: 'Now', color: '#008000', bgcolor: '#D4ECD4', icon: <TickSvg style={iconStyle1} /> },
        soon: { label: 'Soon', color: '#FF8023', bgcolor: '#FEEEE3', icon: <SoonSvg style={iconStyle1} /> },
        cancelled: { label: 'Cancelled', color: '#8A2424', bgcolor: '#8A2424', icon: <CanceledSvg style={iconStyle1} /> },
    }

    const serviceTypes = {
        'men-service': { label: "Men's Ministry", value: 'men-service', icon: <MenSvg style={iconStyle2} /> },
        'women-service': { label: "Women's Ministry", value: 'women-service', icon: <WomenSvg style={iconStyle2} /> },
        'sunday-service': { label: "Sunday Service", value: 'sunday-service', icon: <PulpitSvg style={iconStyle2} /> },
        'wednesday-service': { label: "Wednesday Service", value: 'men-service', icon: <BibleStudySvg style={iconStyle2} /> },
        'conference-service': { label: "Conference", value: 'conference-service', icon: <ConferenceSvg style={iconStyle2} /> },
        'youth-service': { label: "Youth Ministry", value: 'youth-service', icon: <YouthSvg style={iconStyle2} /> },
        'children-service': { label: "Children's Ministry", value: 'children-service', icon: <ChildrenSvg style={iconStyle2} /> }
    }

    const upcomingHeading = ['Date', 'Service', 'Time', 'Venue', '', '', ''];
    const concludedHeading = ['Date', 'Service', 'Title', '', '', '', '', ''];

    const upComing = [
        { date: '24/09/2023', time: '11:00 am', details: sampleDetails, duration: '3 hours', type: 'sunday-service', venue: 'Calvary Chapel Turku', preacher: 'Robert Pecoraro', status: 'soon', liveLink: 'sa' },
        { date: moment().format('DD/MM/yyyy'), details: sampleDetails, duration: '3 hours', time: '7:00 pm', type: 'wednesday-service', preacher: 'Robert Pecoraro', venue: 'Calvary Chapel Turku', status: 'now', liveLink: 'kjkdsd' },
        { date: '02/01/2024', time: '1:00 pm', details: sampleDetails, duration: '3 hours', type: 'men-service', venue: 'Calvary Chapel Turku', preacher: 'Robert Pecoraro', status: 'soon', liveLink: 'ds' },
        { date: '19/11/2023', time: '1:00 pm', details: sampleDetails, duration: '3 hours', type: 'men-service', venue: 'Calvary Chapel Turku', preacher: 'Robert Pecoraro', status: 'soon', liveLink: 'dd' },
        { date: '12/12/2023', time: '8:00 am', details: sampleDetails, duration: '3 hours', type: 'women-service', venue: 'Calvary Chapel Turku', preacher: 'Robert Pecoraro', status: 'soon', liveLink: 'ds' },
        { date: '31/12/2023', time: '8:00 am', details: sampleDetails, duration: '3 hours', type: 'women-service', venue: 'Calvary Chapel Turku', preacher: 'Robert Pecoraro', status: 'soon', liveLink: 'ad' },
    ];

    const justConcluded = [
        {
            date: moment().format('DD/MM/yyyy'), duration: '3 hours', type: 'wednesday-service', preacher: 'Robert Pecoraro', title: 'Our father who art in heaven',
            videoLink: 'jksdsd', audioLink: 'dddf', downloadLink: 'jdsk', details: sampleDetails, pdfLink: 'dfdfewd'
        },
        {
            date: moment().format('DD/MM/yyyy'), duration: '3 hours', type: 'men-service', preacher: 'Robert Pecoraro', title: 'Our father who art in heaven',
            videoLink: 'dsds', audioLink: 'jksdkjsd', downloadLink: 'sdsdss', details: sampleDetails, pdfLink: 'sjks'
        },
        {
            date: moment().format('DD/MM/yyyy'), duration: '3 hours', type: 'women-service', preacher: 'Robert Pecoraro', title: 'Our father who art in heaven',
            videoLink: 'dfdfd', audioLink: 'hhds', downloadLink: 'hsdjkh', details: sampleDetails, pdfLink: 'dfdfd'
        },
        {
            date: moment().format('DD/MM/yyyy'), duration: '3 hours', type: 'children-service', preacher: 'Robert Pecoraro', title: 'Our father who art in heaven',
            videoLink: 'dfdfd', audioLink: 'jksdkjs', downloadLink: 'jksjks', details: sampleDetails, pdfLink: 'dfdfd'
        },
    ];

    const changeTab = (event) => {
        if (event.target.id)
            setCurrentTab(event.target.id)
    }

    const openDetailModal = (detail) => {
        // setShowDetails(true)
        openDetail(detail)
    }

    const closeDetailModal = () => {
        setShowDetails(false)
    }

    const handleEventClick = (event, index) => {
        if (Number(index) >= 0 && Array.isArray(selectedBody)) {
            setDetails(selectedBody[index]);
            openDetailModal(selectedBody[index])
        }
    }

    const selectItems = (currentTab, currentDate) => {
        const itemsByCategory = currentTab === 'upcoming' ? upComing : justConcluded;

        let itemsByDate = itemsByCategory.filter(items =>
            moment(items.date, 'DD/MM/yyyy').isSame(moment(currentDate, 'DD/MM/yyy'), 'month'))

        itemsByDate = itemsByCategory?.length ? itemsByDate.filter(items =>
            moment(items.date, 'DD/MM/yyyy').isSame(moment(currentDate, 'DD/MM/yyy'), 'year')) : []

        const selectedHead = currentTab === 'upcoming' ? upcomingHeading : concludedHeading;

        return { selectedBody: itemsByDate, selectedHead }
        // setItems(itemsByDate)
    }

    const tabStyle = {
        width: '50%', cursor: 'pointer', fontSize: { xs: 16, md: 20 },
        ":hover": { backgroundColor: darkMode ? '#07274E' : 'secondary.main', /* color: darkMode ? 'black' : 'inherit' */ },
        fontWeight: 600, textAlign: 'center', py: 2, color: 'text.secondary'
    };

    const selectedTabStyle = { borderBottom: '3px solid #0E60BF', color: 'primary.main' }

    //    const  = 
    const { selectedBody, selectedHead } = selectItems(currentTab, currentDate) //currentTab === 'upcoming' ? upComing : justConcluded;


    return <Box sx={{
        width: '100%', maxWidth: { xs: '90vw', md: 'inherit' }, borderRadius: noCurvedTop ? 'none' : '16px',
        border: noCurvedTop ? 'none' : `1px solid ${darkMode ? '#0E60BF' : '#97C6FE'}`,
        boxShadow: '0px 8px 16px 0px #0000000F', borderTop: `1px solid ${darkMode ? '#0E60BF' : '#E6F1FF'}`,
        background: 'background.main'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', borderBottom: '1px solid #232323' }}>
            <Typography id='upcoming' onClick={changeTab}
                sx={{ borderRadius: '12px 0 0 0', ...tabStyle, ...(currentTab === 'upcoming' ? selectedTabStyle : {}) }}>
                Upcoming Services
            </Typography>

            <Typography id='concluded' onClick={changeTab}
                sx={{ borderRadius: '0 12px 0 0', ...tabStyle, ...(currentTab === 'concluded' ? selectedTabStyle : {}) }}>
                Just Concluded
            </Typography>
        </Box>

        <Box sx={{ maxHeight: '300px', overflowY: 'auto', }}>
            {selectedBody?.length ? <Table sx={{}}>
                <TableHead sx={{}}>
                    <TableRow>
                        {selectedHead.map((item, index) => {
                            return <TableCell key={index} sx={{
                                backgroundColor: darkMode ? '#232323' : '#E3E3E3', fontSize: { xs: 14, md: 16 },
                                textAlign: 'center', fontWeight: 500
                            }}>
                                {item}
                            </TableCell>
                        })}
                    </TableRow>
                </TableHead>

                <TableBody >
                    {selectedBody.map((item, index) => {
                        return <TableRow key={index} onClick={(event) => { event.stopPropagation(); handleEventClick(event, index) }}
                            sx={{ cursor: 'pointer', ":hover": { backgroundColor: darkMode ? '#232323' : 'secondary.main' } }}>
                            {/* Date */}
                            <TableCell sx={{
                                fontSize: { xs: 14, lg: 14 }, /* maxWidth: '50px', */
                                textAlign: 'center', fontWeight: 600
                            }}>
                                {item?.date}
                            </TableCell>

                            {/* Service */}
                            {item?.type && <TableCell sx={{
                                /*  maxWidth: '50px',  *//* display: 'flex', mx: 'auto',
                                  alignItems: 'center' */
                            }}>
                                <Box sx={{
                                    maxWidth: '100px', display: 'flex', fontSize: { xs: 14, lg: 16 },
                                    alignItems: 'center', mx: 'auto', fontWeight: 500,
                                }}>
                                    <Typography sx={{ textAlign: 'left', }}>
                                        {serviceTypes[item?.type]?.icon}
                                    </Typography>
                                    {serviceTypes[item?.type]?.label}
                                </Box>

                            </TableCell>}

                            {/* Time */}
                            {item?.time && <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', opacity: '70%', fontWeight: 500
                            }}>
                                <Typography sx={{
                                    maxWidth: 'max-content', minWidth: '100px', fontSize: { xs: 14, lg: 16 },
                                    mx: 'auto', textAlign: 'center'
                                }}>
                                    {item?.time}
                                </Typography>

                            </TableCell>}

                            {/* Title */}
                            {item?.title && <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', opacity: '70%', fontWeight: 500
                            }}>
                                <Typography sx={{
                                    maxWidth: 'max-content', mx: 'auto', minWidth: '100px',
                                    fontSize: { xs: 14, lg: 16 },
                                }}>
                                    {item?.title}
                                </Typography>

                            </TableCell>}

                            {/* Venue */}
                            {item?.venue && <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', opacity: '70%', fontWeight: 500
                            }}>
                                <Typography sx={{
                                    maxWidth: 'max-content', mx: 'auto', minWidth: '100px', fontSize: { xs: 14, lg: 16 },
                                }}>
                                    {item?.venue}
                                </Typography>

                            </TableCell>}

                            {/* Status */}
                            {item?.status && <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', fontWeight: 500
                            }}>
                                <Typography sx={{
                                    color: status[item?.status]?.color, padding: '4px 0', justifyContent: 'center',
                                    bgcolor: status[item?.status]?.bgcolor, display: 'flex', maxWidth: 'max-content',
                                    alignItems: 'center', borderRadius: '12px', minWidth: 'max-content', mx: 'auto',
                                    border: `1px solid ${status[item?.status]?.color}`, px: { xs: 1 },
                                    fontSize: { xs: 14, lg: 16 },
                                }}>
                                    {status[item?.status]?.label}  {status[item?.status]?.icon}
                                </Typography>
                            </TableCell>}

                            {/* Watch Live */}
                            {item?.liveLink && <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', opacity: '70%', fontWeight: 500
                            }}>
                                {item?.liveLink?.length > 4 && <Typography sx={{
                                    color: '#FF1515', padding: '4px 0', bgcolor: '#FFE5E5', display: 'flex', cursor: 'pointer',
                                    alignItems: 'center', justifyContent: 'center', borderRadius: '12px', maxWidth: 'max-content',
                                    minWidth: 'max-content', border: '1px solid #FF1515', px: { xs: 1, }, mx: 'auto',
                                    fontSize: { xs: 12, lg: 16 },
                                }} s>
                                    Watch Live <VideoSvg style={iconStyle1} />
                                </Typography>}
                            </TableCell>}

                            {/* Video link */}
                            {item?.videoLink && <TableCell sx={{ fontSize: 14, textAlign: 'center', opacity: '70%', fontWeight: 500 }}>
                                {item?.videoLink?.length > 4 && <VideoLink style={iconStyle3} />}
                            </TableCell>}

                            {/* Audio link */}
                            {item?.audioLink && <TableCell sx={{ fontSize: 16, textAlign: 'center', opacity: '70%', fontWeight: 500 }}>
                                {item?.audioLink?.length > 4 && <AudioSvg style={iconStyle3} />}
                            </TableCell>}

                            {/* Download */}
                            {item?.downloadLink && <TableCell sx={{ fontSize: 16, textAlign: 'center', opacity: '70%', fontWeight: 500 }}>
                                {item?.downloadLink?.length > 4 && <DownloadSvg style={iconStyle3} />}
                            </TableCell>}

                            {/* Pdf */}
                            {item?.pdfLink && <TableCell sx={{ fontSize: 16, textAlign: 'center', opacity: '70%', fontWeight: 500 }}>
                                {item?.pdfLink?.length > 4 && <PdfSvg style={iconStyle3} />}
                            </TableCell>}

                            {/* Watch Live */}
                            <TableCell sx={{
                                maxWidth: 'max-content',
                                textAlign: 'center', opacity: '70%', fontWeight: 500
                            }}>
                                {moment(item?.date, 'DD/MM/yyyy').isSame(moment(), 'date') && <Typography sx={{
                                    color: '#0E60BF', padding: '4px 0', bgcolor: '#0E60BF11',
                                    display: 'flex', cursor: 'pointer',
                                    alignItems: 'center', justifyContent: 'center', borderRadius: '12px', maxWidth: 'max-content',
                                    minWidth: 'max-content', border: '1px solid #0E60BF',
                                    px: { xs: 1, }, mx: 'auto', fontSize: { xs: 12, lg: 13 },
                                }} s>
                                    Today
                                </Typography>}
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
                : <Typography sx={{
                    p: 3, maxWidth: { xs: '90%', md: '300px' }, color: 'text.secondary',
                    mx: 'auto', textAlign: 'center'
                }}>
                    No available {currentTab === 'upcoming' ? 'upcoming' : 'concluded'} schedules for this date
                </Typography>}

        </Box>



        {/*  {showDetails && <Modal open={showDetails} onClose={closeDetailModal}
            sx={{ display: { md: 'none' }, alignItems: 'center', justifyContent: 'center' }}>
            {showDetails && <ScheduleDetail details={details} closeModal={closeDetailModal} />}
        </Modal>} */}
    </Box>

    {/*  {showDetails && <ScheduleDetail details={details} closeModal={closeDetailModal} />} */ }


}