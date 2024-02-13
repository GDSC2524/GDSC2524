import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Box from '@mui/material/Box';
import { Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { SxProps } from '@mui/material';

const STYLE: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const buttonStyle = {
    marginTop: 10,
};

type ConfirmationModalProps = {
    header: string;
    description: string;
    confirmMessage: string;
    denyMessage: string;
    /** Reset current location and get new location */
    onConfirm: () => void;
};

export type ModalHandle = {
    openModal: () => void;
};

function ConfirmationModal(
    { header, description, onConfirm, confirmMessage, denyMessage }: ConfirmationModalProps,
    ref: React.Ref<ModalHandle>
) {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },
    }));

    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={STYLE}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {header}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {description}
                    </Typography>
                    <Button style={buttonStyle} className="btn btn-secondary" onClick={handleClose}>
                        {denyMessage}
                    </Button>
                    <Button
                        style={buttonStyle}
                        className="btn btn-warning"
                        onClick={() => {
                            onConfirm();
                            handleClose();
                        }}
                    >
                        {confirmMessage}
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default forwardRef(ConfirmationModal);
