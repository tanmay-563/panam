import React, {useEffect, useRef, useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from "recharts";
import convertToDountChartData from "../../utils/donutChart.utils";
import {formatPercentage, formatToIndianCurrency, getDisplayName} from "../../utils/common";

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

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} className="label">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomLegend = ({payload}) => {
        return (
            <div className="legend-box" style={{}}>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="legend-box-content">
                        <div style={{backgroundColor: entry.fill, width: entry.perc*3}} className="legend-box-square-icon"/>
                        <span className="legend-text">{getDisplayName(instrumentsMetadata, entry.name)} - {entry.perc.toFixed(2)}%</span>
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
                <ResponsiveContainer aspect={1.2} className="donutchart-box">
                    <PieChart width={330} height={250}>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                             innerRadius="40%" outerRadius="60%" stroke='var(--soft-bg)' strokeWidth={2}
                             label={renderCustomizedLabel}
                             labelLine={false}
                             />
                        <Tooltip content={CustomTooltip} />
                    </PieChart>
                </ResponsiveContainer>
                <CustomLegend payload={data}/>
            </div>
        </>
    )
}

export default DonutChartBox;