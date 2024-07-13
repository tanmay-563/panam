import {formatPercentage, formatToIndianCurrency, getDisplayName, getMainBoxContent} from "../../utils/helper";
import DynamicIcons from "../DynamicIcons";
import React, {useCallback} from "react";
import {Link} from "react-router-dom";

const MAX_ITEMS = 6
const MainBox = ({
                     transactionsColumnMap,
                     instruments,
                     metadata,
                     setSelectedMenuItem
}) => {
    const instrumentsMetadata = metadata?.instrument
    let [overallData, instrumentsData] = getMainBoxContent(transactionsColumnMap, instruments, MAX_ITEMS)
    const handleClick = useCallback((instrument) => {
        setSelectedMenuItem(instrument);
    }, [setSelectedMenuItem]);

    return (
        <div className="main-box">
            <h6> MY ASSETS </h6>
            <div className="mini-box-totals">
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
                        const instrumentId = instrument.instrument;
                        const currentAmount = instrument.current;
                        const differenceAmount = instrument.difference;
                        const isProfitable = differenceAmount >= 0;
                        const hasZeroDifference = differenceAmount == 0;
                        const percentageChange = formatPercentage(differenceAmount/currentAmount)
                        return (
                            <div key = {index}>
                                {instruments.includes(instrumentId) ?
                                <Link
                                    to={`/transactions/${instrumentId}`}
                                    onClick={()=>handleClick(instrumentId)}
                                    className="mini-box">
                                    <DynamicIcons name={instrumentId} className="icon" />
                                    <p>
                                        {getDisplayName(instrumentsMetadata, instrumentId)}
                                    </p>
                                    <div className="mini-numbers">
                                        <h5>
                                            {formatToIndianCurrency(currentAmount)}
                                        </h5>
                                        {hasZeroDifference ?
                                            <h6>-</h6> :
                                            <h6 data-prefix={isProfitable ? "\u25B4" : "\u25BE"} className={`${isProfitable ? 'green-color' : 'red-color'}`}>
                                                {percentageChange}
                                            </h6>
                                        }
                                    </div>
                                </Link> :
                                <div
                                    className="mini-box">
                                    <DynamicIcons name={instrumentId} className="icon" />
                                    <p>
                                        {getDisplayName(instrumentsMetadata, instrumentId)}
                                    </p>
                                    <div className="mini-numbers">
                                        <h5>
                                            {formatToIndianCurrency(currentAmount)}
                                        </h5>
                                        {hasZeroDifference ?
                                            <h6>-</h6> :
                                            <h6 data-prefix={isProfitable ? "\u25B4" : "\u25BE"} className={`${isProfitable ? 'green-color' : 'red-color'}`}>
                                                {percentageChange}
                                            </h6>
                                        }
                                    </div>
                                </div>
                                }
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