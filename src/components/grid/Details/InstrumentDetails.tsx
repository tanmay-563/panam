import {formatPercentage, formatToIndianCurrency, getDisplayName} from "../../../utils/common";
import React, {useState} from "react";
import {getInstrumentDetailsData} from "../../../utils/detailsBox.utils";

const InstrumentDetails = ({aggregatedData, metadata, dataSource, onChange}) => {
    const [sortValue, setSortValue] = useState("")
    const data = getInstrumentDetailsData(aggregatedData, dataSource, sortValue);
    if(!data || Object.keys(data).length == 0)
        return <div></div>

    const valuesTypes = ["Current (Invested)", "Returns (%)", "XIRR"]
    const [valueTypeIndex, setValueTypeIndex] = useState(0);

    const instrumentsMetadata = metadata?.instrument

    return (
        <div className="instruments-card">
            <div className='instruments-card-top'>
                <span>
                    {dataSource != "overall" ? "  " + getDisplayName(instrumentsMetadata, dataSource) : "  Overall"}
                </span>
                <span onClick={() => onChange("overall")} className={dataSource != "overall" ? "back-button" : ""}>
                    {dataSource != "overall" && "\u00AB Back"}
                </span>
            </div>
            <div className="instruments-card-options">
                <div className="sort-box">
                    <select
                        name="Sort"
                        className={`box-select value-sorter ${sortValue !== '' ? 'fit-content' : ''}`}
                        defaultValue="sort"
                        onChange={(e)=>{
                            setSortValue(e.target.value)
                        }}>
                        <option value="sort" disabled style={{color: 'red'}}>
                            Sort
                        </option>
                        <option value="current">
                            Current
                        </option>
                        <option value="returns">
                            Returns
                        </option>
                        <option value="xirr">
                            XIRR
                        </option>
                    </select>
                </div>
                <div className="value-selector" onClick={()=> setValueTypeIndex((valueTypeIndex+1)%valuesTypes.length)}>
                    {valuesTypes[valueTypeIndex]}
                </div>
            </div>
            {Object.keys(data).map((key) => (
                <div className="instrument" key={key}>
                    <div className={`instrument-name ${dataSource === "overall" ? 'clickable': ''}`} onClick={() => onChange(key)}>
                        {getDisplayName(instrumentsMetadata, key)}
                    </div>
                    {   valueTypeIndex == 0 ?
                        <div className="instrument-value" onClick={()=> setValueTypeIndex((valueTypeIndex+1)%valuesTypes.length)}>
                            <div className={data[key].current > data[key].invested ? 'green-color' : data[key].current < data[key].invested ? 'red-color': ''}>
                                {formatToIndianCurrency(data[key].current, 0, false)}
                            </div>
                            <div>
                                {formatToIndianCurrency(data[key].invested, 0, false)}
                            </div>
                        </div> : valueTypeIndex == 1 ?
                        <div className="instrument-value" onClick={()=> setValueTypeIndex((valueTypeIndex+1)%valuesTypes.length)}>
                            <div className={data[key].returns > 0 ?
                                'green-color' : data[key].returns < 0 ? 'red-color': ''}>
                                {formatToIndianCurrency(data[key].returns, 0, false)}
                            </div>
                            <div>
                                {formatPercentage(data[key].returns/data[key].current)}
                            </div>
                        </div> :
                        <div className="instrument-value" onClick={()=> setValueTypeIndex((valueTypeIndex+1)%valuesTypes.length)}>
                            <div className={data[key].xirr > 0 ? 'green-color' : data[key].xirr < 0 ? 'red-color' : ''}>
                                {formatPercentage(data[key].xirr)}
                            </div>
                            <div></div>
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}

export default InstrumentDetails;