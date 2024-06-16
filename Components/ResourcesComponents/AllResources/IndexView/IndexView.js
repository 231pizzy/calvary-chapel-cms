import { useEffect, useState } from "react";
import FilterTextMatcher from "@/Components/Table/FilterTextMatcher";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import TextRenderer from "@/Components/Table/TextRenderer";
import { Avatar, Box, Button } from "@mui/material";
import Table from "@/Components/Table";
import StatusRenderer from "@/Components/Table/StatusRenderer";
import DropdownRenderer from "@/Components/Table/DropdownRenderer";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import { useRouter, useSearchParams } from "next/navigation";
import DateMatcher from "@/Components/Table/DateMatcher";
import { BibleDynSvg, BibleStudyDynSvg, CharacterStudiesDynSvg, ConferenceDynSvg, GuestSpeakerDynSvg, PulpitDynSvg, TopicalStudiesDynSvg } from "@/public/icons/icons";
import MediaRenderer from "@/Components/Table/MediaRenderer";
import FilterArrayMatcher from "@/Components/Table/FilterArrayMatcher";
import { bibleData } from "../bible";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export default function ResourceIndex({ closeFilter, showFilter }) {
    const router = useRouter();
    const status = useSearchParams().get('status')

    const [currentTab, setCurrentTab] = useState('all');
    const [data, setData] = useState([]);
    const [currentSubTab, setCurrentSubTab] = useState(null);
    const [currentSubTabValue, setCurrentSubTabValue] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const [guestSpeakers, setGuestSpeakers] = useState(null);
    const [bibleCharacters, setBibleCharacters] = useState(null);
    const [topicalStudies, setTopicalStudies] = useState(null);
    const [conferences, setConferences] = useState(null);

    const [summary, setSummary] = useState({
        all: 0, 'verse-by-verse': 0, 'wednesday-service': 0, 'conferences': 0,
        'sunday-service': 0, 'guest-speakers': 0, 'character-studies': 0, 'topical-studies': 0
    })


    const [tabKey, setTabKey] = useState('types');
    const [tabValue, setTabValue] = useState('all');
    const [searchValue, setSearchValue] = useState('all');

    const [newTestamentCount, setNewTestamentCount] = useState(0)
    const [oldTestamentCount, setOldTestamentCount] = useState(0)
    const [oldTestamentBooksCount, setOldTestamentBooksCount] = useState({})
    const [newTestamentBooksCount, setNewTestamentBooksCount] = useState({})
    const [guestSpeakerCounts, setGuestSpeakerCounts] = useState({})
    const [characterStudiesCounts, setCharacterStudiesCounts] = useState({})
    const [topicalStudiesCount, setTopicalStudiesCount] = useState({})
    const [conferenceCounts, setConferenceCounts] = useState({})

    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'id',
            headerName: null,
            maxWidth: 50,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            checkboxSelection: checkboxSelection,
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: headerCheckboxSelection,
        },
        {
            field: 'date',
            // maxWidth: 120,
            minWidth: 100,
            cellRenderer: TextRenderer,
            filter: 'agTextColumnFilter',
            filterParams: DateMatcher,
            headerName: 'Date',
        },
        {
            field: 'scripture',
            minWidth: 150,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            cellRenderer: TextRenderer,
            cellRendererParams: {
                capitalize: true
            },
            headerName: 'Scripture',
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            cellRenderer: TextRenderer
        },
        {
            field: 'serviceType',
            headerName: 'Service',
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            minWidth: 200,
            cellRenderer: ServiceRenderer
        },
        {
            field: 'speaker',
            headerName: 'Speaker',
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            minWidth: 150,
            cellRenderer: TextRenderer
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 110,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            cellRenderer: StatusRenderer
        },
        {
            field: 'bibleCharacter',
            headerName: 'Character',
            hide: true,
            filter: 'agTextColumnFilter',
            filterParams: FilterArrayMatcher,
        },
        {
            field: 'topicalStudies',
            headerName: 'Topics',
            hide: true,
            filter: 'agTextColumnFilter',
            filterParams: FilterArrayMatcher,
        },
        {
            field: 'media',
            headerName: 'Media',
            hide: true,
            valueFormatter: (prop) => Object.keys(prop.value ?? {})?.filter(i => prop.value[i]),
            filter: 'agTextColumnFilter',
            filterParams: FilterArrayMatcher,
        },
        {
            field: 'testament',
            headerName: 'Testament',
            hide: true,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
        },
        {
            field: 'decision',
            headerName: 'Decision',
            minWidth: 130,
            cellRendererParams: {
                publishEndpoint: '/api/publish-resource',
                unPublishEndpoint: '/api/unpublish-resource',
                title: 'Resource', id: 'resource',
            },
            cellRenderer: DropdownRenderer
        },
        {
            field: 'actions',
            sortable: false,
            headerName: '',
            minWidth: 140,
            cellRenderer: MediaRenderer
        },
    ]);


    const filterRows = [
        { value: 'date', label: 'Date', type: 'datebox' },
        { value: 'testament', label: 'Scripture', type: 'checkbox' },
        // { value: 'title', label: 'Title', type: 'textbox' },
        { value: 'status', label: 'Status', type: 'checkbox', renderer: 'status' },
        { value: 'serviceType', label: 'Service Type', type: 'checkbox', renderer: 'serviceType' },
        { value: 'speaker', label: 'Speaker', type: 'checkbox',/*  renderer: 'speaker' */ },
        { value: 'bibleCharacter', label: 'Bible Character', type: 'checkbox' },
        { value: 'topicalStudies', label: 'Topial Character', type: 'checkbox' },
        {
            value: 'media', label: 'Media', type: 'checkbox', renderer: 'media', valueSet: [
                { value: 'video', label: 'Video' },
                { value: 'audio', label: 'Audio' },
                { value: 'audioDownload', label: 'Audio Download' },
                { value: 'documentDownload', label: 'Document' },
            ]
        },
    ]

    const filterTemplate = {
        date: {
            filterType: 'text',
            type: 'contains',
        },
        testament: {
            filterType: 'text',
            type: 'equals',
        },
        /*    title: {
               filterType: 'text',
               type: 'equals',
           }, */
        status: {
            filterType: 'text',
            type: 'equals',
        },
        serviceType: {
            filterType: 'text',
            type: 'equals',
        },
        speaker: {
            filterType: 'text',
            type: 'equals',
        },
        bibleCharacter: {
            filterType: 'text',
            type: 'equals',
        },
        topicalStudies: {
            filterType: 'text',
            type: 'equals',
        },
        /*  media: {
             filterType: 'text',
             type: 'equals',
         }, */
    }

    //get the data required
    useEffect(() => {
        fetch('/api/data-for-resource-index', { method: 'GET' }).then(
            async response => {
                const { result, loginRedirect } = await response.json();

                loginRedirect && window.location.replace('/login')

                if (result) {
                    setGuestSpeakers(result?.guestSpeakers);
                    setBibleCharacters(result?.bibleCharacters);
                    setConferences(result?.conferences);
                    setTopicalStudies(result?.topicalStudies)
                }
            }
        )
    }, [])


    const handleRowClick = (id) => {
        router.push(`/admin/resources/view?id=${id}`)
    }

    const handleChangeTab = (id, searchValue, type) => {
        setCurrentTab(id);
        setTabValue(id)
        setCurrentSubTab(searchValue);
        setTabKey(type)
        setSearchValue(searchValue)
    }

    const handleChangeSubTab = (id, firstGrandChildId, searchValue, type) => {
        setCurrentSubTab(id);
        setCurrentSubTabValue(firstGrandChildId)
        setTabValue(id)
        setTabKey(type)
        setSearchValue(searchValue)
    }

    const handleChangeSubTabValue = (id, searchValue, type) => {
        setCurrentSubTabValue(id);
        setTabValue(id)
        setTabKey(type)
        setSearchValue(searchValue)
    }

    const TabButton = ({ label, id, icon, handleClick }) => {
        const selected = currentTab === id;
        return <Button variant="contained" onClick={handleClick} sx={{
            background: selected ? '#F5F9FF' : '#F3F3F3', color: selected ? '#0E60BF' : '#282828',
            fontSize: '12px', px: 1, py: .3, cursor: 'pointer', borderRadius: '24px', mr: 1.5,
            // border: '1px solid #FFC326', 
            minWidth: 'max-content'
        }}>
            {icon}  {label}
        </Button>
    }

    const SubTab = ({ label, id, image, handleClick }) => {
        const selected = currentSubTab === id;
        return <Button onClick={handleClick} sx={{
            bgcolor: selected ? 'secondary.main' : 'white', color: selected ? 'primary.main' : '#282828',
            fontSize: '12px', px: 2, py: 1, cursor: 'pointer', borderRight: '2px solid #F3F3F3',
            minWidth: 'max-content', display: 'flex', alignItems: 'center'
        }}>
            {image && <Avatar src={image} sx={{ height: 20, width: 20, mr: 1 }} />}  {label}
        </Button>
    }

    const SubTabValue = ({ label, id, image, handleClick }) => {
        const selected = currentSubTabValue === id;
        return <Button variant="contained" onClick={handleClick} sx={{
            bgcolor: selected ? 'primary.main' : 'white', color: selected ? 'white' : '#282828',
            fontSize: '12px', px: 1, py: .3, cursor: 'pointer', borderRadius: '24px', mr: 1.5,
            minWidth: 'max-content', display: 'flex', alignItems: 'center', my: 1
        }}>
            {image && <Avatar src={image} sx={{ height: 20, width: 20 }} />}  {label}
        </Button>
    }

    const toggleShowAll = () => {
        setShowAll(!showAll)
    }


    const iconStyle = { height: '15px', width: '15px', marginRight: '8px' }

    const tabs = [
        { id: 'all', label: 'All', type: 'types' /* icon: <BibleDynSvg style={iconStyle} /> */ },
        {
            id: 'verse-by-verse', label: 'Verse By Verse', type: 'types', icon: <BibleDynSvg style={iconStyle} />, children: [
                {
                    id: 'old testament', label: 'Old Testament', count: oldTestamentCount, type: 'testament',
                    children: Object.keys(bibleData["old testament"])?.map(book => {
                        return { id: book, count: oldTestamentBooksCount[book], label: book, type: 'bookOfScripture' }
                    })
                },
                {
                    id: 'new testament', label: 'New Testament', count: newTestamentCount, type: 'testament',
                    children: Object.keys(bibleData["new testament"])?.map(book => {
                        return { id: book, count: newTestamentBooksCount[book], label: book, type: 'bookOfScripture' }
                    })
                },
            ]
        },
        { id: 'wednesday-service', type: 'types', label: 'Wednesday Service', icon: <BibleStudyDynSvg style={iconStyle} /> },
        { id: 'sunday-service', type: 'types', label: 'Sunday Service', icon: <PulpitDynSvg style={iconStyle} /> },
        {
            id: 'guest-speakers', type: 'speaker', label: 'Guest Speakers', icon: <GuestSpeakerDynSvg style={iconStyle} />,
            children: guestSpeakers && guestSpeakers?.map(i => {
                return { id: i?.name, count: guestSpeakerCounts[i?.name], label: i?.name, type: 'speaker', image: i?.image }
            })
        },
        {
            id: 'character-studies', type: 'isThereCharacterStudies', label: 'Character Studies', icon: <CharacterStudiesDynSvg style={iconStyle} />,
            children: bibleCharacters && bibleCharacters?.map(i => {
                return { id: i, label: i, count: characterStudiesCounts[i], type: 'bibleCharacter' }
            })
        },
        {
            id: 'topical-studies', type: 'isThereTopicalStudies', label: 'Topical Studies', icon: <TopicalStudiesDynSvg style={iconStyle} />,
            children: topicalStudies && topicalStudies?.map(i => {
                return { id: i?.name, count: topicalStudiesCount[i?.name], label: i?.name, type: 'topicalStudies' }
            })
        },
        {
            id: 'conferences', type: 'types', label: 'Conferences', icon: <ConferenceDynSvg style={iconStyle} />,
            children: conferences && Object.keys(conferences)?.map(i => {
                const data = conferences[i];
                return {
                    id: i, label: i, count: Object.keys(conferenceCounts[i] ?? {})?.length, type: 'conferences',
                    children: data?.filter(i => i?.name)?.map(it => {
                        return {
                            id: it?.id, type: 'conferences', count: (conferenceCounts[i] ?? {})[it?.id],
                            label: it?.name
                        }
                    })
                }
            })
        },
    ]

    // console.log('tab data', tabs)

    const children = tabs.find(i => i?.id === currentTab)?.children;

    const grandChildren = children?.find(i => i?.id === currentSubTab)?.children

    const setSummaryValues = ({ verseByVerse, wednesdayService, conferences, sundayService, total, guestSpeakers,
        characterStudies, topicalStudies, newTestamentCount, oldTestamentCount, guestSpeakerCounts, characterStudiesCounts,
        topicalStudiesCount, conferenceCounts, newTestamentBooksCount, oldTestamentBooksCount }) => {
        setSummary({
            all: total, 'verse-by-verse': verseByVerse, 'wednesday-service': wednesdayService, conferences,
            'sunday-service': sundayService, 'guest-speakers': guestSpeakers, 'character-studies': characterStudies,
            'topical-studies': topicalStudies
        });
        setNewTestamentCount(newTestamentCount); setOldTestamentCount(oldTestamentCount);
        setGuestSpeakerCounts(guestSpeakerCounts); setCharacterStudiesCounts(characterStudiesCounts);
        setTopicalStudiesCount(topicalStudiesCount); setConferenceCounts(conferenceCounts);
        setNewTestamentBooksCount(newTestamentBooksCount); setOldTestamentBooksCount(oldTestamentBooksCount)
    }

    return <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{
            display: 'flex', alignItems: 'center', p: 1, justifyContent: 'space-between',
            borderRight: '1px solid #1C1D221A', maxWidth: '99%', overflowX: 'auto',
            borderBottom: '2px solid #F3F3F3'
        }}>
            {tabs.map((item, index) => {
                return <TabButton handleClick={() => {
                    handleChangeTab(item.id,
                        (item?.children ?? [])[0]?.id || item?.id,
                        (item?.children ?? [])[0]?.type || item?.type)
                }}
                    key={index}
                    label={`${item?.label} (${summary[item.id]})`}
                    icon={item?.icon}
                    id={item?.id}
                />
            })}
        </Box>

        {Boolean(children?.length) && <Box sx={{
            display: 'flex', alignItems: 'center',
            borderRight: '1px solid #1C1D221A', maxWidth: '99%', overflowX: 'auto', flexWrap: 'wrap'
        }}>
            {children.map((item, index) => {
                return <SubTab handleClick={() => {
                    handleChangeSubTab(item.id,
                        (item?.children ?? [])[0]?.id,
                        (item?.children ?? [])[0]?.id || item?.id,
                        (item?.children ?? [])[0]?.type || item?.type)
                }}
                    key={index}
                    label={`${item?.label} (${item?.count || 0})`}
                    image={item?.image}
                    id={item?.id}
                />
            })}
        </Box>}

        {Boolean(grandChildren?.length) && <Box sx={{
            display: 'flex', alignItems: 'center', px: 2, flexWrap: 'wrap',
            maxHeight: /* showAll ?  */'max-content' /* : '50px' */, position: 'relative',
            borderRight: '1px solid #1C1D221A', maxWidth: '100%', bgcolor: 'secondary.main'
        }}>
            {(showAll ? grandChildren : grandChildren?.slice(0, 12)).map((item, index) => {
                return <SubTabValue handleClick={() => { handleChangeSubTabValue(item.id, item?.id, item?.type) }}
                    key={index}
                    label={`${item?.label} (${item?.count || 0})`}
                    image={item?.image}
                    id={item?.id}
                />
            })}

            <Box sx={{ ml: 'auto' }} />

            <Button variant="text" sx={{
                bgcolor: 'secondary.main', display: 'flex', alignItems: 'flex-start',
                fontSize: 11, fontWeight: 600, position: 'sticky', right: 0, py: .4,
                bottom: 0,
            }} onClick={toggleShowAll}>
                {showAll ? 'Show less' : 'Show all'} {showAll ? <ArrowDropUp /> : <ArrowDropDown />}
            </Button>
        </Box>}

        <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            {data && <Table headingArray={columnDefs}
                setValueSummary={setSummaryValues} currentTab={searchValue} tabKey={tabKey}
                editUrl={'/admin/resources/all-resources/edit'}
                floatingActions={['edit', 'view', 'delete', 'deleteAll', 'publish', 'unpublish']}
                closeFilter={closeFilter} showFilter={showFilter}
                filterTemplate={filterTemplate} filterRows={filterRows}
                viewUrl={'/admin/resources/all-resources/view'}
                publishEndpoint={'/api/publish-resource'}
                unpublishEndpoint={'/api/unpublish-resource'}
                //onRowClicked={handleRowClick}
                valuesURL={status ? `/api/all-resources?status=${status}` : '/api/all-resources'} showTableAction={true}
                title={'Resource'}
                deleteEndpoint={'/api/delete-resource'}
                valuesArray={data} />}
        </Box>
    </Box>
}