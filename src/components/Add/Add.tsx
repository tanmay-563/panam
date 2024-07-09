import React, {useEffect, useState} from 'react'
import Fields from "./Fields";
import AutosuggestWrapper from "./AutosuggestWrapper";

const Add = ({
                 instruments,
                 headerMap,
                 contentColumnMap,
                 selectedMenuItem,
                 setOpenAdd,
                config
             }) => {
    console.log(selectedMenuItem)
    const [selectedInstrument, setSelectedInstrument] = useState('');

    useEffect(()=>{
        if(instruments.includes(selectedMenuItem)){
            setSelectedInstrument(selectedMenuItem)
        }
    }, selectedMenuItem)

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
                <form onSubmit={handleSubmit} className="form">
                    <div className="fields">
                        <div className="field">
                            <label>Instrument Type</label>
                            <div>
                                <AutosuggestWrapper
                                    suggestions={instruments}
                                    onSuggestionSelected={handleInstrumentSelected}
                                    placeholder={selectedInstrument}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <Fields
                    instrument={selectedInstrument}
                    headerMap={headerMap}
                    contentColumnMap={contentColumnMap}
                    config={config}
                />
            </div>
        </div>
    )
}

export default Add