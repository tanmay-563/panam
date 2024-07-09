import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';

const Instruments = ({
                         headerMap,
                         contentRowMap,
                         config,
                         instrument
                     }) => {
    if(!instrument){
        return <div></div>
    }
    let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());

    const headers = headerMap[instrument]

    const rows: GridRowsProp[] = contentRowMap[instrument]

    const columns: GridColDef[] = headers && headers.length > 0 ?
        headers.map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
    })) : [];

    let columnVisibilityModel = {}
    columnConfig.forEach(item => {
            columnVisibilityModel[item.Column] = item.isInitiallyVisible;
    });

    const dataGridStyles = {
        '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: 'var(--soft-color)',
        },
        '& .MuiInputBase-root': {
            color: 'var(--dark-bg)',
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
        }
    };

    return (
        <div>
            <div className="title">{instrument}</div>
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
                    columns: {
                        columnVisibilityModel: columnVisibilityModel,
                    }
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
                sx={dataGridStyles}
                autoHeight={true}
            />
        </div>
    );
};

export default Instruments;
