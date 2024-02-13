import React, { useState, useRef } from 'react';
import Map, {
    useControl,
    Marker,
    MarkerDragEvent,
    GeolocateControl,
    GeolocateResultEvent,
} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Button } from 'react-bootstrap';
import { isUndefined } from '@/utils';
import ConfirmationModal, { ModalHandle } from './ConfirmationModal';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYW5kcmV5YnV0ZW5rbyIsImEiOiJjbGwxMWprNW0wcWRoM21td24xZjlkZTAyIn0.4nU5eUHsDa8r2lP1vMkyHg';
const DEFAULT_COORDINATES = { longitude: -95.844032, latitude: 36.966428, zoom: 3 };

export type CoordinatesType = {
    longitude: number;
    latitude: number;
};

type ViewStateType = CoordinatesType & {
    zoom: number;
};

type LocationSearchBarProps = {
    placeMarker: (location: CoordinatesType) => void;
    proximity?: CoordinatesType;
};

type LocationPickerProps = {
    reportCoords: CoordinatesType | undefined;
    initialMarkerState: boolean;
    locationSubmitted: boolean;
    updateReportCoords: (newCoords: CoordinatesType) => void;
    fillOutAddress: (address: string) => void;
};

/** Save user reported location in local storage */
export function submitLocation(reportCoords: CoordinatesType | undefined) {
    if (typeof window === 'undefined' || isUndefined(reportCoords)) return;
    localStorage.setItem('lastReportedLocation', JSON.stringify(reportCoords));
}

/** Location Search Bar */
function LocationSearchBar({ placeMarker, proximity }: LocationSearchBarProps) {
    const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_ACCESS_TOKEN,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Where do you report it?',
        countries: 'us',
        proximity,
    });

    useControl(() => geocoder);

    geocoder.on('result', (event) => {
        const [longitude, latitude] = event.result.geometry.coordinates;
        placeMarker({ longitude, latitude });
    });

    return null;
}

/** The map */
export default function LocationPicker({
    reportCoords,
    updateReportCoords,
    fillOutAddress,
    initialMarkerState,
    locationSubmitted,
}: LocationPickerProps) {
    /** Retrieve last user reported location for the view of the map upon loading page*/
    function fetchUserLastLocation(): ViewStateType {
        if (typeof window === 'undefined') return DEFAULT_COORDINATES;

        if (isUndefined(reportCoords)) {
            const lastReportedLocation = localStorage.getItem('lastReportedLocation');

            if (lastReportedLocation) {
                const { longitude, latitude } = JSON.parse(lastReportedLocation);
                return { longitude, latitude, zoom: 10.5 };
            } else {
                return DEFAULT_COORDINATES;
            }
        } else {
            return { ...reportCoords!, zoom: 10.5 };
        }
    }
    // View Box of the map upon entering a page
    const [viewState, setViewState] = useState<ViewStateType>(fetchUserLastLocation());
    // Disable the marker after user already submit location
    const [isDraggableMarkerEnabled, setIsDraggableMarkerEnabled] =
        useState<boolean>(initialMarkerState);
    // Ref to open modal alert
    const modalRef = useRef<ModalHandle | null>(null);

    function handleDragEnd(event: MarkerDragEvent) {
        const { lng, lat } = event.lngLat;
        updateReportCoords({ longitude: lng, latitude: lat });
    }

    // Track user location and put the marker there only if the location is not submitted
    function handleGeolocate(event: GeolocateResultEvent) {
        if (!isDraggableMarkerEnabled) return;
        const { longitude, latitude } = event.coords;
        updateReportCoords({ longitude, latitude });
    }

    // Reset current location and get new location
    function resetLocationAndAddress() {
        setIsDraggableMarkerEnabled(true);
        fillOutAddress('');
    }

    // Translate coordinates to address
    async function reverseGeolocation() {
        if (isUndefined(reportCoords)) return;

        const { longitude, latitude } = reportCoords!;

        if (!longitude || !latitude) return;

        const endpoint = 'mapbox.places';
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/${endpoint}/${longitude},${latitude}.json?types=address,poi,place&access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            const json = await response.json();
            const results = json.features[0];
            fillOutAddress(results.place_name);
            // Disable marker after submitted location
            setIsDraggableMarkerEnabled(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            <Map
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                reuseMaps={true}
                initialViewState={{ ...viewState }}
                style={{ width: '100%', height: '100%', borderRadius: 5 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onClick={() => {
                    if (isDraggableMarkerEnabled) return;
                    modalRef.current?.openModal();
                }}
            >
                {!isUndefined(reportCoords) && (
                    <Marker
                        longitude={reportCoords!.longitude}
                        latitude={reportCoords!.latitude}
                        color="red"
                        draggable={isDraggableMarkerEnabled}
                        onDragEnd={handleDragEnd}
                    />
                )}
                <LocationSearchBar
                    placeMarker={updateReportCoords}
                    proximity={
                        !isUndefined(reportCoords)
                            ? {
                                  longitude: reportCoords!.longitude,
                                  latitude: reportCoords!.latitude,
                              }
                            : undefined
                    }
                />
                <GeolocateControl
                    position="bottom-right"
                    onGeolocate={handleGeolocate}
                    onError={(error) => {
                        window.alert(error.message);
                    }}
                />
            </Map>
            <ConfirmationModal
                ref={modalRef}
                header="Alert!"
                description="Do you want to change the location? This will reset the current address."
                denyMessage="No, keep the current location"
                confirmMessage="Yes, I want to update the location"
                onConfirm={resetLocationAndAddress}
            />
            <div
                style={{
                    marginTop: 10,
                    textAlign: 'center',
                }}
            >
                <Button disabled={locationSubmitted} onClick={reverseGeolocation}>
                    {!locationSubmitted ? 'Report at this location' : 'Location already submitted'}
                </Button>
            </div>
        </div>
    );
}
