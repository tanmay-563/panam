import * as React from 'react';
import Alert from '@mui/material/Alert';
import {AlertTitle, Stack} from "@mui/material";

const AlertBox = ({ severity, title, message, ...props }) => {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={severity} {...props}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {message}
            </Alert>
        </Stack>
    );
};

export default AlertBox