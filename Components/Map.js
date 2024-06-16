'use client'

import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Geocoder, InfoWindow } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';

const containerStyle = {
    width: '400px',
    height: '400px',
    marginTop: '12px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

/* export default */ function MyComponent({ coordinate, defaultAddress, handleChange }) {
    const router = useRouter()
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY
    })

    const [map, setMap] = React.useState(null)

    const [position, setPosition] = useState(coordinate ?? center)
    const [address, setAddress] = useState(defaultAddress);
    const [showMarker, setShowMarker] = useState(true);

    useEffect(() => {
        console.log('loading position', coordinate);
        coordinate && setPosition(coordinate)
    }, [coordinate])

    /*   const onLoad = React.useCallback(function callback(map) {
          const bounds = new window.google.maps.LatLngBounds(coordinate ?? center);
          map.fitBounds(bounds);
          //map.setZoom(1)
  
          //  setMap(map)
      }, [])
   */
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}

            onClick={async ev => {
                const position = ev.latLng.toJSON()
                const address = (await new window.google.maps.Geocoder().geocode({ location: position }))?.results[0]?.formatted_address;

                handleChange && handleChange(position, address)
                setAddress(address);
                setShowMarker(true);

                console.log("position = ", position, address);
                setPosition(position)
            }}
            //  onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker position={position} onClick={() => { setShowMarker(true); }} />

            {showMarker && <InfoWindow position={position} onCloseClick={() => { setShowMarker(false); }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: 12, maxWidth: '100px' }}>
                        {address}
                    </Typography>
                    <Typography component={'a'} href={`https://www.google.com/maps?q=${position?.lat},${position?.lng}`}
                        target='_blank' sx={{ fontSize: 11, mt: .7, fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>
                        View on Google Map
                    </Typography>
                </Box>

            </InfoWindow>}
            <></>
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)