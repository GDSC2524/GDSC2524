import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import Link from 'next/link';

export type ButtonLinkProps = ButtonProps;

/** Bootstrap button that functions as NextJs Link */
export default function ButtonLink(props: ButtonLinkProps) {
    return (
        <>
            {/* @ts-ignore */}
            <Button as={Link} {...props} variant="outlined">
                {props.children}
            </Button>
        </>
    );
}
