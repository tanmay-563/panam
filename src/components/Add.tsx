import React, {useState} from 'react'
import Autosuggest from 'react-autosuggest';
import instruments from "../pages/Instruments";
import AddFields from "./AddFields";

type Props = {
    setOpenAdd,
    instruments,
    dataMap,
    headerMap,
};

const Add = (props: Props) => {
    const [value, setValue] = useState('');
    const [instrumentTypeSuggestions, setInstrumentTypeSuggestions] = useState([]);
    const getInstrumentTypeSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : props.instruments.filter(instrument =>
            instrument.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const renderSuggestion = (suggestion) => (
        <div>{suggestion}</div>
    );

    const handleSubmit = (e) =>{
        e.preventDefault()
    }

    return (
        <div className="add">
            <div className="modal">
                <span className="close" onClick={()=>props.setOpenAdd(false)}>X</span>
                <h1> Add new transaction</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Instrument Type</label>
                        <Autosuggest
                            suggestions={instrumentTypeSuggestions}
                            onSuggestionsFetchRequested={({ value }) => {
                                setInstrumentTypeSuggestions(getInstrumentTypeSuggestions(value));
                            }}
                            onSuggestionsClearRequested={() => []}
                            getSuggestionValue={value=>value}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                id: 'instrument',
                                value,
                                onChange: onChange,
                            }}
                        />
                    </div>
                </form>
                <AddFields instrument={value} headerMap={props.headerMap} dataMap={props.dataMap}/>
            </div>
        </div>
    )
}

export default Add