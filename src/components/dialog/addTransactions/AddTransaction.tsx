import React, {useMemo, useState} from 'react'
import Fields from "./Fields";
import Loading from "../../Loading";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import DynamicSelect from "../../DynamicSelect";

const AddTransaction = ({...props}) => {
    const instrumentMetadata = props.metadata?.instrument;

    if(!instrumentMetadata)
        return <div></div>

    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({})
    const [error, setError] = useState('')
    const [shake, setShake] = useState(false)
    const [loading, setLoading] = useState(false)
    const [columnMetadata, setColumnMetadata] = useState({})
    const [requiredHeaders, setRequiredHeaders] = useState([])

    useMemo(() => {
        if(props.instruments.includes(props.selectedMenuItem)){
            try{
                const colData = props.metadata?.column?.filter(item => item.Instrument.toLowerCase() === props.selectedMenuItem.toLowerCase());
                setColumnMetadata(colData);
                setRequiredHeaders(colData.filter(metadata => metadata.IsAutomated != true).map(metadata => metadata.Column));
            }
            catch (e){
                console.error(e)
                setColumnMetadata({})
                setRequiredHeaders([])
            }
        }
        else
            setColumnMetadata({});
    }, [props.selectedMenuItem, props.instruments, props.metadata?.column]);

    const handleSubmit = () => {
        if (loading) return;

        const formInvalid = requiredHeaders.some(header => !(header in inputValues));

        if (formInvalid) {
            setShake(true);
            setTimeout(() => setShake(false), 1000);
            setError("All fields are required.");
            return;
        }

        const successHandler = (response) => {
            setLoading(false);
            if(response.statusCode >= 200 && response.statusCode < 300){
                props.setDialogType('');
                props.setAlert("success", "Success", "Transaction added successfully.", 10);
                props.fetchSheetData(false);
            }
            else{
                const message = response.instrumentSheetUrl
                    ? `${response.status}. Click <a href=${response.instrumentSheetUrl} target="_blank"><b>here</b></a> to open the sheet.`
                    : `${response.status}.`;
                props.setAlert("error", "Error", message, 15);
            }
        };

        const errorHandler = () => {
            setLoading(false);
            props.setDialogType('');
            props.setAlert("error", "Error", "Failed to add transaction.", 10);
        };

        if (process.env.NODE_ENV === "development") {
            setLoading(true);
            let resp = {
                statusCode: 200,
            }
            setTimeout(() => {
                setLoading(false);
                successHandler(resp);
            }, 1500);
        } else {
            setLoading(true);
            // @ts-ignore
            google.script.run
                .withSuccessHandler((response) => {successHandler(response)})
                .withFailureHandler(errorHandler)
                .updateInstrumentTransactions(props.selectedMenuItem, inputValues);
        }
    };

    const handleInstrumentSelected = (suggestion) => {
        props.setSelectedMenuItem(suggestion);
        navigate('transactions/:'+suggestion)
    };

    const handleInputChange = (key, value) => {
        setInputValues(prevData => ({ ...prevData, [key]: value }));
    };

    return (
        <div className={`modal ${shake ? 'shake' : ''}`} >
            <span className="close" onClick={()=>{
                props.setDialogType('')
            }}>
                <CloseIcon className="close-icon"/>
            </span>
            <h1> Add new transaction</h1>
            <DynamicSelect
                selectedValue={props.instruments.includes(props.selectedMenuItem) ? props.selectedMenuItem : ''}
                onSelectionChange={handleInstrumentSelected}
                data={instrumentMetadata}
                valueField="Name"
                labelField="Label"
                uniqueId="addTransaction"
                inputLabel="Instrument Type"
            />
            <Fields
                instrument={props.selectedMenuItem}
                requiredHeaders={requiredHeaders}
                transactionsColumnMap={props.transactionsColumnMap}
                inputValues={inputValues}
                onInputChange={handleInputChange}
                columnMetadata={columnMetadata}
                error={error}
            />
            {error != '' && <p className="error">{error}</p>}
            <div className="modalFooter">
                {props.instruments.includes(props.selectedMenuItem) ?
                    (loading ?
                    <Loading className="submit"/> :
                    <div className="submit" onClick={handleSubmit}>
                        SUBMIT
                    </div> ) :
                    <div></div>
                }
            </div>
        </div>
    )
}

export default AddTransaction