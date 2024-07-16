import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {capitalizeFirstLetter, formatToIndianCurrency} from "../../utils/common";
import {timeFormat } from 'd3-time-format';
import React, {useMemo, useState} from "react";
import {getFilteredData} from "../../utils/lineGraph.utils";

const monthFormat = timeFormat('%b %y');
const dateFormat = timeFormat('%d %b, %y');
const localStorageKey = "line_graph_granularity"
const LineGraphBox = ({reports}) => {
    const dailyTracker = reports.dailytracker
    if(!dailyTracker)
        return <div>Daily tracker data missing</div>

    const [granularity, setGranularity] = useState('weekly')

    useMemo(() => {
        const savedGranularity = localStorage.getItem(localStorageKey);
        if (savedGranularity) {
            setGranularity(savedGranularity);
        }
    }, []);

    const filteredData = getFilteredData(dailyTracker, granularity)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="tooltip-container">
                    <p className="tooltip-label">{dateFormat(label)}</p>
                    <p className="tooltip-value-container">
                        <span className="tooltip-value-first">{formatToIndianCurrency(payload[0].value, 2,false)}</span>
                    </p>
                    <p className="tooltip-value-container">
                        <span className="tooltip-value-second">{formatToIndianCurrency(payload[1].value, 2, false)}</span>
                    </p>
                </div>
            );
        }
    }

    return (
        <>
            <div>
                <h6 className="box-title"> Overall Progress </h6>
            </div>
            <hr/>
            <div className="box-content">
                <select
                    value={granularity}
                    className="box-select"
                    onChange={(e) => {
                        setGranularity(e.target.value);
                        localStorage.setItem(localStorageKey, e.target.value);
                    }}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <ResponsiveContainer width={'99%'} height={270} className="linegraph-box">
                    <LineChart
                        width={500}
                        height={300}
                        data={filteredData}
                        margin={{ top: 30}}>
                        <CartesianGrid vertical={false} horizontal={true} stroke="var(--ultra-soft-color)"/>
                        <XAxis
                            dataKey="date"
                            scale="time"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickLine={false}
                            tickFormatter={(tick) => monthFormat(new Date(tick))}
                            tick={{ fontSize: 12, fill: 'var(--ultra-soft-color)', fontFamily: 'Inter, sans-serif' }}
                            minTickGap={50}/>
                        <YAxis tickFormatter={(value) => { return formatToIndianCurrency(value, 0, true);}}
                               axisLine={false}
                               tickLine={false}
                               tick={{ fontSize: 12, fill: 'var(--ultra-soft-color)'}}
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend
                            iconSize={0}
                            formatter={(value) => capitalizeFirstLetter(value)}
                            wrapperStyle={{
                                fontSize: '14px',
                            }}/>
                        <Line type="monotone" dataKey="current" stroke="var(--secondary)" dot={false} strokeWidth={2}/>
                        <Line type="monotone" dataKey="invested" stroke="var(--ternary)" dot={false} strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default LineGraphBox