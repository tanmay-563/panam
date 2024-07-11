import * as React from 'react';
import Alert from '@mui/material/Alert';
import {AlertTitle, Button, Collapse, Stack} from "@mui/material";
import {useEffect, useState} from "react";

const DEFAULT_TIMEOUT = 3;
const AlertBox = ({ alertDetails, setAlertDetails, ...props }) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
            setAlertDetails({})
        }, (alertDetails.timeout ? alertDetails.timeout : DEFAULT_TIMEOUT)*1000);

        return () => clearTimeout(timer);
    }, [alertDetails]);


    return (
        <Collapse in={open}>
            <div className="alert-box">
                <Stack spacing={2}>
                    <Alert
                        severity={alertDetails.severity} {...props}
                        onClose={() => {setAlertDetails({})}}
                    >
                        {alertDetails.title && <AlertTitle>{alertDetails.title}</AlertTitle>}
                        {alertDetails.message}
                    </Alert>
                </Stack>
            </div>
        </Collapse>
    );
};

export default AlertBox