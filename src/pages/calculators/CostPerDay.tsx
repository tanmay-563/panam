import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { getDataGridStyles } from '../../styles/ts-styles/muiDataGridStyles';
import moment from "moment/moment";
import {formatToIndianCurrency} from "../../utils/common";
import AddIcon from "../../../public/add.svg";

const CostPerDay = ({
    costPerDayRowMap,
    setDialogType
}) => {
    if (!costPerDayRowMap || !costPerDayRowMap.length) {
        return <div></div>;
    }
    const theme = useTheme();
    const dataGridStyles = getDataGridStyles(theme);
    
    const sampleRow = costPerDayRowMap[0];
    const columns = Object.keys(sampleRow).map((key): GridColDef => {
        const lowerKey = key.toLowerCase();
    
        return {
          field: key,
          headerName: key,
          flex: lowerKey === "id" ? 1 : lowerKey === "name" ? 3 : 2,
          minWidth: 50,
          headerClassName: 'datagrid-header',
          type: typeof sampleRow[key] === 'number' ? 'number' : 'string',
    
          // Apply custom render logic 
          renderCell:
            lowerKey.includes('cost')
              ? (params) => {
                    const value = params.value;
                    return formatToIndianCurrency(value, 2, false);
                }
              : lowerKey.includes('date')
              ? (params) => {
                    const value = params.value;
                    return moment(value).format('DD/MM/YYYY');
                } : undefined,
        };
    });
    
    return (
        <div>
            <div className="title-box">
                <h6 className="box-title"> Cost Per Day </h6>
                <div className="add-transaction-box" onClick={()=>setDialogType('addCostPerDayEntry')}>
                    <AddIcon/>
                    <p> Add Entry </p>
                </div>
            </div>
            <DataGrid
                rows={costPerDayRowMap}
                columns={columns}
                classes={{
                    cell: 'cellStyle',
                }}
                sx={dataGridStyles}
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
                disableDensitySelector
            />
        </div>
    )
}

export default CostPerDay