import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import ButtonLink from '@/components/ButtonLink';
import {
    LIGHT_PRIMARY,
    MEDIUM_PRIMARY,
    DARK_PRIMARY,
    PRIMARY_TEXT,
    PRIMARY_BACKGROUND,
} from '@/styles/ColorScheme';

// Define custom styles
const StyledReportDetails = styled(Box)({
    '& p': {
        margin: 0,
        padding: '5px 0',
        color: PRIMARY_TEXT,
    },
    '& strong': {
        color: PRIMARY_TEXT,
        textAlign: 'center',
    },
    borderRadius: '2px',
    background: PRIMARY_BACKGROUND,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
});

const GroupedBox = styled(Box)({
    padding: '15px',
    marginBottom: '15px',
    marginTop: '15px',
    marginLeft: '15px',
    marginRight: '15px',
    border: '2px solid #ccc',
    borderRadius: '30px',
    background: `linear-gradient(45deg, ${LIGHT_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',

    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${LIGHT_PRIMARY})`,
    },
});

const Heading = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    marginBottom: '10px',
    fontSize: '1.3rem',
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.5,
});

const FooterDetails = styled(Box)({
    borderRadius: '2px',
    background: PRIMARY_BACKGROUND,
    boxShadow:
        '-5px 0 5px -5px rgba(0, 0, 0, 0.3), 5px 0 5px -5px rgba(0, 0, 0, 0.3), 0 5px 5px -5px rgba(0, 0, 0, 0.3)',
});

const IDText = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
});

const PageTitle = styled(Typography)({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
});

const StyledButton = styled(ButtonLink)({
    background: `linear-gradient(45deg, ${MEDIUM_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    border: '2px solid #ccc',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${MEDIUM_PRIMARY})`,
    },
});

const TextBtn = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    fontSize: '1rem',
    '&:hover': {
        color: 'blue',
    },
});

export {
    StyledReportDetails,
    GroupedBox,
    Heading,
    FooterDetails,
    IDText,
    PageTitle,
    StyledButton,
    TextBtn,
};
