import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatToIndianCurrency} from "../../utils/helper";
import { timeParse, timeFormat } from 'd3-time-format';
import React, {useMemo} from "react";

const LineGraphBox = ({reports}) => {
    const dailyTracker = reports.dailytracker
    if(!dailyTracker)
        return <div>Daily tracker data missing</div>

    const parseDate = timeParse('%Y-%m-%d');
    const formatDate = timeFormat('%b %y');
    const formatDateWithDay = timeFormat('%d %b, %y');

    const formattedReport = dailyTracker.map(d => ({
        date: parseDate(d.Date.substring(0,10)).getTime(),
        current: d.Current,
        invested: d.Invested,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="tooltip-container">
                    <p className="tooltip-label">{formatDateWithDay(label)}</p>
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
        <div>
            <h6> OVERALL PROGRESS </h6>
            <ResponsiveContainer width={'99%'} height={230} className="linegraph-box">
                <LineChart
                    width={500}
                    height={300}
                    data={formattedReport}
                >
                    <CartesianGrid vertical={false} horizontal={true} stroke="var(--ultra-soft-color)"/>
                    <XAxis
                        dataKey="date"
                        scale="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickLine={false}
                        tickFormatter={(tick) => formatDate(new Date(tick))}
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