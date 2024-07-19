import {formatToIndianCurrency, getDisplayName} from "../../../utils/common";
import React from "react";

const InstrumentDetails = ({data, metadata}) => {
    const instrumentsMetadata = metadata?.instrument

    return (
        <div className="instruments-card">
            {Object.keys(data).map((key) => (
                <div className="instrument" key={key}>
                    <div className="instrument-name">
                        {getDisplayName(instrumentsMetadata, key)}
                    </div>
                    <div className="instrument-value">
                        <div>
                            {formatToIndianCurrency(data[key].current, 2, false)}
                        </div>
                        <div>
                            {formatToIndianCurrency(data[key].invested, 2, false)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default InstrumentDetails;