import { useState } from "react";
import FilterTextMatcher from "@/Components/Table/FilterTextMatcher";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import AvatarRenderer from "@/Components/Table/AvatarRenderer";
import TextRenderer from "@/Components/Table/TextRenderer";
import { Box } from "@mui/material";
import Table from "@/Components/Table";
import { useRouter } from "next/navigation";

export default function AdminIndex({ }) {
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
            field: 'profilePicture',
            maxWidth: 100,
            minWidth: 100,
            cellRenderer: AvatarRenderer,
            headerName: 'Avatar',
        },
        {
            field: 'fullName',
            headerName: 'Name',
            minWidth: 150,
            cellRenderer: TextRenderer
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 150,
            cellRenderer: TextRenderer
        },
    ]);

    const handleRowClick = (id) => {
        router.push(`/admin/admin/view?id=${id}`)
    }

    return <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ height: 'calc(100vh - 70px)', width: '100%' }}>
            {data && <Table headingArray={columnDefs}
                setValueSummary={() => { }} currentTab={'all'}
                editUrl={'/admin/admin/edit'}
                floatingActions={['view', 'edit', 'delete', 'deleteAll']}
                closeFilter={() => { }} showFilter={false}
                filterTemplate={{}} filterRows={{}}
                viewUrl={'/admin/admin/view'}
                valuesURL={'/api/admins'} showTableAction={true}
                title={'Admin'}
                onRowClicked={handleRowClick}
                deleteEndpoint={'/api/delete-admin'}
                valuesArray={data} />}
        </Box>
    </Box>
}