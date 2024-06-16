
import Select from 'react-select';
import { useState } from 'react';
import { Close } from '@mui/icons-material';

export default function Dropdown({ data, item, finalFilter, handleChange, selectedItems, unSelect, siteSettings }) {
    console.log('values in Drop down', { selectedItems });

    const getValue = (value) => {
        return ((item?.useSetting
            ? siteSettings[item?.settingKey]?.map(i => item?.matchId ? i : i[item?.valueKey])
            : data[item?.value])?.map(i => {
                return item?.matchId ?
                    { label: i[item?.valueKey], value: i?.id }
                    : { label: i, value: i }
            }))?.find(i => i?.value === value)
    }



    const [selected, setSelected] = useState((finalFilter[item?.value]?.filter ?? [])[0]
        ? getValue((finalFilter[item?.value]?.filter ?? [])[0]) : null);

    const removeSelected = (id, value) => {
        unSelect(id, value)
    }

    return <div>
        <Select
            options={(item?.useSetting
                ? siteSettings[item?.settingKey]?.map(i => item?.matchId ? i : i[item?.valueKey])
                : data[item?.value])?.map(i => { return item?.matchId ? { label: i[item?.valueKey], value: i?.id } : { label: i, value: i } })}
            id={'id'}
            name={'id'}
            isMulti={false}
            onChange={option => {
                setSelected(option)
                handleChange({
                    type: 'dropdown', id: item?.value,
                    value: option.value
                })
            }}
            value={/* (finalFilter[item?.value]?.filter ?? [])[0] */ selected}
        />

        {/* Selected Items */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {selectedItems?.map((label, index) => {
                return <div key={index} style={{
                    display: 'flex', alignItems: 'center', fontSize: '12px', margin: '4px 12px 4px 0',
                    background: '#FAF7F1', borderRadius: '16px', fontWeight: 600, padding: '2px 8px'
                }}>
                    {label} <Close sx={{ color: '#6F3D17', fontSize: 12, ml: .5, cursor: 'pointer' }} onClick={() => { removeSelected(item?.value, label) }} />
                </div>
            })}
        </div>
    </div>
}