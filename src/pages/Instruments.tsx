import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';
import {formatPercentage, formatToIndianCurrency, getDisplayName} from "../utils/common";
import {useEffect, useMemo, useState} from "react";
import {useTheme} from "@mui/material";
import {useParams} from "react-router-dom";
import moment from "moment/moment";

function getLocalStorageKey(instrument){
    return "datagrid_column_visibility_"+instrument;
}

const Instruments = ({
                         headerMap,
                         transactionsRowMap,
                         metadata,
                         instrument
                     }) => {
    const { instrumentId } = useParams();
    if(!instrument){
        instrument = instrumentId
    }
    if(!transactionsRowMap)
        return <div></div>

    const theme = useTheme();
    const instrumentMetadata = metadata?.instrument || {};
    const columnMetadata = metadata?.column?.filter((item) => item.Instrument.toLowerCase() == instrument.toLowerCase()) || {};

    const [columnVisibility, setColumnVisibility] = useState({});
    const [loading, setLoading] = useState(true)

    useMemo(() => {
        const savedVisibility = localStorage.getItem(getLocalStorageKey(instrument));
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
            setLoading(false);
        }
        else{
            let columnMetadata= metadata["column"]
            let columnVisibilityModel = {}
            columnMetadata.forEach(item => {
                columnVisibilityModel[item.Column] = true;
            });
            setColumnVisibility(columnVisibilityModel)
            setLoading(false);
        }
    }, [instrument]);

    useEffect(() => {
        if(Object.keys(columnVisibility).length){
            localStorage.setItem(getLocalStorageKey(instrument), JSON.stringify(columnVisibility));
        }
    }, [columnVisibility]);

    const dataTypeMap = columnMetadata.reduce((acc, item)=>{
        acc[item.Column] = item.DataType
        return acc;
    }, {});

    const rows: GridRowsProp[] = transactionsRowMap[instrument]

    const headers = headerMap[instrument]
    const columns: GridColDef[] = headers && headers.length > 0 ?
        headers.map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
            minWidth: 150,
            headerClassName: 'datagrid-header',
            valueFormatter: (params) =>{
                if(columnName in dataTypeMap){
                    if(dataTypeMap[columnName].toLowerCase() == "date"){
                        return moment(params).format("DD/MM/YYYY")
                    }
                    else if(dataTypeMap[columnName].toLowerCase() == "float"){
                        return params?.toFixed(2)
                    }
                    else if(dataTypeMap[columnName].toLowerCase() == "currency"){
                        return formatToIndianCurrency(params, 2, false);
                    }else if(dataTypeMap[columnName].toLowerCase() == "percent"){
                        return formatPercentage(params);
                    }
                }
                else if(columnName.toLowerCase() == "xirr"){
                    return formatPercentage(params);
                }
            },
            cellClassName: (params) => {
                if(params.field.toLowerCase() == "current"){
                    return (params.row.Invested < params.value) ? 'green-color' : (params.row.Invested > params.value) ? 'red-color' : '';
                }
                if(params.field.toLowerCase() == "gains"){
                    return params.row.Gains > 0 ? 'green-color' : params.row.Gains < 1 ? 'red-color' : '';
                }
            }
    })) : [];

    const dataGridStyles = {
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
            '--DataGrid-rowBorderColor': 'red',
        }
    };

    return loading ?
         <div/> :
        (<div>
            <div className="title">{getDisplayName(instrumentMetadata, instrument)}</div>
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
                        quickFilterProps: {
                            debounceMs: 500
                        }
                    },
                }}
                pageSizeOptions={[5, 10, 100]}
                sx={dataGridStyles}
                autoHeight={true}
                getRowClassName={(params) => 'datagrid-row'}
                disableDensitySelector
                // checkboxSelection //TODO add selection
            />
        </div>);
};

export default Instruments;
