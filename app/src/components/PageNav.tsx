import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { DARK_PRIMARY } from '@/styles/ColorScheme';
import ItemsNav from './ItemsNav';

/** Bootstrap Navbar Brand Link that functions as NextJs Link */
function BrandLink({ label, href }: { label: string; href: string }) {
    return (
        <>
            {/* @ts-ignore */}
            <Navbar.Brand as={Link} href={href}>
                <EngineeringIcon
                    style={{ color: DARK_PRIMARY, marginRight: '0.2rem', fontSize: '2.5rem' }}
                />
                <span style={{ fontWeight: 'bold', color: DARK_PRIMARY, fontSize: '1.5rem' }}>
                    {label}
                </span>
            </Navbar.Brand>
        </>
    );
}

/** Page navigation */
export default function PageNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <BrandLink label="CL311" href="/" />
                <ItemsNav />
            </Container>
        </Navbar>
    );
}
