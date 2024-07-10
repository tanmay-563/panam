import * as React from 'react';
import Alert from '@mui/material/Alert';
import {AlertTitle, Button, Stack} from "@mui/material";
import {useEffect, useState} from "react";

const AlertBox = ({ severity, title, message, ...props }) => {
    const [showAlert, setShowAlert] = useState(false)

    useEffect(()=>{
        setShowAlert(true)
    }, [message]);
    const onClose = () => {
        setShowAlert(false);
    }

    return (
        <div className="alert-box">
            {showAlert &&
                <Stack
                    spacing={2}
                >
                    <Alert
                        severity={severity} {...props}
                        action={
                            <Button color="inherit" size="small" onClick={()=> onClose()}>
                                UNDO
                            </Button>
                        }
                    >
                        {title && <AlertTitle>{title}</AlertTitle>}
                        {message}
                    </Alert>
                </Stack>
            }
        </div>
    );
};

export default AlertBox