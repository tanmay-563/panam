import React, {useEffect, useState} from "react";
import {Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import convertToDountChartData from "../../utils/donutChart.utils";
import {formatToIndianCurrency, getDisplayName} from "../../utils/common";
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";

const MAX_ITEMS = 6;

const DonutChartBox = ({aggregatedData, metadata}) => {
    console.log(aggregatedData)
    if(!aggregatedData)
        return <div></div>
    let [_, instrumentsData] = aggregatedData
    const [data, setData] = useState([])
    const [dataSource, setDataSource] = useState('overall')
    const [showRadio, setShowRadio] = useState(false)
    const [radioValue, setRadioValue] = useState('name')

    useEffect(() => {
        handleChange(dataSource)
    }, []);

    useEffect(() => {
        handleChange(dataSource)
    }, [radioValue]);

    const instrumentsMetadata = metadata?.instrument

    const handleChange = (value) =>{
        setDataSource(value);

        let requiredData;
        if (value.toLowerCase() === "overall") {
            requiredData = instrumentsData;
            setRadioValue("name");
            setShowRadio(false);
        } else {
            requiredData = instrumentsData[value][radioValue];
            if (instrumentsData[value]?.category && Object.keys(instrumentsData[value].category).length) {
                setShowRadio(true);
            } else {
                setRadioValue("name");
                setShowRadio(false);
            }
        }

        setData(convertToDountChartData(requiredData, "current", MAX_ITEMS));
    }

    const CustomTooltip = ({ active, payload }) => {
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
        const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="var(--soft-color)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} className="label">
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

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue(event.target.value);
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
                {showRadio &&
                    <div className="radio-group">
                        <div className="radio-box">
                            <Radio
                                checked={radioValue === 'name'}
                                onChange={handleRadioChange}
                                value="name"
                                name="radio-buttons"
                                size="small"
                                inputProps={{ 'aria-label': 'name' }}
                            />
                            <p>Name</p>
                        </div>
                        <div className="radio-box">
                            <Radio
                                checked={radioValue === 'category'}
                                onChange={handleRadioChange}
                                value="category"
                                name="radio-buttons"
                                size="small"
                                inputProps={{ 'aria-label': 'category' }}
                            />
                            <p>Category</p>
                        </div>
                    </div>
                }
                <ResponsiveContainer aspect={1.2}>
                    <PieChart width={330} height={250}>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                             innerRadius="30%" outerRadius="60%" stroke='var(--soft-bg)' strokeWidth={2}
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