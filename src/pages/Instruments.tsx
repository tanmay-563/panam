import {DataGrid, GridRowsProp, GridColDef, GridToolbar} from '@mui/x-data-grid';
import {formatPercentage, formatToIndianCurrency, getDataTypeMap, getDisplayName} from "../utils/common";
import {useEffect, useMemo, useState} from "react";
import {useTheme} from "@mui/material";
import {useParams} from "react-router-dom";
import moment from "moment/moment";
import AddIcon from "../../public/add.svg";

function getLocalStorageKey(instrument){
    return "datagrid_column_visibility_"+instrument;
}

const Instruments = ({
                         headerMap,
                         transactionsRowMap,
                         metadata,
                         instrument,
                         setSelectedMenuItem,
                         setDialogType,
                     }) => {
    const [columnVisibility, setColumnVisibility] = useState({});
    const [loading, setLoading] = useState(true)

    const { instrumentId } = useParams();
    if(!instrument){
        instrument = instrumentId && instrumentId[0] == ':' ? instrumentId.substring(1) : instrumentId
    }

    const theme = useTheme();
    const instrumentMetadata = metadata?.instrument;
    const columnMetadata = metadata?.column?.filter((item) => item.Instrument.toLowerCase() == instrument.toLowerCase()) || {};

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
    }, [instrument, metadata]);

    useEffect(() => {
        if(Object.keys(columnVisibility).length){
            localStorage.setItem(getLocalStorageKey(instrument), JSON.stringify(columnVisibility));
        }
    }, [columnVisibility]);

    useEffect(()=> {
        setSelectedMenuItem(instrument)
    }, [instrument])

    if(!transactionsRowMap)
        return <div></div>

    const dataTypeMap = getDataTypeMap(columnMetadata)

    const rows: GridRowsProp[] = transactionsRowMap[instrument]

    const headers = headerMap[instrument] ? headerMap[instrument].map(String) : [];

    const columns: GridColDef[] = headers && headers.length > 0 ?
        headers.map((columnName) => ({
            field: columnName,
            headerName: columnName,
            flex: 1,
            minWidth: 150,
            headerClassName: 'datagrid-header',
            renderCell: (params) => {
                const columnName = params.field;
                const value = params.value;

                if (columnName in dataTypeMap) {
                    if (dataTypeMap[columnName].toLowerCase() === 'date') {
                        return moment(value).format('DD/MM/YYYY');
                    } else if (dataTypeMap[columnName].toLowerCase() === 'float') {
                        return typeof value === "number" ? value?.toFixed(2) : 0;
                    } else if (dataTypeMap[columnName].toLowerCase() === 'currency') {
                        return formatToIndianCurrency(value, 2, false);
                    } else if (dataTypeMap[columnName].toLowerCase() === 'percent') {
                        return formatPercentage(value);
                    }
                } else if (columnName.toLowerCase() === 'xirr') {
                    return formatPercentage(value);
                }

                return value;
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
        },
        '& .MuiDataGrid-columnHeaderCheckbox':{
            backgroundColor: 'var(--dark-bg)',
        },
    };

    return loading ?
         <div/> :
        (<div>
            <div className="title-box">
                <div className="box-title">
                    {getDisplayName(instrumentMetadata, instrument)}
                </div>
                <div className="add-transaction-box" onClick={()=>setDialogType('addTransaction')}>
                    <AddIcon/>
                    Add Transaction
                </div>
            </div>
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
                // checkboxSelection
            />
        </div>);
};

export default Instruments;
