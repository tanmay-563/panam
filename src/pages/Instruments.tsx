import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';

const Instruments = ({headers, data, instrument}) => {
    if(!instrument){
        return <div></div>
    }
    const rows: GridRowsProp[] = data[instrument].map((row) =>
        Object.fromEntries(headers[instrument].map((key, i) => [key, row[i]])),
    );
    const columns: GridColDef[] = headers[instrument] && headers[instrument].length > 0 ?
        headers[instrument].map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
    })) : [];

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                classes={{
                    cell: 'cellStyle',
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    },
                }}
                slots={
                    {toolbar: GridToolbar}
                }
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
                pageSizeOptions={[5, 10, 100]}
                sx={{
                    '& .MuiDataGrid-toolbarContainer': {
                        backgroundColor: 'var(--soft-color)',
                    },
                    '& .MuiInputBase-root': {
                        color: 'var(--dark-bg)',
                    },
                    '& .MuiTablePagination-root ': {
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
                    }
                }}
                autoHeight={true}
            />
        </div>
    );
};

export default Instruments;
