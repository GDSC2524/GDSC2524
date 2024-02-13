import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
    LIGHT_PRIMARY,
    DARK_PRIMARY,
    PRIMARY_BACKGROUND,
    PRIMARY_TEXT,
} from '@/styles/ColorScheme';

// Define custom styles
const PageTitle = styled(Typography)({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '2.5rem',
});

const GroupedBox = styled(Box)({
    margin: '15px',
    border: '2px solid #ccc',
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${LIGHT_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',

    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${LIGHT_PRIMARY})`,
    },
});

const StyledText = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
});

const SmallBox = styled(Box)({
    margin: '15px',
    maxWidth: '20rem',
    border: '2px solid #ccc',
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${LIGHT_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${LIGHT_PRIMARY})`,
    },
});

const ChartBox = styled(Box)({
    margin: '15px',
    maxWidth: '40rem',
    maxHeight: '40rem',
    border: '2px solid #ccc',
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${LIGHT_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${LIGHT_PRIMARY})`,
    },
});

const TagHead = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    fontSize: '1.3rem',
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.5,
});

const TagText = styled('span')({
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
    fontSize: '1rem',
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.5,
});

export { PageTitle, GroupedBox, StyledText, SmallBox, ChartBox, TagHead, TagText };
