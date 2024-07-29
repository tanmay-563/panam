import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmationBox = ({ dialogType, setDialogType, ...props}) => {
    const onClose = () => {
        setDialogType('');
    }

    return (
        <Dialog
            open={dialogType !== ''}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="confirmation-box"
        >
            <DialogTitle id="alert-dialog-title" className="dialog-title">
                {props.dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className="dialog-content-text">
                    {props.dialogProps.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} color="primary" className="dialog-button">
                    Cancel
                </Button>
                <Button onClick={props.dialogProps.onConfirm} color="primary" autoFocus className="dialog-button">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationBox;
