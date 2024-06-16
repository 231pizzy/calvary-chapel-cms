import { AdminSvg, ContactSvg, ResourceSvg, ScheduleSvg } from "@/public/icons/icons"
import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Sector, Cell, Label
} from 'recharts';

import Dropdown from "../DropdownField/Dropdown2"
import Loader from "../Loader/Loader";

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [sectionData, setSectionData] = useState(null)
    const [startDate, setStartDate] = useState('31daysAgo')

    const [page, setPage] = useState('all')
    const [subPage, setSubPage] = useState(null)
    const [value, setValue] = useState('pageViews')

    const [pageRef, setPageRef] = useState(null)

    const [deviceData, setDeviceData] = useState(null)

    const [lastVisit, setLastVisit] = useState('29')

    const pages = [
        { value: 'all', label: 'All' },
        { value: 'home', label: 'Home Page' },
        { value: 'ministry', label: 'Ministry' },
        { value: 'resources', label: 'Resources' },
        { value: 'schedule', label: 'Schedule' },
        { value: 'about', label: 'About' },
        { value: 'contact', label: 'Contact' },
        { value: 'about', label: 'About' },
    ]

    const recent = [
        { value: '5', label: '5 minutes ago' },
        { value: '10', label: '10 minutes ago' },
        { value: '15', label: '15 minutes ago' },
        { value: '20', label: '20 minutes ago' },
        { value: '29', label: '30 minutes ago' },
    ]

    const pagesWithSubPages = ['ministry', 'resources', 'about']

    const values = [
        { value: 'engagementDuration', label: 'Time Spent' },
        { value: 'pageViews', label: 'Visitors' },
    ]

    const periods = [
        { value: 'yesterday', label: 'Yesterday' },
        { value: '7daysAgo', label: 'Last 7 days' },
        { value: '31daysAgo', label: 'Last 31 days' },
        { value: '90daysAgo', label: 'Last 90 days' },
        { value: '183daysAgo', label: 'Last 6 months' },
        { value: '365daysAgo', label: 'Last 1 year' },
    ]

    const hourlyOptions = ['today', 'yesterday']

    useEffect(() => {
        //Get page view data
        fetch(`/api/pageviews?startDate=${startDate}&&page=${subPage ?? page}&&pageRef=${pageRef}&&hourlyView=${hourlyOptions.includes(startDate)}`, { method: 'GET' }).then(
            async resp => {
                const { result, loginRedirect } = await resp.json();
                console.log('data returned pageviews', { result })
                loginRedirect && window.location.replace('/login')
                setData(result)
            }
        );

        //Get sections data
        fetch(`/api/sections`, { method: 'GET' }).then(
            async resp => {
                const { result, loginRedirect } = await resp.json();
                console.log('data returned sections', { result })
                loginRedirect && window.location.replace('/login')
                setSectionData(result?.pages)
            }
        );

    }, [page, startDate, subPage])

    useEffect(() => {
        //Get page view data
        fetch(`/api/minutes-ago?minutesAgo=${lastVisit}`, { method: 'GET' }).then(
            async resp => {
                const { result, loginRedirect } = await resp.json();
                console.log('data returned', { result })
                loginRedirect && window.location.replace('/login')
                setDeviceData(result)
            }
        );

    }, [lastVisit])

    const subSections = {
        ministry: [
            { label: "All Subpages", pageRef: 'ministry', value: 'ministry' },
            { label: "Men's Ministry", pageRef: 'ministry', value: 'men-service' },
            { label: "Women's Ministry", pageRef: 'ministry', value: 'women-service' },
            { label: "Youth's Ministry", pageRef: 'ministry', value: 'youth-service' },
            { label: "Children's Ministry", pageRef: 'ministry', value: 'children-service' },
        ],
        resources: [
            { label: "All Subpages", pageRef: 'resources', value: 'resources' },
            { label: "Verse by Verse", pageRef: 'resources', value: 'verse-by-verse' },
            { label: "Wednesday Service", pageRef: 'resources', value: 'wednesday-service' },
            { label: "Sunday Service", pageRef: 'resources', value: 'sunday-service' },
            { label: "Guest Speakers", pageRef: 'resources', value: 'guest-speakers' },
            { label: "Character Studies", pageRef: 'resources', value: 'character-studies' },
            { label: "Topical Studies", pageRef: 'resources', value: 'topical-studies' },
            { label: "Conferences", pageRef: 'resources', value: 'conferences' },
        ],
        about: [
            { label: "All Subpages", pageRef: 'about', value: 'about' },
            { label: "History of CCT", pageRef: 'about', value: 'history' },
            { label: "Statement Of Faith", pageRef: 'about', value: 'statement-of-faith' },
            { label: "Leadership", pageRef: 'about', value: 'leadership' },
        ],
    }

    const getSubPages = (page) => {
        return subSections[page]
    }

    const generateTime = (value) => {
        const minuteFactor = 60;
        if (minuteFactor > Number(value)) return `${value} secs`

        const hours = Math.trunc(Number(value) / (60 * 60));
        const minutes = (Number(value) % (hours > 0 ? (60 * 60) : 60));

        if (hours === 0) return `${minutes} mins`

        if (minutes === 0) return `${hours} hrs`

        return `${hours}hrs, ${minutes}mins`
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            console.log({ active, payload, label })
            return (
                <div style={{
                    background: 'white', boxShadow: '0px 44px 44px -7px #00000014', border: '1px solid #E4E4E7', alignItems: 'center',
                    borderRadius: '12px', display: 'flex', flexDirection: 'column', padding: '8px 8px', textAlign: 'center'
                }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{`${payload[0]?.payload?.pageViews} Visitors`}</span>
                    <div style={{ display: 'flex' }}>
                        <span style={{ display: 'flex', fontSize: '14px', marginRight: '4px' }}>
                            Spent average of:
                        </span>
                        <span style={{ display: 'flex', color: '#4F92AB', marginLeft: '4px', fontSize: '14px' }}>
                            {generateTime(payload[0]?.payload?.engagementDuration)}
                        </span>
                    </div>

                    <span style={{ display: 'flex', fontSize: '14px', }}> on the website</span>
                </div>
            );
        }

        return null;
    };

    const handleSelectPage = (page) => {
        setPage(page)
        setSubPage(null)
    }

    const handleSelectValue = (value) => {
        setValue(value)
    }

    const handleSelectLastVisit = (value) => {
        setLastVisit(value)
    }

    const handleSelectSubPage = (value) => {
        setSubPage(value)
    }

    const handleSelectStartDate = (value) => {
        setStartDate(value)
    }

    const COLORS = ['#008000', '#FFA500', '#D20ED2'];

    const iconStyle = { width: '20px', height: '20px', color: '#0E60BF' }


    const sections = [
        {
            id: 'resources', label: 'Resources', icon: <ResourceSvg style={iconStyle} />,
            children: [
                {
                    id: 'resources', label: 'Resources', children: [
                        { id: 'totalCreated', label: 'Total Resources', url: '/admin/resources/all-resources', color: '#0E60BF', bgcolor: '#E6F1FF' },
                        { id: 'totalPublished', label: 'Total Published Resources', url: '/admin/resources/all-resources?status=published', color: '#008000', bgcolor: 'white' },
                        { id: 'totalUnpublished', label: 'Total Unpublished Resources', url: '/admin/resources/all-resources?status=unpublished', color: '#B80202', bgcolor: 'white' },
                        { id: 'totalSaved', label: 'Total Saved Resources', url: '/admin/resources/all-resources?status=saved', color: '#800080', bgcolor: 'white' },
                    ]
                },
            ]
        },
        {
            id: 'contact', label: 'Contact', icon: <ContactSvg style={iconStyle} />,
            children: [
                {
                    id: 'contact', label: 'Contact Enquiries', children: [
                        { id: 'totalCreated', label: 'Total Enquiries', url: '/admin/contact', color: '#0E60BF', bgcolor: '#E6F1FF' },
                        { id: 'totalReplied', label: 'Total Enquires Replied', url: '/admin/contact?status=replied', color: '#008000', bgcolor: 'white' },
                        { id: 'totalUnreplied', label: 'Total Enquires Unreplied', url: '/admin/contact?status=unreplied', color: '#B80202', bgcolor: 'white' },
                    ]
                },
            ]
        },
        {
            id: 'schedule', label: 'Schedule', icon: <ScheduleSvg style={iconStyle} />,
            children: [
                {
                    id: 'schedule', label: 'Schedule', children: [
                        { id: 'totalCreated', label: 'Total Schedule', url: '/admin/schedule', color: '#0E60BF', bgcolor: '#E6F1FF' },
                        { id: 'totalPublished', label: 'Total Schedule Published', url: '/admin/schedule?status=published', color: '#008000', bgcolor: 'white' },
                        { id: 'totalUnpublished', label: 'Total Schedule Unpublished', url: '/admin/schedule?status=unpublished', color: '#B80202', bgcolor: 'white' },
                        { id: 'totalCancelled', label: 'Total Schedule Cancelled', url: '/admin/schedule?status=cancelled', color: '#8A2424', bgcolor: 'white' },
                        { id: 'totalHappeningNow', label: 'Happening Now', url: '/admin/schedule?status=now', color: '#099609', bgcolor: '#EBFEEB' },
                    ]
                },
            ]
        },
        {
            id: 'admin', label: 'Admin', icon: <AdminSvg style={iconStyle} />,
            children: [
                {
                    id: 'admin', label: 'Admin', children: [
                        { id: 'totalCreated', label: 'Total Admin', url: '/admin/admin', color: '#0E60BF', bgcolor: '#E6F1FF' },
                    ]
                },
            ]
        },
    ]


    const getTotalVisitors = () => deviceData?.reduce((accumulator, currentObject) => accumulator + Number(currentObject.value), 0)


    const CustomLabel = ({ viewBox, value }) => {
        const { cx, cy } = viewBox;
        return <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontWeight={700}>
            <tspan x={cx} dy={-8} fontSize={'14px'}>
                {value}
            </tspan>
            <tspan x={cx} dy={16} fontWeight={600} fontSize={'11px'}>
                {'Recent Visitors'}
            </tspan>
        </text>
    }

    const getPercent = (key) => {
        const total = deviceData?.reduce((accumulator, currentObject) => accumulator + Number(currentObject.value), 0);
        const value = deviceData?.find(i => i?.name === key)?.value;
        const percent = (total || value) ? (Number(value) / Number(total)) * 100 : 0

        console.log('get percent', { total, value, percent })

        return `${percent}%`
    }


    console.log('value in dashboard', value)

    return <Box>
        {data ? <div style={{
            display: 'flex', padding: '12px 24px', marginBottom: '16px',
            justifyContent: 'space-between', height: '50vh'
        }}>
            {/* Area Chart */}
            <div style={{
                display: 'flex', width: '100%', height: '100%', border: '1px solid #1414171A', marginRight: '24px',
                flexDirection: 'column', boxShadow: '0px 8px 16px 0px #0000000F', borderRadius: '12px'
            }}>
                {/* Pages and Value */}
                <div style={{
                    display: 'flex', maxWidth: '100%', background: '#F5F9FF',
                    padding: '12px', borderRadius: '12px 12px 0 0'
                }}>
                    {/* Pages */}
                    <Dropdown items={pages} prefix={'Page'} value={page} label="Page" handleItemClick={handleSelectPage} />

                    <div style={{ marginRight: '24px' }} />
                    {/* Values */}
                    <Dropdown items={values} prefix={'Value'} value={value} label="Value" handleItemClick={handleSelectValue} />
                </div>

                {/* Period */}
                <div style={{
                    padding: '12px', display: 'flex', alignItems: 'center', marginBottom: '12px',
                    borderBottom: '1px solid #1414171A', justifyContent: 'space-between', maxWidth: '100%'
                }}>
                    {pagesWithSubPages.includes(page) && <Dropdown items={getSubPages(page)} value={subPage} label="Sub Pages" handleItemClick={handleSelectSubPage} />}

                    <div style={{ flexGrow: 1 }} />
                    <Dropdown items={periods} value={startDate} label="Interval" handleItemClick={handleSelectStartDate} />
                </div>

                {/* Area Chart */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis style={{ fontSize: '12px' }} dataKey="label" />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area strokeWidth={2} type="monotone" dataKey={value} stroke="#4F92AB" fill="#E6F1FFB2" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div style={{
                display: 'flex', width: '500px', height: '100%', border: '1px solid #1414171A',
                flexDirection: 'column', boxShadow: '0px 8px 16px 0px #0000000F', borderRadius: '12px'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', maxWidth: '100%', background: '#F5F9FF',
                    padding: '12px', borderRadius: '12px 12px 0 0',
                }}>
                    <Typography sx={{
                        display: 'flex', fontWeight: 600, color: 'primary.main', fontSize: 13
                    }}>
                        Recent Visitors
                    </Typography>

                    <div style={{ flexGrow: 1 }} />

                    <Dropdown items={recent} value={lastVisit} label="Recent" handleItemClick={handleSelectLastVisit} />
                </div>


                {deviceData && <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {getTotalVisitors() > 0 ?
                        <ResponsiveContainer width="100%" height="100%" >
                            <PieChart width={300}
                                height={200} >
                                <Pie
                                    data={deviceData}
                                    innerRadius={40}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell spacing={0} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    <Label content={<CustomLabel value={getTotalVisitors()} />} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        : <span style={{ fontSize: '14px', display: 'flex', margin: 'auto' }}>No Visitors</span>}

                </div>}



                <Typography sx={{
                    display: 'flex', maxWidth: '100%', background: '#F5F9FF', fontWeight: 600,
                    px: 2, py: .5, color: 'primary.main', fontSize: 13
                }}>
                    Device
                </Typography>

                {deviceData && <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    {deviceData.map((item, index) => {
                        return <div key={index} style={{
                            display: 'flex', alignItems: 'center',
                            flexDirection: 'column', marginRight: '24px'
                        }}>
                            <Typography style={{ color: item.color, fontSize: 12 }}>
                                {item.name}
                            </Typography>
                            <Typography style={{ fontSize: 12 }}>
                                ({getPercent(item.name)})
                            </Typography>
                        </div>
                    })}
                </div>}
            </div>
        </div> : <Loader />}


        {sectionData && <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
            {sections.map((section, index) => {
                return (<div key={index} style={{ display: 'flex', maxWidth: 'max-content', flexWrap: 'wrap', padding: '16px' }}>
                    {section.children?.map((item, index) => {
                        return (<div key={index} style={{
                            display: 'flex', flexDirection: 'column', border: '1px solid #1414171A', marginBottom: '12px',
                            boxShadow: '0px 8px 16px 0px #0000000F', marginRight: '12px', borderRadius: '12px'
                        }}>
                            <Box sx={{
                                px: 2, py: 1, display: 'flex', maxWidth: '100%', background: '#F1F7FA',
                                borderRadius: '12px 12px 0 0'
                            }}>
                                {section.icon}   <Typography sx={{
                                    fontWeight: 700, fontSize: 12, ml: 1, color: 'primary.main'
                                }}>
                                    {item.label}
                                </Typography>
                            </Box>
                            {/* Heading */}


                            {/* Children of sub section */}
                            <div style={{ display: 'flex', padding: '12px' }}>
                                {item.children.map((child, index) => {
                                    return <Box component={'a'} href={child.url} key={index} style={{
                                        display: 'flex', background: child.bgcolor, marginRight: '12px', padding: '8px',
                                        flexDirection: 'column', width: '100px', border: '1px solid #1414171A',
                                        boxShadow: '0px 4px 12px 0px #00000008', borderRadius: '8px',
                                        justifyContent: 'center', textAlign: 'center', textDecoration: 'none', color: 'black'
                                    }}>
                                        <Typography sx={{ color: child.color, fontWeight: 600, fontSize: 12, lineHeight: '18px' }}>
                                            {child.label}
                                        </Typography>
                                        <Typography sx={{ fontSize: 19, fontWeight: 700, }}>
                                            {sectionData[item.id][child.id]}
                                        </Typography>
                                    </Box>
                                })}
                            </div>
                        </div>)
                    })}
                </div>)
            })}
        </div>}
    </Box>
}