import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Link from 'next/link';
import {
    Frame,
    StyledHeading,
    StyledSubHeading,
    StyledButton,
    TextBtn,
} from '../styles/StyleHomePage';
import { Grid } from '@mui/material';
import HomeImg from '../styles/images/HomeImg.svg';
import HomeImg2 from '../styles/images/HomeImg2.png';
import Image from 'next/image';


export default function Home() {
    return (
        <>
            <Head>
                <title>CL311</title>
            </Head>
            <main>
                <Frame>
                    <Container>
                        <Stack gap={3}>
                            <Grid container justifyContent="center">
                                <StyledHeading>Welcome to our CodeDay Labs 311!</StyledHeading>
                                <StyledSubHeading>
                                    Report Local Issues. Improve Your Community.
                                </StyledSubHeading>
                                <StyledSubHeading>
                                    CL311 makes reporting issues to your city quick, easy and
                                    effective.
                                </StyledSubHeading>
                            </Grid>
                            <Grid container justifyContent="center">
                                <StyledButton variant="secondary" href="/report/create">
                                    <TextBtn>Report An Issue</TextBtn>
                                </StyledButton>
                            </Grid>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Image
                                        src={HomeImg.src}
                                        alt="Home Page Image"
                                        width={700}
                                        height={500}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Image
                                        src={HomeImg2.src}
                                        alt="Home Page Image 2"
                                        width={600}
                                        height={400}
                                    />
                                </Grid>
                            </Grid>
                            <p>
                                Image attachment under construction{' '}
                                <Link href="/attachment">image attachment</Link>
                            </p>
                        </Stack>
                    </Container>
                </Frame>
            </main>
        </>
    );
}
