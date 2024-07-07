import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const MutualFunds = ({headers, data}) => {
    const rows: GridRowsProp[] = data.map((row) =>
        Object.fromEntries(headers.map((key, i) => [key, row[i]])),
    );
    const columns: GridColDef[] = headers && headers.length > 0 ? headers.map((columnName) => ({
        field: columnName,
        headerName: columnName,
        width: 150,
    })) : [];

    return (
        <div>
            <DataGrid rows={rows} columns={columns}/>
        </div>
    );
};

export default MutualFunds;
