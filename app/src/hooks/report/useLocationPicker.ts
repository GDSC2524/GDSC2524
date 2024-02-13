import { CoordinatesType } from '@/components/report/LocationPicker';
import React, { useState, useCallback } from 'react';

type UseMapResults = {
    reportCoords: CoordinatesType | undefined;
    updateReportCoords: (newCoords: CoordinatesType | undefined) => void;
};

export const useLocationPicker = (
    existingReportCoords: CoordinatesType | undefined
): UseMapResults => {
    // Coordinates of the marker (aka reported place)
    const [reportCoords, setReportCoords] = useState<CoordinatesType | undefined>(existingReportCoords);

    const updateReportCoords = useCallback((newCoords: CoordinatesType | undefined) => {
        setReportCoords(newCoords);
    }, []);

    return {
        reportCoords,
        updateReportCoords,
    };
};
