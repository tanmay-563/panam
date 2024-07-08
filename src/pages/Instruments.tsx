import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';
import config from "../config/default.json";

type Props = {
    headers: any,
    data: any,
    instrument: string
};

const Instruments = (props: Props) => {
    if(!props.instrument){
        return <div></div>
    }

    const rows: GridRowsProp[] = props.data[props.instrument].map((row) =>
        Object.fromEntries(props.headers[props.instrument].map((key, i) => [key, row[i]])),
    );

    const columns: GridColDef[] = props.headers[props.instrument] && props.headers[props.instrument].length > 0 ?
        props.headers[props.instrument].map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
    })) : [];

    const columnVisibilityModel = columns.reduce((acc, column) => {
        acc[column.field] = config.datagrid.initialState.columns.visibleColumns.includes(column.field); // Set true for 'id' and 'name', false for others
        return acc;
    }, {});

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
            <div className="title">{props.instrument}</div>
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
