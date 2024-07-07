import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const Transactions = ({headers, data, instrument}) => {
    console.log(instrument)
    const rows: GridRowsProp[] = data[instrument].map((row) =>
        Object.fromEntries(headers[instrument].map((key, i) => [key, row[i]])),
    );
    const columns: GridColDef[] = headers[instrument] && headers[instrument].length > 0 ?
        headers[instrument].map((columnName) => ({
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

export default Transactions;
