import {formatPercentage, formatToIndianCurrency, getDisplayName, getMainBoxContent} from "../../utils/helper";
import DynamicIcons from "../DynamicIcons";
import React from "react";

const MAX_ITEMS = 6
const MainBox = ({
                     contentColumnMap,
                     instruments,
                     config
}) => {
    let [overallData, instrumentsData] = getMainBoxContent(contentColumnMap, instruments)
    console.log(JSON.stringify(instrumentsData))

    return (
        <div className="main-box">
            <h6> MY ASSETS </h6>
            <div className="numbers">
                <h1>
                    {formatToIndianCurrency(overallData.current)}
                </h1>
                <h5 data-prefix={overallData.difference >= 0 ? "\u25B4" : "\u25BE"} className={`${overallData.difference >= 0 ? 'green-color' : 'red-color'}`}>
                    {formatToIndianCurrency(overallData.difference)}
                </h5>
            </div>
            <div className="mini-box-container">
                {Array.from({ length: MAX_ITEMS }).map((_, index) => {
                    if (index < instrumentsData.length) {
                        const instrument = instrumentsData[index];

                        return (
                            <div className="mini-box" key={index}>
                                <DynamicIcons name={instrument.instrument} className="icon" />
                                <p>
                                    {getDisplayName(config?._instruments, instrument.instrument)}
                                </p>
                                <div className="mini-numbers">
                                    <h5>
                                        {formatToIndianCurrency(instrument.current)}
                                    </h5>
                                    {instrument.difference == 0 ?
                                        <h6>-</h6> :
                                        <h6 data-prefix={instrument.difference >= 0 ? "\u25B4" : "\u25BE"} className={`${instrument.difference >= 0 ? 'green-color' : 'red-color'}`}>
                                            {formatPercentage(instrument.difference/instrument.current)}
                                        </h6>
                                    }
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
    )
}

export default MainBox