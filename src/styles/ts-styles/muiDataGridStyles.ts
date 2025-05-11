import { Theme } from '@mui/material/styles';

export const getDataGridStyles = (theme: Theme) => ({
    borderColor: 'var(--max-soft-color)',
    '& .MuiDataGrid-toolbarContainer': {
        backgroundColor: 'var(--soft-bg)',
        flexDirection : 'row-reverse',
        [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap-reverse',
        },
        '& .MuiButtonBase-root': {
            color: 'var(--soft-color)',
            [theme.breakpoints.down('sm')]: {
                fontSize: '0',
            },
        },
    },
    '& .MuiDataGrid-footerContainer':{
        border: 'none',
    },
    '& .MuiInputBase-root': {
        color: 'var(--soft-color)',
    },
    '& .MuiTablePagination-root': {
        color: 'var(--soft-color)',
    },
    '& .MuiTablePagination-selectIcon': {
        color: 'var(--soft-color)',
    },
    '& .MuiTablePagination-actions': {
        color: 'var(--soft-color)',
    },
    '& .MuiDataGrid-selectedRowCount': {
        color: 'var(--soft-color)',
    },
    '& .MuiDataGrid-topContainer': {
        color: 'var(--dark-color)',
    },
    '& .MuiDataGrid-virtualScrollerContent':{
        backgroundColor: 'var(--soft-bg)',
    },
    '& .MuiSvgIcon-root': {
        color: 'var(--ultra-soft-color)',
    },
    '& .MuiDataGrid-cell': {
        borderColor: 'var(--max-soft-color)',
    },
    '& .MuiDataGrid-virtualScrollerRenderZone':{
        '--DataGrid-rowBorderColor': 'red', // Consider if this is still needed or can be themed
    },
    '& .MuiDataGrid-columnHeaderCheckbox':{
        backgroundColor: 'var(--dark-bg)',
    },
});