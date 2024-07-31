import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {getDisplayName} from "../utils/common";
import InstrumentSelector from "../components/InstrumentSelector";

const DeleteInstrument = ({   metadata,
                              setAlert,
                              fetchSheetData,
                              setDialogType,
                              setDialogProps,
                              handleInstrumentDelete}) => {
    const [instrumentToDelete, setInstrumentToDelete] = useState('');
    const instrumentMetadata = metadata?.instrument;

    if(!instrumentMetadata)
        return <div></div>

    const handleInstrumentSelected = (instrument) => {
        setInstrumentToDelete(instrument);
        setDialogType("deleteConfirmation")
        setDialogProps({
            title: "Delete Instrument",
            content: (
                <>
                    Are you certain you wish to delete the instrument {getDisplayName(instrumentMetadata, instrument)}?
                    This action will result in the <strong>deletion of all data</strong> associated with the instrument.
                </>
            ),
            onConfirm: ()=>handleInstrumentDelete(instrument)
        })
    }

    return (
        <div className="delete-instrument">
            <div className="delete-card">
                <span className="label">Select Instrument to delete</span>
                <InstrumentSelector
                    selectedInstrument={instrumentToDelete}
                    onChange={handleInstrumentSelected}
                    instrumentMetadata={instrumentMetadata}
                />
            </div>
        </div>
    )
}

export default DeleteInstrument