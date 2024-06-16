import { AgGridReact } from 'ag-grid-react';
//import 'ag-grid-enterprise';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import style from './styles.module.css'

import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
    useEffect,
} from 'react';
//import Filter from '../Filter';
import moment from 'moment';
//import CMSFloatingActionBar from '../CMSFloatingActionBar';

import CloseIcon from '@mui/icons-material/Cancel';
import CMSFloatingActionBar from '../CMSFloatingActionBar';
import Filter from '../Filter';
import { Button, Typography } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';

var checkboxSelection = function (params) {
    // we put checkbox on the name if we are not doing grouping
    return params.columnApi.getRowGroupColumns().length === 0;
};

var headerCheckboxSelection = function (params) {
    // we put checkbox on the name if we are not doing grouping
    return params.columnApi.getRowGroupColumns().length === 0;
};


const Table = ({ headingArray, valuesArray, valuesURL, viewUrl, noPagination, filterTemplate, filterRows, showTableAction,
    editUrl, title, setValueSummary, currentTab, tabKey = 'status', showFilter, closeFilter, filterisGrouped, perPage,
    customHeader, selectRows, currentlySelectedRows, floatingActions, hasGroupedHeading, deleteEndpoint,
    notifyUrl, replyUrl, markAsReadEndpoint, markAsUnreadEndpoint, publishEndpoint, unpublishEndpoint,
    exportColumnArray, exportHeading, exportHeadingsArray, exportCellRenderer, exportCellWidths, searchEndPoint,
    dataEndpoint, downloadHeadingArray, downloadCellRenderer, downloadCellWidths, cancelEndpoint,
    downloadColumnIds, zipExportColumnArray, zipExportTitle, zipExportFormat, onRowClicked = () => { },
    zipExportEndpoint, zipExportSections }) => {


    const containerStyle = useMemo(() => ({ width: '100%', height: '100%', position: 'relative', }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [columnDefs, setColumnDefs] = useState([]);
    const [selectItemsRows, setSelectedRows] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(perPage ?? 10)

    const [selectedFilters, setSelectedFilters] = useState(null);

    const [filterBarData, setFilterBarData] = useState([]);

    const [read, setRead] = useState(false);
    const [replied, setReplied] = useState(false);
    const [published, setPublished] = useState(false);
    const [eligible, setEligible] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [votingEligible, setVotingEligible] = useState(false);
    const [defaultEmail, setDefaultEmail] = useState(false);


    const [includesJustConcluded, setIncludesJustConcluded] = useState(false);
    const [includesConcluded, setIncludesConcluded] = useState(false);



    const [status, setStatus] = useState(null);

    const [draftId, setDraftId] = useState(null)
    const [fundStage, setFundStage] = useState(null)

    const gridRef = useRef();

    useEffect(() => {
        if (headingArray) setColumnDefs(headingArray)

        setItemsPerPage(perPage ?? Math.ceil(window.innerHeight / 50))
    }, []);

    const defaultColDef = useMemo(() => {
        return {
            editable: false,
            sortable: true,
            domLayout: 'autoHeight',
            menuTabs: [],
            resizable: true,
            cellStyle: { fontSize: '12px' },
            flex: 1,
            headerCellClass: 'header-cell',
            minWidth: 80,
        };
    }, []);

    const getNewRowData = (currentTab, rowData) => {
        //  console.log('getting new row data', { currentTab, tabKey, types: rowData[0] && rowData[0]?.types, isArray: Array.isArray(rowData[0]?.types), exists: rowData[0]?.types?.includes(currentTab) })
        return rowData.filter(item => currentTab === 'all' ? true : Array.isArray(item[tabKey]) ? item[tabKey].includes(currentTab) : (item[tabKey]?.toString() === currentTab?.toString()))
    }

    const processRows = (rowData, currentTab) => {
        if (rowData?.length) {
            const guestSpeakerCounts = {};
            const characterStudiesCounts = {}
            const topicalStudiesCount = {}
            const conferenceCounts = {}
            const newTestamentBooksCount = {};
            const oldTestamentBooksCount = {};

            getNewRowData(currentTab, rowData)?.forEach(item => {
                guestSpeakerCounts[item?.speaker] = (guestSpeakerCounts[item?.speaker] ?? 0) + 1;
                item?.bibleCharacter?.forEach(t => characterStudiesCounts[t] = (characterStudiesCounts[t] ?? 0) + 1);
                item?.topicalStudies?.forEach(t => topicalStudiesCount[t] = (topicalStudiesCount[t] ?? 0) + 1);
                conferenceCounts[item?.conference]
                    ? conferenceCounts[item?.conference][item?.conferences] = (conferenceCounts[item?.conference][item?.conferences] ?? 0) + 1
                    : conferenceCounts[item?.conference] = { [item?.conferences]: 1 };
                item?.testament === 'new testament' && (newTestamentBooksCount[item?.bookOfScripture] = (newTestamentBooksCount[item?.bookOfScripture] ?? 0) + 1);
                item?.testament === 'old testament' && (oldTestamentBooksCount[item?.bookOfScripture] = (oldTestamentBooksCount[item?.bookOfScripture] ?? 0) + 1);
            });

            setValueSummary({
                total: getNewRowData(currentTab, rowData)?.length,
                read: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'read')?.length,
                unread: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'unread')?.length,
                replied: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'replied')?.length,
                title: rowData[0]?.fundTitle,
                date: !rowData[0]?.startDate ? null : `${moment(rowData[0]?.startDate).format('DD/MM/yyyy')} - ${moment(rowData[0]?.endDate).format('DD/MM/yyyy')}`,
                published: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'published')?.length,
                unpublished: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'unpublished')?.length,
                cancelled: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'cancelled')?.length,
                now: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'now')?.length,
                concluded: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'concluded')?.length,
                justConcluded: getNewRowData(currentTab, rowData)?.filter(item => item?.status === 'justConcluded')?.length,
                verseByVerse: getNewRowData(currentTab, rowData)?.length,
                wednesdayService: getNewRowData(currentTab, rowData)?.filter(item => item?.serviceType === 'wednesday-service')?.length,
                conferences: getNewRowData(currentTab, rowData)?.filter(item => item?.serviceType === 'conferences')?.length,
                sundayService: getNewRowData(currentTab, rowData)?.filter(item => item?.serviceType === 'sunday-service')?.length,
                total: getNewRowData(currentTab, rowData)?.length,
                guestSpeakers: getNewRowData(currentTab, rowData)?.filter(item => item?.speaker)?.length,
                characterStudies: getNewRowData(currentTab, rowData)?.filter(item => item?.isThereCharacterStudies)?.length,
                topicalStudies: getNewRowData(currentTab, rowData)?.filter(item => item?.isThereTopicalStudies)?.length,
                newTestamentCount: getNewRowData(currentTab, rowData)?.filter(item => item?.testament === 'new testament')?.length,
                oldTestamentCount: getNewRowData(currentTab, rowData)?.filter(item => item?.testament === 'old testament')?.length,
                guestSpeakerCounts, characterStudiesCounts, topicalStudiesCount, conferenceCounts,
                newTestamentBooksCount, oldTestamentBooksCount
            })
        }
    }

    useEffect(() => {
        console.log('row data changed')
        processRows(rowData, currentTab)
    }, [rowData, /* currentTab */])


    const onGridReady = useCallback((params) => {
        console.log('table is ready');

        if (valuesURL) {
            params.api.showLoadingOverlay();
            fetch(`${valuesURL}`)
                .then((resp) => resp.json())
                .then((data) => {
                    data?.loginRedirect && window.location.replace('/login')
                    data = data?.result?.rows;

                    setRowData(data);
                });
        }
        else if (valuesArray) {
            setRowData(valuesArray)
        }

    }, [currentTab]);

    const handleCancelSelection = () => {
        setSelectedRows([]);
        gridRef.current?.api?.deselectAll();
    }

    const handleRowSelection = useCallback((event) => {
        const api = event.api;
        const selectedRows = api.getSelectedNodes();
        const x = selectedRows.map(item => item.data.id);
        const status = selectedRows[0]?.data?.status;

        console.log('selected row', selectedRows);

        if (title === 'Schedule' && x?.length === 1) {
            setPublished(status === 'published' || status === 'concluded' || status === 'justConcluded' || status === 'now')
            setCancelled(status === 'cancelled')
        }
        if (title === 'Resource' && x?.length === 1) {
            setPublished(status === 'published')
        }
        if (title === 'Enquiry' && x?.length === 1) {
            setRead(status === 'read')
            setReplied(status === 'replied')
        }
        if (title === 'Contact Enquiry Email' && x?.length === 1) {
            setDefaultEmail(status === 'default')
        }

        if (title === 'Schedule') {
            setIncludesConcluded(Boolean(selectedRows?.find(i => i?.data?.status === 'concluded')))
            setIncludesJustConcluded(Boolean(selectedRows?.find(i => i?.data?.status === 'justConcluded')))
        }

        // setStatus(status)

        setSelectedRows(x)
    }, [])

    const buildDurationLabel = (value) => {
        return `${value?.hours ? (value?.hours + 'hours') : ''} ${value?.minutes ? (value?.minutes + ' minutes') : ''}`
    }

    const updateFilterBarData = (filters) => {

        const data = []

        filters && Object.keys(filters).forEach(key => {
            const record = filters[key]
            const labelRecord = filterRows?.find(i => i?.value === key);

            key !== 'id' && JSON.parse(record?.filter)?.forEach(i => {
                const label = labelRecord?.valueSet ? labelRecord?.valueSet?.find(it => it?.value === i)?.label : i;

                data.push({
                    column: key,
                    value: i,
                    label: Number(label?.minutes) >= 0 ? buildDurationLabel(label) : label
                })
            })
        })

        setFilterBarData(data);
    }

    const applyFilter = ({ filters }) => {
        if (gridRef?.current.api) {
            // Get a reference to the filter instance
            let gridApi = gridRef?.current.api;

            gridApi?.setFilterModel(filters)

            // Tell grid to run filter operation again
            gridApi.onFilterChanged();

            setSelectedFilters(filters)

            updateFilterBarData(filters)
        }
    }

    const handleFilterReset = () => {
        applyFilter({ filters: null })
    }

    const removeSelectedFilter = (columnId, value) => {
        if (gridRef?.current.api) {
            // Get a reference to the filter instance
            let gridApi = gridRef?.current.api;

            //Make a copy of the currently selected filters
            let copy = { ...(selectedFilters ?? {}) };

            //Get the column filter
            let columnFilter = JSON.parse(selectedFilters[columnId]?.filter);

            console.log('column filter', columnId, value, columnFilter);

            //Remove the value from the array of values the column filter has
            columnFilter = columnFilter.filter(i => i?.toString() !== value?.toString())

            console.log('new column filter', columnFilter)

            //If the columnFIlter is empty, delete the key from the copy
            if (!columnFilter?.length) {
                delete copy[columnId]
                //If the copy is now empty after the delete, set copy to null to reset the filter
                if (!Object.keys(copy)?.length) {
                    copy = null;
                    return handleFilterReset(); //Reset the filter since there is nothing left to filter
                }
            }
            else {
                //Put back the filter that has been changed if it is not empty
                copy[columnId] = { ...copy[columnId], filter: columnFilter?.length ? JSON.stringify(columnFilter) : null }
            }

            applyFilter({ filters: copy })


            /*  console.log('new filter', copy)
 
             //Load the filter into the table
             gridApi.setFilterModel(copy)
 
             // Tell grid to run filter operation again
             gridApi.onFilterChanged();
 
             updateFilterBarData(copy) */
        }
    }

    const currentRowData = useMemo(() => {
        if (rowData) {
            setSelectedRows([])
            return rowData.filter(item => currentTab === 'all'
                ? true
                : Array.isArray(item[tabKey])
                    ? item[tabKey].includes(currentTab)
                    : (item[tabKey]?.toString() === currentTab?.toString()))
        }
        else {
            return []
        }
    }, [currentTab, rowData, tabKey])



    const handlePaginationChange = (props) => {
        if (props.newPage) {
            //Get the current page index
            const nextPage = props?.api?.paginationGetCurrentPage() + 1;

            props?.api.showLoadingOverlay();
            fetch(`${valuesURL}?offset=${nextPage}&&pageSize=${itemsPerPage ?? 10}`)
                .then((resp) => resp.json())
                .then((data) => {
                    data?.loginRedirect && window.location.replace('/login')
                    data = data?.result?.rows;

                    setRowData(data);
                });
        }
    }

    const excludeForJustConcluded = ['edit', 'cancel']
    const excludeForConcluded = ['publish', 'unpublish', 'edit', 'cancel']


    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', }}>
            {filterBarData?.length > 0 && <div style={{
                display: 'flex', alignItems: 'center',
                background: '#F5F9FF', padding: '4px 12px',
            }}>
                <Typography style={{ fontSize: '13px', mr: 1.5, minWidth: 'max-content' }}>
                    Showing the result of the following :
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {filterBarData?.map((item, index) => {
                        return <Typography key={index} style={{
                            display: 'flex', alignItems: 'center', maxWidth: 'max-content', fontSize: '12px',
                            minWidth: 'max-content', padding: '2px 8px', marginRight: '12px', color: '#0E60BF',
                            fontWeight: 400, background: '#F5F9FF', borderRadius: '12px', border: '1px solid #1414171A',
                            textTransform: 'capitalize'
                        }}>
                            {item?.label} <Cancel sx={{
                                cursor: 'pointer', ml: .5, fontSize: 14, color: 'black'
                            }} onClick={() => { removeSelectedFilter(item?.column, item?.value) }} />
                        </Typography>
                    })}
                </div>

                <Button sx={{
                    fontSize: '13px', mr: 1, color: '#0E60BF', textDecoration: 'underline',
                    minWidth: 'max-content', minWidth: 'max-content', fontWeight: 600,
                    ml: 'auto', py: .3
                }} onClick={handleFilterReset}>
                    Reset
                </Button>

            </div>
            }
            <div style={containerStyle}>
                <div style={gridStyle} className={`ag-theme-alpine ${style['ag-header']}`}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={currentRowData}
                        columnDefs={columnDefs}
                        //   autoGroupColumnDef={autoGroupColumnDef}
                        defaultColDef={defaultColDef}
                        //  onPaginationChanged={(prop) => { handlePaginationChange(prop) }}
                        overlayLoadingTemplate={`<img class='ag-grid-loader-image-gif'  style='height:20vh;width:20vh;' src='/images/loader2.gif'/>`}
                        suppressRowClickSelection={true}
                        paginationPageSizeSelector={false}
                        unSortIcon={true}
                        onRowClicked={(e) => { onRowClicked(e.node.data?.id) }}
                        groupSelectsChildren={true}
                        /*  components={() => {
                             return { agColumnHeader: customHeader }
                         }} */
                        rowSelection={'multiple'}
                        onRowSelected={handleRowSelection}
                        paginationPageSize={itemsPerPage ?? 10}
                        onFilterChanged={(props) => {
                            const nodes = [];
                            props.api.forEachNodeAfterFilter(item => nodes.push(item.data))
                            processRows(nodes, currentTab)
                        }}
                        pivotPanelShow={'always'}
                        pagination={true}
                        onGridReady={onGridReady}
                    />
                </div>

                {showTableAction && selectItemsRows.length > 0 && <CMSFloatingActionBar selectItemsRows={selectItemsRows}
                    title={title} handleCancelSelection={handleCancelSelection}
                    floatingActions={floatingActions} includesConcluded={includesConcluded}
                    includesJustConcluded={includesJustConcluded}
                    viewUrl={viewUrl} read={read} replied={replied} replyUrl={replyUrl}
                    markAsReadEndpoint={markAsReadEndpoint} cancelled={cancelled} cancelEndpoint={cancelEndpoint}
                    markAsUnreadEndpoint={markAsUnreadEndpoint} published={published} defaultEmail={defaultEmail}
                    publishEndpoint={publishEndpoint} unpublishEndpoint={unpublishEndpoint}
                    editUrl={editUrl} deleteEndpoint={deleteEndpoint} draft={draftId}
                />}

                {rowData?.length && <Filter closeFilter={closeFilter} filterTemplate={filterTemplate}
                    filterSubmit={applyFilter} filterRows={filterRows} dataset={rowData}
                    setSelectedFilters={setSelectedFilters} isEmpty={filterBarData?.length === 0}
                    showFilter={showFilter} isGrouped={filterisGrouped} searchEndPoint={searchEndPoint}
                />}

            </div>
        </div>

    );
};


export default Table