import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Loading from "../Loading";
import {useNavigate} from "react-router-dom";

const ConfirmationBox = ({ dialogType, setDialogType, ...props}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onClose = () => {
        setDialogType('');
    }

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await props.dialogProps.onConfirm();
        } catch (error) {
            console.error('ErrorPage:', error);
        } finally {
            setLoading(false);
            navigate("/")
        }
    };

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
                {loading ? <Loading className="submit"/> :
                    <>
                        <Button onClick={onClose} color="primary" className="dialog-button">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} color="primary" autoFocus className="dialog-button">
                            Confirm
                        </Button>
                    </>
                }
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationBox;
