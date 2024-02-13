import React from 'react';

export type PageHeaderProps = {
    /** Page header content */
    children: React.ReactNode;
};

/** Page header */
export default function PageHeader({ children }: PageHeaderProps) {
    return <h1 className="mt-4 mb-4">{children}</h1>;
}
