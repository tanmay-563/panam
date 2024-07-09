import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';
import {getDisplayName} from "../utils/helper";
import {useEffect, useState} from "react";

function getLocalStorageKey(instrument){
    return "datagrid_column_visibility_"+instrument;
}

const Instruments = ({
                         headerMap,
                         contentRowMap,
                         config,
                         instrument
                     }) => {
    if(!instrument){
        return <div></div>
    }
    const instrumentConfig = config?._instruments || {};

    const [columnVisibility, setColumnVisibility] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedVisibility = localStorage.getItem(getLocalStorageKey(instrument));
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
            setLoading(false);
        }
        else{
            let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());
            let columnVisibilityModel = {}
            columnConfig.forEach(item => {
                columnVisibilityModel[item.Column] = item.isInitiallyVisible;
            });
            setColumnVisibility(columnVisibilityModel)
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(getLocalStorageKey(instrument), JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const rows: GridRowsProp[] = contentRowMap[instrument]

    const headers = headerMap[instrument]
    const columns: GridColDef[] = headers && headers.length > 0 ?
        headers.map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
    })) : [];

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

    return loading ?
         <div/> :
        (<div>
            <div className="title">{getDisplayName(instrumentConfig, instrument)}</div>
            <DataGrid
                rows={rows}
                columns={columns}
                classes={{
                    cell: 'cellStyle',
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    }
                }}
                columnVisibilityModel={columnVisibility}
                onColumnVisibilityModelChange={(params) => {
                    setColumnVisibility(params);
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
        </div>);
};

export default Instruments;
