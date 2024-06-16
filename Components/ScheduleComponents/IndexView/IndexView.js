import { useState } from "react";
import FilterTextMatcher from "@/Components/Table/FilterTextMatcher";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import TextRenderer from "@/Components/Table/TextRenderer";
import { Box, Button } from "@mui/material";
import Table from "@/Components/Table";
import DateRenderer from "@/Components/Table/DateRenderer";
import StatusRenderer from "@/Components/Table/StatusRenderer";
import DropdownRenderer from "@/Components/Table/DropdownRenderer";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import { useRouter, useSearchParams } from "next/navigation";
import DateMatcher from "@/Components/Table/DateMatcher";
import TimeMatcher from "@/Components/Table/TimeMatcher";
import DurationMatcher from "@/Components/Table/DurationMatcher";
import { getLocalTime } from "@/utils/getLocalTime";
import TimeRenderer from "@/Components/Table/TimeRenderer";

export default function ScheduleIndex({ closeFilter, showFilter }) {
    const router = useRouter();
    const status = useSearchParams().get('status')

    const [currentTab, setCurrentTab] = useState('all');
    const [data, setData] = useState([]);

    const [summary, setSummary] = useState({
        all: 0, published: 0, unpublished: 0,
        cancelled: 0, now: 0, concluded: 0, justConcluded: 0
    })

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
            field: 'time',
            //   maxWidth: 120,
            minWidth: 90,
            filter: 'agTextColumnFilter',
            filterParams: TimeMatcher,
            valueFormatter: (prop) => getLocalTime({
                date: prop?.data?.date, time: prop?.value, timeFormat: 'h:mma',
                dateFormat: 'DD/MM/yyyy', outputFormat: 'h:mma', type: 'time'
            }) /* { console.log('value formter prop', prop) } */,
            cellRenderer: TimeRenderer,
            headerName: 'Time',
        },
        {
            field: 'duration',
            headerName: 'Duration',
            filter: 'agTextColumnFilter',
            filterParams: DurationMatcher,
            minWidth: 130,
            cellRenderer: TextRenderer
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
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
            minWidth: 150,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            cellRenderer: StatusRenderer
        }, {
            field: 'frequency',
            headerName: 'Occurence',
            // hide: true,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            minWidth: 110,
            cellRenderer: TextRenderer
        },
        {
            field: 'decision',
            headerName: 'Decision',
            minWidth: 150,
            cellRendererParams: {
                publishEndpoint: '/api/publish-schedule',
                unPublishEndpoint: '/api/unpublish-schedule',
                cancelEndpoint: '/api/cancel-schedule',
                title: 'Schedule', id: 'schedule',
            },
            cellRenderer: DropdownRenderer
        },
    ]);

    const filterRows = [
        { value: 'date', label: 'Date', type: 'datebox' },
        { value: 'time', label: 'Time', type: 'timebox' },
        { value: 'duration', label: 'Duration', type: 'duration' },
        { value: 'status', label: 'Status', type: 'checkbox', renderer: 'status' },
        { value: 'serviceType', label: 'Service Type', type: 'checkbox', renderer: 'serviceType' },
        { value: 'speaker', label: 'Speaker', type: 'checkbox',/*  renderer: 'speaker' */ },
        { value: 'frequency', label: 'Schedule Occurrence Type', type: 'checkbox' },
    ]

    const filterTemplate = {
        date: {
            filterType: 'text',
            type: 'contains',
        },
        time: {
            filterType: 'text',
            type: 'equals',
        },
        duration: {
            filterType: 'text',
            type: 'equals',
        },
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
        frequency: {
            filterType: 'text',
            type: 'equals',
        },
    }

    const handleChangeTab = (id) => {
        setCurrentTab(id);
    }

    const handleRowClick = (id) => {
        router.push(`/admin/schedule/view?id=${id}`)
    }

    const TabButton = ({ label, id, image, handleClick }) => {
        const selected = currentTab === id;
        return <Button onClick={handleClick} sx={{
            bgcolor: selected ? 'secondary.main' : 'white', color: selected ? 'primary.main' : '#282828',
            fontSize: '12px', px: 2, py: 1, cursor: 'pointer', borderRight: '2px solid #F3F3F3',
            minWidth: 'max-content', display: 'flex', alignItems: 'center'
        }}>
            {label}
        </Button>
    }

    const tabs = [
        { id: 'all', label: 'All', type: 'status' },
        { id: 'published', label: 'Published', type: 'status' },
        { id: 'unpublished', label: 'Unpublished', type: 'status' },
        { id: 'cancelled', label: 'Cancelled', type: 'status' },
        { id: 'now', label: 'Happening Now', type: 'status' },
        { id: 'concluded', label: 'Concluded', type: 'status' },
        { id: 'justConcluded', label: 'Just Concluded', type: 'status' },
    ]

    const setSummaryValues = ({ published, unpublished, cancelled, now, total, concluded, justConcluded }) => {
        setSummary({ published, unpublished, cancelled, now, all: total, concluded, justConcluded })
    }

    return <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box sx={{
            display: 'flex', alignItems: 'center',
            borderRight: '1px solid #1C1D221A', maxWidth: '99%', overflowX: 'auto', flexWrap: 'wrap'
        }}>
            {tabs.map((item, index) => {
                return <TabButton handleClick={() => {
                    handleChangeTab(item.id)
                }}
                    key={index}
                    label={`${item?.label} (${summary[item.id]})`}
                    image={item?.image}
                    id={item?.id}
                />
            })}
        </Box>

        <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            {data && <Table headingArray={columnDefs}
                setValueSummary={setSummaryValues} currentTab={currentTab} tabKey={'status'}
                editUrl={'/admin/schedule/edit'}
                floatingActions={['edit', 'view', 'delete', 'deleteAll', 'publish', 'unpublish', 'cancel']}
                closeFilter={closeFilter} showFilter={showFilter}
                filterTemplate={filterTemplate} filterRows={filterRows}
                viewUrl={'/admin/schedule/view'}
                publishEndpoint={'/api/publish-schedule'}
                unpublishEndpoint={'/api/unpublish-schedule'}
                cancelEndpoint={'/api/cancel-schedule'}
                //onRowClicked={handleRowClick}
                valuesURL={status ? `/api/all-schedule?status=${status}` : '/api/all-schedule'}
                showTableAction={true}
                title={'Schedule'}
                deleteEndpoint={'/api/delete-schedule'}
                valuesArray={data} />}
        </Box>
    </Box>
}