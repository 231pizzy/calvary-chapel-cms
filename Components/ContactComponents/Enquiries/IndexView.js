import { useEffect, useState } from "react";
import FilterTextMatcher from "@/Components/Table/FilterTextMatcher";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import TextRenderer from "@/Components/Table/TextRenderer";
import { Box, Button } from "@mui/material";
import Table from "@/Components/Table";
import StatusRenderer from "@/Components/Table/StatusRenderer";
import { useRouter, useSearchParams } from "next/navigation";
import BooleanMatcher from "@/Components/Table/BooleanMatcher";

export default function EnquiriesIndex({ closeFilter, showFilter }) {
    const router = useRouter();
    const status = useSearchParams().get('status')

    const [currentTab, setCurrentTab] = useState('all');
    const [data, setData] = useState([]);

    const [summary, setSummary] = useState({
        all: 0, read: 0, unread: 0, replied: 0
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
            field: 'name',
            minWidth: 150,
            cellRenderer: TextRenderer,
            cellRendererParams: {
                capitalize: true
            },
            headerName: 'Name',
        },
        {
            field: 'email',
            minWidth: 150,
            cellRenderer: TextRenderer,
            headerName: 'Email',
        },
        {
            field: 'topic',
            headerName: 'Topic',
            minWidth: 110,
            filter: 'agTextColumnFilter',
            filterParams: BooleanMatcher,
            cellRenderer: TextRenderer
        },
        {
            field: 'message',
            minWidth: 230,
            cellRenderer: TextRenderer,
            headerName: 'Message',
        },
        {
            field: 'date',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerName: 'Date',
        },
        {
            field: 'hasTopic',
            headerName: 'Topic',
            hide: true,
            filter: 'agTextColumnFilter',
            filterParams: BooleanMatcher,
        },
        {
            field: 'time',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerName: 'Time',
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 110,
            filter: 'agTextColumnFilter',
            filterParams: FilterTextMatcher,
            cellRenderer: StatusRenderer
        },
    ]);

    const filterRows = [
        { value: 'status', label: 'Status', type: 'checkbox', renderer: 'status' },
        {
            value: 'hasTopic', label: 'Type', type: 'checkbox', valueSet: [
                { value: true, label: 'With Prayer Request Topic' },
                { value: false, label: 'Without Prayer Request Topic' },
            ]
        },
        { value: 'topic', label: 'Contact Form Topic', type: 'checkbox',/*  renderer: 'speaker' */ },
    ]

    const filterTemplate = {
        status: {
            filterType: 'text',
            type: 'equals',
        },
        hasTopic: {
            filterType: 'text',
            type: 'equals',
        },
        topic: {
            filterType: 'text',
            type: 'equals',
        },
    }


    const handleRowClick = (id) => {
        router.push(`/admin/contact/view?id=${id}`)
    }

    const handleChangeTab = (id) => {
        setCurrentTab(id);
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
        { id: 'read', label: 'Read', type: 'status' },
        { id: 'unread', label: 'Unread', type: 'status' },
        { id: 'replied', label: 'Replied', type: 'status' },
    ]

    const setSummaryValues = ({ read, unread, replied, total }) => {
        setSummary({ read, unread, replied, all: total })
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
                setValueSummary={setSummaryValues} currentTab={currentTab}
                floatingActions={['view', 'delete', 'deleteAll', 'markAsRead', 'markAsUnread']}
                closeFilter={closeFilter} showFilter={showFilter}
                filterTemplate={filterTemplate} filterRows={filterRows}
                viewUrl={'/admin/contact/view'}
                onRowClicked={handleRowClick}
                valuesURL={status ? `/api/messages?status=${status}` : '/api/messages'}
                showTableAction={true}
                title={'Enquiry'}
                deleteEndpoint={'/api/delete-message'}
                markAsReadEndpoint={'/api/mark-as-read'}
                markAsUnreadEndpoint={'/api/mark-as-unread'}
                valuesArray={data} />}
        </Box>
    </Box>
}