import React, {useState} from 'react'
// import Autosuggest from 'react-autosuggest';
import Fields from "./Fields";
import AutosuggestWrapper from "./AutosuggestWrapper";

const Add = ({
                 setOpenAdd,
                 instruments,
                 contentColumnMap,
                 headerMap,
             }) => {
    const [selectedInstrument, setSelectedInstrument] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault()
    }

    const handleInstrumentSelected = (suggestion) => {
        setSelectedInstrument(suggestion)
    };

    return (
        <div className="add">
            <div className="modal">
                <span className="close" onClick={()=>setOpenAdd(false)}>X</span>
                <h1> Add new transaction</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Instrument Type</label>
                        <AutosuggestWrapper
                            suggestions={instruments}
                            onSuggestionSelected={handleInstrumentSelected}
                            placeholder=""
                        />
                    </div>
                </form>
                <Fields instrument={selectedInstrument} headerMap={headerMap} contentColumnMap={contentColumnMap}/>
            </div>
        </div>
    )
}

export default Add