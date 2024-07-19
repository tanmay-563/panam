import React from "react";
import {formatPercentage, formatToIndianCurrency, getDisplayName} from "../../../utils/common";
import InstrumentDetails from "./InstrumentDetails";

const ValueCard = ({ label, value, valueClass = ''}) => (
    <div>
        <span>{label}</span>
        <p className={valueClass}>{value}</p>
    </div>
);

const DetailsBox = ({aggregatedData, metadata}) => {
    const [overallData, instrumentsData] = aggregatedData

    const overallReturns = overallData.current - overallData.invested;
    const overallReturnsPerc = overallReturns/overallData.current;

    return (
        <>
            <div>
                <h6 className="box-title"> Details </h6>
            </div>
            <hr/>
            <div className="box-content">
                <div className="overall-card">
                    <div>
                        <ValueCard
                            label="Current"
                            value={formatToIndianCurrency(overallData.current, 2, false)}
                        />
                        <ValueCard
                            label="Invested"
                            value={formatToIndianCurrency(overallData.invested, 2, false)}
                        />
                    </div>
                    <div>
                        <ValueCard
                            label="Total Returns"
                            value={`${formatToIndianCurrency(overallReturns, 2, false)} (${formatPercentage(overallReturnsPerc)})`}
                            valueClass={overallReturns > 0 ? 'green-color' : overallReturns < 0 ? 'red-color' : ''}
                        />
                        <ValueCard
                            label="XIRR"
                            value={formatPercentage(overallData.xirr)}
                        />
                    </div>
                </div>
                <InstrumentDetails data={instrumentsData} metadata={metadata}/>
            </div>
        </>
    )
}

export default DetailsBox