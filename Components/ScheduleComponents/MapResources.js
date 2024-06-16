import { Close } from "@mui/icons-material";
import { Box, Button, Modal, OutlinedInput, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import FieldLabel from "../FieldLabel/FieldLabel";
import TextRenderer from "../Table/TextRenderer";
import TimeRenderer from "../Table/TimeRenderer";
import MediaRenderer from "../Table/MediaRenderer";
import Table from "../Table";
import checkboxSelection from "@/utils/checkboxSelection";
import headerCheckboxSelection from "@/utils/headerCheckboxSelection";
import ServiceRenderer from "../Table/ServiceRenderer";
import moment from "moment";
import Loader from "../Loader/Loader";
import { postRequestHandler2 } from "../requestHandler";
import WarningModal from "../WarningModal/WarningModal";

export default function MapResources({ open, selectedDate, defaultDate, selectedResourceId, scheduleId, handleClose }) {
    console.log('selectedDate', { selectedDate, selectedResourceId })
    const [date, setDate] = useState(selectedDate || moment(defaultDate, 'DD/MM/yyyy').format('yyyy-MM-DD').toString());

    const [data, setData] = useState(null)
    const [status, setStatus] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showWarning, setShowWarning] = useState(false)

    const [selectedResource, setSelectedResource] = useState(selectedResourceId)

    const handleSelection = (params) => {
        console.log('selected',)
        setSelectedResource(params.data?.id)
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'id',
            headerName: null,
            maxWidth: 50,
            checkboxSelection: false,
            cellRenderer: useCallback(function cellTitle(params) {
                console.log('id of selected', { selectedResource, default: params.data?.id })
               /*  let cellValue = */return <div class="ngSelectionCell"><input name="selected" type="radio"
                    value={params.data?.id}
                    // checked={selectedResource === params.data?.id} id={params.data?.id} value={params.data?.id}
                    // selec
                    onChange={() => { handleSelection(params) }} /></div>;
            }, [selectedResource]),
        },
        {
            field: 'date',
            // maxWidth: 120,
            minWidth: 100,
            cellRenderer: TextRenderer,
            headerName: 'Date',
        },
        {
            field: 'serviceType',
            headerName: 'Service',
            minWidth: 200,
            cellRenderer: ServiceRenderer
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
            cellRenderer: TextRenderer
        },
        {
            field: 'speaker',
            headerName: 'Speaker',
            minWidth: 150,
            cellRenderer: TextRenderer
        },
        {
            field: 'actions',
            sortable: false,
            headerName: '',
            minWidth: 140,
            cellRenderer: MediaRenderer
        },
    ]);

    useEffect(() => {
        if (date) {
            setLoading(true)
            setSelectedResource(null)
            fetch(`/api/resource-for-mapping?date=${date}`, { method: 'GET' }).then(
                async response => {
                    const { result, loginRedirect } = await response.json();
                    loginRedirect && window.location.replace('/login')

                    result && setData(result)
                    setLoading(false)

                    selectedResourceId && setTimeout(() => {
                        const radioToSelect = document.querySelector(`input[value="${selectedResourceId}"]`);
                        radioToSelect.checked = true
                    }, 1000);
                },
                err => { setLoading(false) }
            )

        }

    }, [date])

    const handleChange = (ev) => {
        setDate(ev.currentTarget.value)
    }

    const handleMap = async () => {
        setLoading(true)

        await postRequestHandler2({
            route: `/api/map-to-resource`, body: { resourceId: selectedResource, scheduleId },
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    result && window.location.reload()
                }
                else if (body?.error) {
                    message = body.error
                }
                else {
                    console.log('update failed');
                    message = 'Data was not saved'
                }
                setLoading(false)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
            }
        })
    }

    const handleRemoveMapping = async () => {
        setStatus('submitting')

        await postRequestHandler2({
            route: `/api/remove-mapping`, body: { scheduleId },
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    setStatus(null)
                    window.location.reload()
                }
                else if (body?.error) {
                    message = body.error
                }
                else {
                    console.log('update failed');
                    message = 'Data was not saved'
                }
            },
            errorCallback: err => {
                console.log('something went wrong', err)
            }
        })
    }

    const confirmRemoveMapping = () => {
        setShowWarning(true)
    }

    const handleCloseWarning = () => {
        setStatus(null)
        setShowWarning(false);
    }

    return <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'white', width: '70vw', height: '100vh' }}>
            {/* Heading */}
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 3, borderBottom: '1px solid #1414171A', }}>
                <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: 16 }}>
                    Map Resource
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button disabled={!selectedResourceId} onClick={confirmRemoveMapping}
                    variant='outlined' sx={{
                        fontSize: 13, py: .5, px: 2, color: 'red', border: '1px solid red',
                        fontWeight: 600, borderRadius: '24px', mr: 2, bgcolor: 'white'
                    }}>
                    Remove Mapping
                </Button>

                <Button disabled={!selectedResource} onClick={handleMap}
                    variant='contained' sx={{ fontSize: 13, py: .5, px: 2, fontWeight: 600, borderRadius: '24px' }}>
                    Map
                </Button>

                <Close sx={{ fontSize: 30, cursor: 'pointer', ml: 2, mr: 1 }} onClick={handleClose} />
            </Box>

            {/* Date */}
            <Box sx={{ py: 2, px: 2, width: '70%', mx: 'auto' }}>
                <Box sx={{ pb: 1 }}>
                    <FieldLabel label={'Date'} />
                </Box>

                <OutlinedInput
                    fullWidth variant={'outlined'}
                    type='date'
                    placeholder={'date'} sx={{
                        fontSize: 14, height: 'inherit',
                        background: 'white', fontWeight: 500
                    }}
                    value={date}
                    onChange={handleChange}
                />
            </Box>

            {/* Table */}
            <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                {loading ? <Loader /> : data && <Table headingArray={columnDefs}
                    setValueSummary={() => { }} currentTab={'all'} tabKey="types"
                    editUrl={'/admin/resources/all-resources/edit'}
                    floatingActions={[/* 'edit', 'view', 'delete', 'deleteAll', 'publish', 'unpublish' */]}
                    closeFilter={() => { }} showFilter={false}
                    filterTemplate={{}} filterRows={{}}
                    // valuesURL={'/api/all-resources'}
                    showTableAction={false}
                    title={'Resource'}
                    valuesArray={data} />}
            </Box>

            {showWarning && <WarningModal
                title={'Remove Mapping'} open={showWarning}
                message={'You are about to remove the mapping for this schedule'} status={status}
                proceedAction={async () => { await handleRemoveMapping() }} handleCancel={handleCloseWarning} />}


        </Box>
    </Modal>
}