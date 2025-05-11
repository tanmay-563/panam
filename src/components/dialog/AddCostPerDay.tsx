import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Loading from '../Loading';
import moment from 'moment';

const AddCostPerDay = ({ dialogType, setDialogType, ...props }) => {
    const [inputValues, setInputValues] = useState({
        Name: '',
        PurchaseDate: new Date(),
        PurchaseCost: 0,
    });
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setInputValues(prevData => ({ ...prevData, [key]: value }));
        if (error) setError(''); 
    };

    const handleSubmit = async () => {
        if (loading) return;
        setError('');

        const newEntry = { ...inputValues };
        let formInvalid = false;

        if (!String(newEntry.Name || '').trim()) {
            setError('Field "Name" is required.');
            formInvalid = true;
        }
        else if (!String(newEntry.PurchaseDate || '').trim()) {
            setError('Field "Purchase Date" is required.');
            formInvalid = true;
        } else if (!moment(newEntry.PurchaseDate, 'YYYY-MM-DD', true).isValid()) {
            setError('Field "Purchase Date" must be a valid date (YYYY-MM-DD).');
            formInvalid = true;
        }
        else if (!String(newEntry.PurchaseCost || '').trim()) {
            setError('Field "Purchase Cost" is required.');
            formInvalid = true;
        } else if (isNaN(Number(newEntry.PurchaseCost))) {
            setError('Field "Purchase Cost" must be a valid number.');
            formInvalid = true;
        }

        if (formInvalid) {
            setShake(true);
            setTimeout(() => setShake(false), 1000);
            return;
        }

        newEntry.PurchaseCost = Number(newEntry.PurchaseCost);

        setLoading(true);

        const successHandler = (response) => {
            setLoading(false);
            if (response.statusCode >= 200 && response.statusCode < 300) {
                setDialogType('');
                props.setAlert("success", "Success", "Cost per day entry added successfully.", 10);
                if (props.fetchSheetData) {
                    props.fetchSheetData(false);
                }
            } else {
                setError(response.message || "Failed to add entry. Please check the data.");
            }
        };

        const errorHandler = (err) => {
            setLoading(false);
            setError("An unexpected error occurred: " + (err.message || "Please try again."));
        };

        if (process.env.NODE_ENV === "development") {
            console.log("Submitting new cost per day entry (DEV):", newEntry);
            setTimeout(() => successHandler({ statusCode: 200 }), 1500);
        } else {
            // @ts-ignore
            google.script.run
                .withSuccessHandler(successHandler)
                .withFailureHandler(errorHandler)
                .addCostPerDayEntry(newEntry); 
        }
    };

    const formFields = [
        { name: 'Name', label: 'Name', type: 'text' },
        { name: 'PurchaseDate', label: 'Purchase Date', type: 'date' },
        { name: 'PurchaseCost', label: 'Purchase Cost', type: 'number' },
    ];

    return (
        <div className={`modal ${shake ? 'shake' : ''}`}>
            <span className="close" onClick={() => setDialogType('')}>
                <CloseIcon className="close-icon" />
            </span>
            <h1>Add New Cost Per Day Entry</h1>
            <div className="fields" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                {formFields.map((field) => (
                    <div key={field.name} className="field" style={{ margin: '16px 0' , width: '100%'}}>
                        <TextField
                            fullWidth
                            label={field.label}
                            type={field.type}
                            value={inputValues[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                            variant="outlined"
                            error={!!(error && error.toLowerCase().includes(`"${field.label.toLowerCase()}"`))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'var(--max-soft-color)' },
                                    '&:hover fieldset': { borderColor: 'var(--soft-color)' },
                                    color: 'var(--soft-color)',
                                },
                                '& .MuiInputLabel-root': { color: 'var(--soft-color)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--blue)'},
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--blue)',
                                },
                                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                    filter: 'invert(0.8)'
                                },
                            }}
                        />
                    </div>
                ))}
            </div>

            {error && <p className="error" style={{ color: 'var(--red)', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

            <div className="modalFooter" style={{ marginTop: '20px', textAlign: 'right' }}>
                {loading ? (
                    <Loading className="submit" />
                ) : (
                    <div className="submit" onClick={handleSubmit}>
                        SUBMIT
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCostPerDay