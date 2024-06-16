import { useEffect, useState } from 'react'
import Dropdown from './Dropdown';
import TextBox from './TextBox';
import FilterElement from './FilterElement';
import Checkbox from './Checkbox';
import DateBox from './Datebox';
import FilterApplyButton from './FilterApplyButton';
import Close from '@mui/icons-material/Close';
import { Box, Button, Typography } from '@mui/material';
import TimeBox from './Timebox';
import Duration from './Duration';

const sampleData = [
    { label: '' }
]

export default function Filter({ closeFilter, filterSourceUrl, showFilter, searchEndPoint, filterSubmit, filterRows,
    filterTemplate, dataset, isGrouped, setSelectedFilters, isEmpty }) {
    const [data, setData] = useState(null);
    const [textValues, setTextValue] = useState(null);
    const [groupTitles, setGroupTitles] = useState(null);
    const [showGroup, setShowGroup] = useState(null)
    const siteSettings = {} //useSelector(({ siteSettings }) => siteSettings);

    const [selectedFromList, setSelectedFromList] = useState({});

    const [useId, setUseId] = useState(null)

    const [useMultipleSelection, setUseMultipleSelection] = useState([])

    const [finalFilter, setFinalFilter] = useState(filterTemplate)

    const checkboxHandler = ({ id, value, filterId }) => {
        if (finalFilter[id]?.filter?.includes(value)) {
            const isLast = finalFilter[id]?.filter?.filter(item => item === value)?.length === finalFilter[id]?.filter?.length
            //remove the value
            setFinalFilter({
                ...finalFilter, [id]: {
                    ...finalFilter[id],
                    filter: finalFilter[id]?.filter?.filter(item => item !== value)
                }
            });

            filterId && isLast && setUseId(useId?.filter(item => item !== id))
        }
        else {
            //add the value
            const finalFilterClone = { ...finalFilter[id] };
            finalFilterClone.filter = [...(finalFilterClone?.filter ?? []), value]
            setFinalFilter({ ...finalFilter, [id]: finalFilterClone });

            filterId && setUseId([...(useId ?? []), id])
        }
        //  setFinalFilter({...(finalFilter??{}),[id]:{...(finalFilter[id]??[])}})
    }

    const textboxHandler = ({ id, value, filterId }) => {
        setFinalFilter({ ...finalFilter, [id]: { ...(finalFilter[id] ?? {}), filter: [value] } })
        filterId && value && !useId?.includes(id) && setUseId([...(useId ?? []), id])

        filterId && !value && setUseId(useId?.filter(item => item !== id))
    }

    const dateboxHandler = ({ id, value }) => {
        setFinalFilter({ ...finalFilter, [id]: { ...(finalFilter[id] ?? {}), filter: [value] } })
    }

    const timeboxHandler = ({ id, value }) => {
        setFinalFilter({ ...finalFilter, [id]: { ...(finalFilter[id] ?? {}), filter: [value] } })
    }

    const durationHandler = ({ id, value }) => {
        setFinalFilter({ ...finalFilter, [id]: { ...(finalFilter[id] ?? {}), filter: [value] } })
    }

    const dropdownHandler = ({ id, value }) => {
        setFinalFilter({ ...finalFilter, [id]: { ...(finalFilter[id] ?? {}), filter: [value] } })
        !(selectedFromList[id] ?? [])?.find(i => i?.toString() === value?.toString()) && setSelectedFromList({ ...selectedFromList, [id]: [...(selectedFromList[id] ?? []), value] })
    }


    const handleChange = ({ type, id, value, filterId }) => {
        if (type === 'checkbox') return checkboxHandler({ id, value, filterId })
        if (type === 'textbox') return textboxHandler({ id, value, filterId })
        if (type === 'datebox') return dateboxHandler({ id, value })
        if (type === 'timebox') return timeboxHandler({ id, value })
        if (type === 'duration') return durationHandler({ id, value })
        if (type === 'dropdown') return dropdownHandler({ id, value })
    }

    // console.log('final filter', finalFilter,);

    useEffect(() => {
        if (showFilter) {
            isEmpty && handleReset();

            const temp = {};

            const groupTitls = new Set()

            const entries = []

            filterRows?.forEach(item => {
                let uniqueKeys = [];

                isGrouped && groupTitls.add(item?.group)

                return item?.valueSet ? temp[item?.value] = item?.valueSet
                    : {
                        ...item, data: dataset?.forEach(itm => {
                            if (Array.isArray(itm[item?.value])) {
                                temp[item?.value] = [...new Set([...(temp[item?.value] ?? []), ...itm[item?.value]])]
                                return true
                            }

                            if (itm[item?.value] && !uniqueKeys.includes(itm[item?.value])) {
                                uniqueKeys.push(itm[item?.value])
                                temp[item?.value] = [...(temp[item?.value] ?? []), itm[item?.value]]
                                return true
                            }
                            else return false
                        })
                    }

            })

            setUseMultipleSelection(filterRows?.filter(i => i?.multipleSelection)?.map(i => i?.value))

            setData(temp)
            setGroupTitles([...groupTitls])
            !showGroup && setShowGroup([...groupTitls][0])
        }

    }, [showFilter])


    const handleSubmit = () => {
        const callback = (idArray) => {
            const res = {};

            Object.entries(finalFilter).forEach(([key, entry]) => {
                //Skip the useid entries
                entry?.filter?.length && !useId?.includes(key) && (res[key] = { ...entry, filter: JSON.stringify(useMultipleSelection?.includes(key) ? selectedFromList[key] : entry?.filter) })
            })

            console.log('res', { res, idArray });

            idArray && (res['id'] = {
                filterType: 'text',
                type: 'equals',
                filter: JSON.stringify(idArray)
            })

            filterSubmit({ filters: res })
            closeFilter();
        }

        if (Object.values(finalFilter)?.find(item => item?.filter?.length)) {
            console.log('use id items', useId)
            //Check if there are any filters that use id
            // const keys = Object.keys(useId);
            if (useId?.length) {
                console.log('calling filter endpoint', useId);

                const payload = {};
                useId.forEach(item => payload[item] = finalFilter[item]?.filter)

                //  console.log('payload', payload);
                //Call the filter endpoint with the JSON of the params
                fetch(searchEndPoint, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }).then(
                    async response => {
                        const { data, error, loginRedirect } = await response.json();

                        loginRedirect && window.location.replace('/login')

                        if (data) {
                            console.log('filter data received from endpoint', data?.length, data);
                            callback(data);
                        }
                    },
                    err => {
                        console.log('something went wrong', err);
                        callback()
                    }
                )
            }
            else {
                callback()
            }
        }
    }

    const handleReset = () => {
        const res = {};

        Object.entries(finalFilter).forEach(([key, entry]) => {
            //  console.log('entry', entry, 'key', key);
            res[key] = { ...entry, filter: null }
        })

        setUseId(null)

        setFinalFilter(res)

        setSelectedFromList({});

        filterSubmit({ filters: null })
    }


    const filterSelected = () => {
        return Boolean(Object.values(finalFilter)?.find(item => item?.filter?.length))
    }

    const typeMapping = {
        checkbox: {
            handler: '',
            element: Checkbox
        },
        textbox: {
            handler: '',
            element: TextBox
        },
        datebox: {
            handler: '',
            element: DateBox
        },
        dropdown: {
            handler: '',
            element: Dropdown
        },
        timebox: {
            handler: '',
            element: TimeBox
        },
        duration: {
            handler: '',
            element: Duration
        },
    }


    const unSelect = (id, value) => {
        console.log('removing value', { id, value })
        setSelectedFromList({ ...selectedFromList, [id]: selectedFromList[id]?.filter(i => i !== value) })
    }

    return showFilter && <Box sx={{ width: 'max-content', position: 'relative' }}>
        <div style={{
            position: 'fixed', top: 0, bottom: 0, left: 0, width: '70vw', background: 'black',
            zIndex: 75567576, height: '100vh', opacity: '70%'
        }} onClick={closeFilter}>

        </div>

        <Box sx={{
            height: '100vh', overflow: 'hidden', background: 'white', width: '30vw',
            position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 237273
        }}>
            {/* Heading */}
            <Box sx={{
                borderBottom: '1px solid #1414171A', px: 1.5, py: 1,
                display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'
            }}>
                <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Filter
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant='contained' disabled={!filterSelected()} sx={{
                        px: 1, py: .5, cursor: 'pointer', mr: 1.5, borderRadius: '16px', fontSize: 13
                    }} onClick={handleReset}>
                        reset
                    </Button>

                    <Close sx={{ fontSize: 20, cursor: 'pointer', mr: 2, color: 'black' }} onClick={closeFilter} />

                </Box>
            </Box>

            {/* Body */}
            <Box sx={{
                pl: 2, py: 1, maxWidth: '100%', height: 'calc(100vh - 60px)', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                {/* Categories */}
                <Box sx={{ maxWidth: '100%' }}>
                    {data && !isGrouped ? <FilterElement rows={filterRows} data={data} finalFilter={finalFilter}
                        typeMapping={typeMapping} handleChange={handleChange} siteSettings={siteSettings}
                        selectedItems={selectedFromList} unSelect={unSelect} />
                        : groupTitles?.map((item, index) => {
                            return <Box key={index} sx={{ mb: 1.5 }} >
                                <Typography sx={{
                                    display: 'flex', alignItems: 'center', px: 1.5, py: 1,
                                    justifyContent: 'space-between', background: '#FAF7F1', cursor: 'pointer'
                                }} onClick={() => { setShowGroup(showGroup === item ? null : item) }}>
                                    {item}

                                    {showGroup === item
                                        ? <svg width="12" height="8" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.24184 1.09431C7.90318 0.301895 9.09682 0.301894 9.75816 1.09431L16.0979 8.69054C17.0192 9.79451 16.2554 11.5 14.8397 11.5L2.1603 11.5C0.744553 11.5 -0.0192184 9.79451 0.902138 8.69054L7.24184 1.09431Z" fill="#364451" />
                                        </svg>
                                        : <svg width="12" height="8" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.25816 10.9057C8.59682 11.6981 7.40318 11.6981 6.74184 10.9057L0.402137 3.30946C-0.51922 2.20549 0.244552 0.5 1.6603 0.5H14.3397C15.7554 0.5 16.5192 2.20549 15.5979 3.30946L9.25816 10.9057Z" fill="#364451" />
                                        </svg>
                                    }

                                </Typography>

                                {showGroup === item && <Box style={{ px: .5 }}>
                                    <FilterElement rows={filterRows?.filter(itm => itm?.group === item)} typeMapping={typeMapping}
                                        data={data} finalFilter={finalFilter} handleChange={handleChange}
                                        siteSettings={siteSettings} selectedItems={selectedFromList}
                                        unSelect={unSelect} />
                                </Box>}

                            </Box>
                        })}

                </Box>

                {/* Filter button */}
                <FilterApplyButton handleSubmit={handleSubmit} />

            </Box>
        </Box>
    </Box >

}