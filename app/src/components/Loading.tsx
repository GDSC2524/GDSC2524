import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';

export type LoadingProps = {
    /** Loading content */
    children: React.ReactNode;
    /** Whether loading indicator should display */
    isLoading: boolean;
};

/** Loading spinner */
export default function Loading({ children, isLoading }: LoadingProps) {
    if (!isLoading) {
        return null;
    }

    return (
        <Stack gap={2} className="mx-auto text-center">
            <Spinner animation="border" className="mx-auto" />
            <p>{children}</p>
        </Stack>
    );
}
