'use client'

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import PrevIcon from '@mui/icons-material/KeyboardArrowLeft';
import { usePathname } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import { AudioSvg, BibleStudySvg, ChildrenSvg, ConferenceSvg, DownloadSvg, MenSvg, PdfSvg, PulpitSvg, VideoLink, WomenSvg, YouthSvg } from "@/public/icons/icons";

export default function ResourceDetail({ data }) {
    const darkMode = useTheme().palette.mode === 'dark';

    //  const book = usePathname().split('/').pop();

    /*    useEffect(() => {
           setData(sampleData)
       }, []) */


    const iconStyle1 = { marginLeft: '8px' }
    const iconStyle2 = { marginRight: '8px', height: '20px', width: '20px' }
    const iconStyle3 = { height: '20px', width: '20px', cursor: 'pointer' }

    const serviceTypes = {
        'men-service': { label: "Men's Ministry", value: 'men-service', icon: <MenSvg style={iconStyle2} /> },
        'women-service': { label: "Women's Ministry", value: 'women-service', icon: <WomenSvg style={iconStyle2} /> },
        'sunday-service': { label: "Sunday Service", value: 'sunday-service', icon: <PulpitSvg style={iconStyle2} /> },
        'wednesday-service': { label: "Wednesday Service", value: 'men-service', icon: <BibleStudySvg style={iconStyle2} /> },
        'conference-service': { label: "Conference", value: 'conference-service', icon: <ConferenceSvg style={iconStyle2} /> },
        'youth-service': { label: "Youth Ministry", value: 'youth-service', icon: <YouthSvg style={iconStyle2} /> },
        'children-service': { label: "Children's Ministry", value: 'children-service', icon: <ChildrenSvg style={iconStyle2} /> }
    }

    const tableHeading = ['Date', 'Scripture', 'Title', 'Service', 'Preacher', '', '', '', ''];

    return <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
        {data?.length ? <Table sx={{}}>
            <TableHead sx={{}}>
                <TableRow>
                    {tableHeading.map((item, index) => {
                        return <TableCell key={index} sx={{
                            backgroundColor: darkMode ? '#232323' : '#E3E3E3', fontSize: 16,
                            textAlign: 'center', fontWeight: 500
                        }}>
                            {item}
                        </TableCell>
                    })}
                </TableRow>
            </TableHead>

            <TableBody >
                {data.map((item, index) => {
                    return <TableRow key={index}
                        sx={{
                            backgroundColor: darkMode ? '#232323' : 'inherit',
                            ":hover": { backgroundColor: darkMode ? '#1A222C' : 'secondary.main' }
                        }}>
                        {/* Date */}
                        <TableCell sx={{
                            fontSize: { xs: 12, md: 14 }, maxWidth: '50px',
                            textAlign: 'center', fontWeight: 600
                        }}>
                            {item?.date}
                        </TableCell>

                        {/* Scripture */}
                        {/*    {item?.scripture && <TableCell sx={{
                            fontSize: { xs: 14, md: 16 }, maxWidth: '50px', textTransform: 'capitalize',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            {item?.scripture}
                        </TableCell>} */}

                        {item?.scripture && <TableCell sx={{
                            maxWidth: 'max-content',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            <Typography sx={{
                                maxWidth: 'max-content', mx: 'auto', minWidth: '100px',
                                fontSize: { xs: 14, md: 16 },
                            }}>
                                {item?.scripture}
                            </Typography>

                        </TableCell>}

                        {/* Title */}
                        {item?.title && <TableCell sx={{
                            maxWidth: 'max-content',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            <Typography sx={{
                                maxWidth: 'max-content', mx: 'auto', minWidth: '100px',
                                fontSize: { xs: 14, md: 16 },
                            }}>
                                {item?.title}
                            </Typography>

                        </TableCell>}
                        {/*  {item?.title && <TableCell sx={{
                            fontSize: { xs: 14, md: 16 }, maxWidth: '50px',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            {item?.title}
                        </TableCell>} */}

                        {item?.type && <TableCell sx={{
                        }}>
                            <Box sx={{
                                maxWidth: '100px', display: 'flex',
                                alignItems: 'center', mx: 'auto', fontWeight: 500,
                            }}>
                                <Typography sx={{ textAlign: 'left', fontSize: { xs: 14, md: 16 }, }}>
                                    {serviceTypes[item?.type]?.icon}
                                </Typography>
                                {serviceTypes[item?.type]?.label}
                            </Box>

                        </TableCell>}

                        {/* Service type */}
                        {/*  {item?.type && <TableCell sx={{
                            fontSize: 16, maxWidth: '50px', display: 'flex', mx: 'auto',
                            fontWeight: 500, alignItems: 'center'
                        }}>
                            <Typography sx={{ textAlign: 'left', }}>
                                {serviceTypes[item?.type]?.icon}
                            </Typography>
                            {serviceTypes[item?.type]?.label}
                        </TableCell>} */}

                        {/* Preacher */}
                        {item?.preacher && <TableCell sx={{
                            maxWidth: 'max-content',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            <Typography sx={{
                                maxWidth: 'max-content', mx: 'auto', minWidth: '100px',
                                fontSize: { xs: 14, md: 16 },
                            }}>
                                {item?.preacher}
                            </Typography>

                        </TableCell>}

                        {/*   {item?.preacher && <TableCell sx={{
                            fontSize: 16, maxWidth: '50px',
                            textAlign: 'center', opacity: '70%', fontWeight: 500
                        }}>
                            {item?.preacher}
                        </TableCell>} */}

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



                    </TableRow>
                })}
            </TableBody>
        </Table>
            : <Typography sx={{ p: 3, maxWidth: { xs: '90%', md: '300px' }, mx: 'auto', textAlign: 'center' }}>
                No available data
            </Typography>}
    </Box>
}