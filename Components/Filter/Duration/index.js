
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DropdownItemsBuilder from "@/Components/DropdownField/DropdownItemsBuilder";
import Dropdown from "@/Components/DropdownField/Dropdown";

export default function Duration({ data, item, finalFilter, handleChange, siteSettings }) {
    const [fullDuration, setFullDuration] = useState({
        hours: (finalFilter[item?.value]?.filter ?? [{}])[0]?.hours,
        minutes: (finalFilter[item?.value]?.filter ?? [{}])[0]?.minutes
    });

    const hours = Array.from({ length: 24 }).map((item, index) => {
        return { value: index, label: index }
    })

    const minutes = Array.from({ length: 60 }).map((item, index) => {
        return { value: index, label: index }
    })

    useEffect(() => {
        setFullDuration({
            hours: (finalFilter[item?.value]?.filter ?? [{}])[0]?.hours,
            minutes: (finalFilter[item?.value]?.filter ?? [{}])[0]?.minutes
        })
    }, [finalFilter[item?.value]?.filter])

    console.log({ fullDuration, finalFilter })

    return <Box style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start'
    }}>
        <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start', maxWidth: '100%', justifyContent: 'space-between' }}>
            {/* Drop down field */}
            <Box sx={{ mr: 1, maxWidth: '100%' }}>
                <Dropdown
                    items={DropdownItemsBuilder({ items: hours ?? [], postFix: 'hours' })}
                    handleChange={(value) => {
                        handleChange({
                            type: 'duration', id: item?.value,
                            filterId: item?.filterId,
                            value: { hours: value, minutes: fullDuration?.minutes ?? 0 }
                        });
                        //  setFullDuration({ hours: value, minutes: fullDuration?.minutes ?? 0 })
                    }}
                    placeholder={'Hours'} selectedItem={fullDuration?.hours  /* finalFilter[item?.value]?.filter?.hours */}
                />
            </Box>

            {/* Drop down field */}
            <Box sx={{ ml: 0, maxWidth: '100%' }}>
                <Dropdown
                    items={DropdownItemsBuilder({ items: minutes ?? [], postFix: 'minutes' })}
                    handleChange={(value) => {
                        handleChange({
                            type: 'duration', id: item?.value,
                            filterId: item?.filterId,
                            value: { minutes: value, hours: fullDuration?.hours ?? 0 }
                        });
                        //  setFullDuration({ minutes: value, hours: fullDuration?.hours ?? 0 })
                    }}
                    placeholder={'Minutes'} selectedItem={fullDuration?.minutes/* finalFilter[item?.value]?.filter?.minutes */}
                />
            </Box>
        </Box>
    </Box>
}