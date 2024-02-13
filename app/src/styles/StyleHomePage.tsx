import { styled } from '@mui/material/styles';
import ButtonLink from '../components/ButtonLink';
import { Box } from '@mui/material';
import {
    LIGHT_PRIMARY,
    MEDIUM_PRIMARY,
    DARK_PRIMARY,
    PRIMARY_TEXT,
    PRIMARY_BACKGROUND,
} from '@/styles/ColorScheme';

const StyledButton = styled(ButtonLink)({
    borderRadius: '10px',
    background: `linear-gradient(45deg, ${MEDIUM_PRIMARY}, ${PRIMARY_BACKGROUND})`,
    color: PRIMARY_TEXT,
    border: '2px solid #ccc',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    fontWeight: 'bold',
    height: '70px',
    width: '300px',
    '&:hover': {
        background: `linear-gradient(45deg, ${PRIMARY_BACKGROUND}, ${MEDIUM_PRIMARY})`,
    },
});

const TextBtn = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    fontSize: '2rem',
});

const Frame = styled(Box)({
    padding: '15px',
    margin: '100px',
    border: '1px solid #ccc',
    borderRadius: '30px',
    background: `linear-gradient(45deg, ${LIGHT_PRIMARY}, ${PRIMARY_BACKGROUND})`,
});

const StyledHeading = styled('span')({
    color: DARK_PRIMARY,
    fontWeight: 'bold',
    fontSize: '3.5rem',
    marginBottom: '50px',
});

const StyledSubHeading = styled('span')({
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
    fontSize: '1.6rem',
    marginBottom: '20px',
});

const ItemsHeader = styled(Box)({
    width: '70%',
});

const BoldText = styled('span')({
    fontWeight: 'bold',
    marginRight: '20px',
    color: DARK_PRIMARY,
});

export { StyledButton, TextBtn, Frame, StyledHeading, StyledSubHeading, ItemsHeader, BoldText };
