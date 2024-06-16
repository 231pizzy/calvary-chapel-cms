
import { CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import CheckBoxFilled from '@mui/icons-material/CheckBox'
import { Box, Typography } from "@mui/material";
import StatusRenderer from "../StatusRenderer";
import AvatarWithName from "../AvatarWithName";
import ServiceRenderer from "../ServiceRenderer";
import MediaRenderer from "../MediaRenderer";

export default function Checkbox({ data, item, finalFilter, handleChange, siteSettings }) {
    let usedValue = []

    const dataList = item?.deDuplicate ?
        data[item?.value]?.filter(i => !usedValue?.includes(i?.value) && usedValue?.push(i?.value))
        : data[item?.value]

    usedValue = [];

    const rendererMapping = {
        status: StatusRenderer,
        avatarWithName: AvatarWithName,
        serviceType: ServiceRenderer,
        media: MediaRenderer,
    }

    return <Box style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start'
    }}>
        {(item?.useSetting
            ? siteSettings[item?.settingKey]?.map(i => i[item?.valueKey])
            : dataList /* data[item?.value] */)?.map((itm, index) => {
                const isObject = typeof itm === 'object';
                const label = isObject ? itm?.label : itm;
                const value = isObject ? itm?.value : itm;
                const renderer = rendererMapping[item?.renderer]

                return <Box key={index} sx={{
                    display: 'flex', alignItems: 'flex-start', fontWeight: 400, border: '1px solid #1414171A',
                    width: 'max-content', textTransform: 'capitalize', cursor: 'pointer',
                    lineHeight: '20px', mb: 1, bgcolor: '#F5F9FF', px: 1, py: .5, mr: 1.5
                }} onClick={() => {
                    handleChange({
                        type: 'checkbox', id: item?.value,
                        value, filterId: item?.filterId
                    })
                }}>
                    {finalFilter[item?.value]?.filter?.includes(value) ?
                        <CheckBoxFilled sx={{ color: 'primary.main', }} />
                        : <CheckBoxOutlineBlankOutlined sx={{ color: '#1414171A' }} />
                    }
                    {!renderer && <Typography sx={{
                        mx: 1, display: 'flex', maxWidth: '80%',
                        mt: .5, fontSize: 13, alignItems: 'flex-start',
                    }}>
                        {label}
                    </Typography>}

                    {Boolean(renderer) && <Box sx={{
                        mx: 1, mt: .2,
                        display: 'flex', alignItems: 'flex-start',
                    }}>
                        {renderer({ value: label })}
                    </Box>}
                </Box>
            })}
    </Box>
}