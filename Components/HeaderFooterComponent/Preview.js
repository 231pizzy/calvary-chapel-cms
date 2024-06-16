import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import { AboutSvg, ContactSvg, FacebookSvg, LocationSvg, MinistrySvg, PhoneSvg, ResourceSvg, ScheduleSvg, YoutubeSvg } from "@/public/icons/icons";
import { ArrowDropDown } from "@mui/icons-material";
import imageFromFile from "@/utils/imageFromFile";
import moment from "moment";

export const parseLink = (link) => {
    return link?.startsWith('http') ? link : `https://${link}`
}

export default function Preview({ type, locations, handleClose, formProps }) {
    const payload = formProps.values;

    const getImage = (id) => {
        return payload[id] && imageFromFile({ file: Object.values((payload[id] ?? [{}])[0])[0] })
    }

    const getAddressLink = () => {
        console.log('locations', locations);

        const coordinate = locations?.find(i => i?.id === payload?.address)?.coordinate

        // if (!long) return ''
        //const x = //`sdssrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2047.3438091069563!2d7.434218762423025!3d9.063205061040465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e752535045a6d%3A0x1ed6d853ab717f44!2sPCRC%20National%20Secretariat!5e0!3m2!1sen!2sng!4v1703597552591!5m2!1sen!2sng"`
        /* if (link?.startsWith('http')) return link;
        const startIndex = link.indexOf('src="')
        const endIndex = link.indexOf('"', startIndex + 8)
        const url = link.substring(startIndex + 5, endIndex)
        console.log('index of the src', { startIndex, endIndex, url }) */

        const url = `https://www.google.com/maps?q=${coordinate?.lat},${coordinate?.lng}`

        console.log('url', url)

        // formProps.setFieldValue('addressLink', url)

        return url
    }

    const getAddress = () => {
        return locations?.find(i => i?.id === payload?.address)?.address
    }

    const iconStyle = { height: '18px', width: '18px', marginRight: '4px' }

    const iconStyle2 = { height: '18px', width: '18px', marginRight: '4px' }

    const menuItems = [
        { label: 'Ministry', icon: <MinistrySvg style={iconStyle} />, hasChildren: true },
        { label: 'Resources', icon: <ResourceSvg style={iconStyle} />, hasChildren: true },
        { label: 'Schedule', icon: <ScheduleSvg style={iconStyle} />, hasChildren: false },
        { label: 'About CCT', icon: <AboutSvg style={iconStyle} />, hasChildren: true },
        { label: 'Contact', icon: <ContactSvg style={iconStyle} />, hasChildren: false },
    ]



    return <Modal open onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: { xs: '90%', md: '80%' }, m: 'auto', height: '80vh', bgcolor: 'white' }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', py: 1, px: 1, mx: 'auto',
                justifyContent: 'space-between', maxWidth: '100%', borderBottom: '1px solid #1414171A'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Close button */}
                    <IconButton onClick={handleClose} sx={{ p: 0, border: 'none' }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography sx={{ fontSize: 17, ml: 2, color: 'primary.main', fontWeight: 700 }}>
                        Preview
                    </Typography>
                </Box>


                {/* Publish button */}
                {<SubmitButton fullWidth={false} marginTop={0} label={'Publish'} formProps={formProps} />}
            </Box>

            {/* Header */}
            {type === 'header' && <Box sx={{
                maxWidth: '80%', mx: 'auto', mt: 2,
                display: 'flex', flexDirection: 'column', p: 2,
            }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', p: 1.5, border: '0.82px solid #1414170D',
                    boxShadow: '0px 6.594444274902344px 13.188888549804688px 0px #0000000A', bgcolor: 'white',
                    justifyContent: 'space-between', borderRadius: '8px'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: 14, width: 17, minWidth: 'max-content' }}>
                        <img src={getImage('logo')} style={{ height: '100%', width: '100%' }} />
                        <Typography sx={{ color: 'primary.main', minWidth: 'max-content', ml: 1, fontSize: 12 }}>
                            {payload?.title}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                        {menuItems.map((item, index) => {
                            return <Typography key={index} sx={{
                                fontSize: 13, mr: 2, display: 'flex', alignItems: 'center',
                                fontWeight: 500
                            }}>
                                {item?.icon} {item?.label} {item?.hasChildren && <ArrowDropDown />}
                            </Typography>
                        })}
                    </Box>
                </Box>
            </Box>}

            {/* Footer */}
            {type === 'footer' && <Box sx={{
                maxWidth: '80%', mx: 'auto', mt: 2,
                display: 'flex', flexDirection: 'column', p: 2,
            }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', p: 1.5, border: '0.82px solid #1414170D',
                    boxShadow: '0px 6.594444274902344px 13.188888549804688px 0px #0000000A', bgcolor: '#0B2645',
                    justifyContent: 'space-between', borderRadius: '8px'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: 14, width: 17, minWidth: 'max-content' }}>
                        <img src={getImage('logo')} style={{ height: '100%', width: '100%' }} />
                        <Typography sx={{ color: 'white', minWidth: 'max-content', ml: 1, fontSize: 12 }}>
                            {payload?.title}
                        </Typography>
                    </Box>

                    <Typography sx={{ color: 'white', minWidth: 'max-content', fontSize: 12 }}>
                        © {moment().format('yyyy')} | Calvary Chapel of Turku
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                        <Typography component={'a'} href={getAddressLink()} target="_blank" sx={{
                            fontSize: 11, mr: 2, display: 'flex', alignItems: 'center',
                            fontWeight: 500, textDecoration: 'none', color: 'white'
                        }}>
                            <LocationSvg style={iconStyle2} /> {getAddress()/* payload?.address */}
                        </Typography>

                        {Boolean(payload?.phone) && <Typography sx={{
                            fontSize: 11, mr: 2, display: 'flex', alignItems: 'center',
                            fontWeight: 500
                        }}>
                            <PhoneSvg style={iconStyle2} /> {payload?.phone}
                        </Typography>}

                        <Typography component={'a'} href={parseLink(payload?.facebookLink)} target='_blank'
                            sx={{
                                display: 'flex', textDecoration: 'none', alignItems: 'center', mr: 2,
                                color: 'white', textDecorationColor: 'none'
                            }}>
                            <FacebookSvg />
                        </Typography>

                        <Typography component={'a'} href={parseLink(payload?.youtubeLink)} target='_blank'
                            sx={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                            <YoutubeSvg />
                        </Typography>
                    </Box>
                </Box>
            </Box>}
        </Box>
    </Modal>
}