import {
    convertToJson,
    formatPercentage,
    formatToIndianCurrency,
    getMainBoxData
} from "../../utils/common";
import DynamicIcons from "../icons/DynamicIcons";
import React from "react";

const MAX_ITEMS = 6
const MainBox = ({
                     metadata,
                     aggregatedData,
}) => {
    const instrumentsMetadata = metadata?.instrument
    let [overallData, instrumentsData] = aggregatedData
    const instrumentsMetadataJson = convertToJson(instrumentsMetadata)
    let sortedInstruments = getMainBoxData(instrumentsData, MAX_ITEMS, instrumentsMetadataJson);

    return (
        <>
            <div>
                <h6 className="box-title"> My Assets </h6>
            </div>
            <hr/>
            <div className="box-content">
                <div className="mini-box-totals" title={formatToIndianCurrency(overallData.current, 0, false)}>
                    <h1>
                        {formatToIndianCurrency(overallData.current)}
                    </h1>
                    <h5 data-prefix={overallData.difference >= 0 ? "\u25B4" : "\u25BE"} className={`${overallData.difference >= 0 ? 'green-color' : 'red-color'}`}>
                        {formatToIndianCurrency(overallData.difference)}
                    </h5>
                </div>
                <div className="mini-box-container">
                    {Array.from({ length: MAX_ITEMS }).map((_, index) => {
                        if (sortedInstruments && index < sortedInstruments.length) {
                            const instrument = sortedInstruments[index];
                            const instrumentId = instrument.instrument;
                            const currentAmount = instrument.current;
                            const differenceAmount = instrument.difference;
                            const isProfitable = differenceAmount >= 0;
                            const hasZeroDifference = differenceAmount == 0;
                            const percentageChange = formatPercentage(differenceAmount/currentAmount)
                            return (
                                <div key = {index}>
                                    <div className="mini-box">
                                        <DynamicIcons name={instrumentsMetadataJson[instrumentId]["Icon"]} className="icon" />
                                        <p>
                                            {instrumentsMetadataJson[instrumentId]["Label"]}
                                        </p>
                                        <div className="mini-numbers">
                                            <h5>
                                                {formatToIndianCurrency(currentAmount)}
                                            </h5>
                                            {hasZeroDifference ?
                                                <h6>-</h6> :
                                                <h6 data-prefix={isProfitable ? "\u25B4" : "\u25BE"} className={`${isProfitable ? 'green-color' : 'red-color'}`}>
                                                    {formatToIndianCurrency(differenceAmount)}
                                                </h6>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="mini-box" key={index}>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default MainBox