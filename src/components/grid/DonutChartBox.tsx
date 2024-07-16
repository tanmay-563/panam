import React, {useEffect, useRef, useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from "recharts";
import convertToDountChartData from "../../utils/donutChart.utils";
import {formatToIndianCurrency, getDisplayName} from "../../utils/common";

const MAX_ITEMS = 6;

const DonutChartBox = ({aggregatedData, metadata}) => {
    console.log(aggregatedData)
    if(!aggregatedData)
        return <div></div>
    let [_, instrumentsData] = aggregatedData
    const [data, setData] = useState([])

    useEffect(() => {
        setData(convertToDountChartData(instrumentsData, "current", MAX_ITEMS))
    }, []);

    const instrumentsMetadata = metadata?.instrument

    const handleChange = (value) =>{
        console.log(value)
        if(value.toLowerCase() == "overall")
            setData(convertToDountChartData(instrumentsData, "current", MAX_ITEMS))
        else{
            console.log(instrumentsData[value])
            setData(convertToDountChartData(instrumentsData[value]["name"], "current", MAX_ITEMS))
        }
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'var(--soft-bg)', border: '0.5px solid var(--max-soft-color)', padding: '5px', borderRadius: "5px" }}>
                    {payload.map((data, index) => (
                        <div key={index}>
                            <p style={{ fontSize: "12px", marginBottom: 3}}>
                                {`${getDisplayName(instrumentsMetadata, data.name)}`}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--ultra-soft-color)" }}>
                                {`${formatToIndianCurrency(data.value,2)} (${data.payload.perc.toFixed(2)}%)`}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 5, flex: 1 }}>
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                backgroundColor: entry.color,
                                marginRight: 10,
                            }}
                        />
                        <span style={{fontSize: 14}}>{getDisplayName(instrumentsMetadata, entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div>
                <h6 className="box-title"> Distribution </h6>
            </div>
            <hr/>
            <div className="box-content" >
                <select
                    className="box-select"
                    onChange={(e)=>{
                        handleChange(e.target.value)
                    }}>
                    <option key="Overall" value="overall">
                        Overall
                    </option>
                    {instrumentsMetadata.map((element) => (
                        <option key={element.Name} value={element.Name}>
                            {element.Label}
                        </option>
                    ))}
                </select>
                <ResponsiveContainer width={'99%'} height={270}>
                    <PieChart width={330} height={250}>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                             innerRadius="40%" outerRadius="60%" stroke='var(--soft-bg)' strokeWidth={2}
                             />
                        <Tooltip content={CustomTooltip} />
                        <Legend content={CustomLegend}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DonutChartBox;