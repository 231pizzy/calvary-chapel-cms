'use client'

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import Map from "./Map";


export default function MapAutocomplete({ defaultCoordinate, address, handleChange }) {
    const [coordinate, setCoordinate] = useState(defaultCoordinate);

    const [value, setValue] = useState(address ?? '')

    useEffect(() => {
        address && setValue(address)
        defaultCoordinate && setCoordinate(defaultCoordinate)
    }, [address, defaultCoordinate])

    return <Box sx={{
        display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%',
        mt: 2
    }}>
        <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
            options={{ types: [] }}
            style={{
                fontFamily: 'Manrope', fontSize: '14px',
                fontWeight: 500, width: 'calc(100% - 12px)', height: '40px', alignSelf: 'flex-start',
                padding: '6px 0 6px 12px',
                background: 'white', border: '1.5px solid #1414171A', borderRadius: '4px'
            }}
            value={value}
            onChange={(ev) => { setValue(ev.currentTarget.value) }}
            onPlaceSelected={(place) => {
                const coord = place.geometry.location.toJSON()
                console.log({ place, coord, });
                setCoordinate(coord)
                setValue(place?.formatted_address)
                handleChange && handleChange(coord, place?.formatted_address)
            }}
        />

        {coordinate?.lat && < Map coordinate={coordinate} defaultAddress={address} handleChange={handleChange} />}
    </Box>;
}