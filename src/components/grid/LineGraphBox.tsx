import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatToIndianCurrency} from "../../utils/helper";
import {timeFormat } from 'd3-time-format';
import React, {useState} from "react";
import fields from "../add/Fields";
import {filterProps} from "recharts/types/util/ReactUtils";
import {getFilteredData} from "../../utils/linegraph.utils";

const monthFormat = timeFormat('%b %y');
const dateFormat = timeFormat('%d %b, %y');

const LineGraphBox = ({reports}) => {
    const dailyTracker = reports.dailytracker
    if(!dailyTracker)
        return <div>Daily tracker data missing</div>

    const [granularity, setGranularity] = useState('weekly')

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
        <div className="linegraph-container">
            <h6> OVERALL PROGRESS </h6>
            <label>
                <select
                    value={granularity}
                    className="linegraph-select-box"
                    onChange={(e) => setGranularity(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </label>
            <ResponsiveContainer width={'99%'} height={220} className="linegraph-box">
                <LineChart
                    width={500}
                    height={300}
                    data={filteredData}
                >
                    <CartesianGrid vertical={false} horizontal={true} stroke="var(--ultra-soft-color)"/>
                    <XAxis
                        dataKey="date"
                        scale="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickLine={false}
                        tickFormatter={(tick) => monthFormat(new Date(tick))}
                        tick={{ fontSize: 10, fill: 'var(--ultra-soft-color)' }}
                        minTickGap={50}/>
                    <YAxis tickFormatter={(value) => { return formatToIndianCurrency(value, 0, true);}}
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 10, fill: 'var(--ultra-soft-color)'}}
                            />
                    <Tooltip content={CustomTooltip} />
                    <Legend/>
                    <Line type="monotone" dataKey="current" stroke="var(--secondary)" dot={false} strokeWidth={2}/>
                    <Line type="monotone" dataKey="invested" stroke="var(--ternary)" dot={false} strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineGraphBox