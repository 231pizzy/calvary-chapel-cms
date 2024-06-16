import { useState } from "react";
import FilterTextMatcher from "@/Components/Table/FilterTextMatcher";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import TextRenderer from "@/Components/Table/TextRenderer";
import { Box, Button, Typography, } from "@mui/material";
import Table from "@/Components/Table";
import { useRouter } from "next/navigation";
import DateMatcher from "@/Components/Table/DateMatcher";
import { FaithSvgDyn } from "@/public/icons/icons";

export default function Index({ closeFilter, showFilter }) {
    const router = useRouter();

    const [data, setData] = useState([]);

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
            field: 'title',
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerName: 'Title',
        },
    ]);


    const handleRowClick = (id) => {
        router.push(`/admin/contact/prayer-request-topics/view?id=${id}`)
    }

    return <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'center', py: 3, px: 2 }}>

            <Typography sx={{
                fontSize: 13, justifySelf: 'center', fontWeight: 600,
                width: '100%', display: 'flex', justifyContent: 'center'
            }}>
                Contact Form Option
            </Typography>

            <Button href='/admin/contact/prayer-request-topics/add-topic' variant='contained'
                sx={{
                    display: 'flex', maxWidth: 'max-content', alignItems: 'center', mr: 2, minWidth: 'max-content',
                    borderRadius: '16px', px: 1.5, py: .5, fontSize: 12, justifySelf: 'flex-end',
                    position: 'absolute', right: 0
                }}>
                {/* <FaithSvgDyn style={{ height: '15px', width: '15px', marginRight: '8px' }} />  */} Add New Contact Form Option
            </Button>

        </Box>

        <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            {data && <Table headingArray={columnDefs}
                setValueSummary={() => { }} currentTab={'all'}
                editUrl={'/admin/contact/prayer-request-topics/add-topic'}
                floatingActions={['edit', 'view', 'delete', 'deleteAll']}
                closeFilter={() => { }} showFilter={false}
                filterTemplate={{}} filterRows={{}}
                viewUrl={'/admin/contact/prayer-request-topics/view'}
                onRowClicked={handleRowClick}
                valuesURL={'/api/all-prayer-request-topics'} showTableAction={true}
                title={'Contact Form Option'}
                deleteEndpoint={'/api/delete-prayer-request-topic'}
                valuesArray={data} />}
        </Box>
    </Box>
}