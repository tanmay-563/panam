import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {capitalizeFirstLetter, formatToIndianCurrency} from "../../utils/common";
import {timeFormat } from 'd3-time-format';
import React, {useEffect, useMemo, useState} from "react";
import {getFilteredData} from "../../utils/lineGraph.utils";
import TextField from "@mui/material/TextField";

const monthFormat = timeFormat('%b %y');
const dateFormatForDisplay = timeFormat('%d %b, %y');
const formatDateForInput = timeFormat('%Y-%m-%d');
const localStorageKey = "line_graph_granularity"

const DatePicker = ({label, date, setDate}) => {
    return (
        <TextField
            label={label}
            type="date"
            className="datepicker-field"
            size="small"
            value={formatDateForInput(date)}
            onChange={(event) => {
                setDate(new Date(event.target.value));
            }}
            sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)'
                },
            }}
        />
    )
}

const LineGraphBox = ({reports}) => {
    const dailyTracker = reports.dailytracker
    if(!dailyTracker)
        return <div>Daily tracker data missing</div>

    dailyTracker.sort((a, b) => a.date - b.date);

    const [granularity, setGranularity] = useState('weekly')
    const [startDate, setStartDate] = useState(new Date("2010-01-01"));
    const [endDate, setEndDate] = useState(new Date());

    useMemo(() => {
        const savedGranularity = localStorage.getItem(localStorageKey);
        if (savedGranularity) {
            setGranularity(savedGranularity);
        }
    }, []);

    useEffect(()=>{
        if(dailyTracker.length && dailyTracker[0].Date &&
            Object.prototype.toString.call(dailyTracker[0].Date) === '[object Date]'){
            setStartDate(dailyTracker[0].Date)
        }
    }, [dailyTracker])

    const [filteredData, maxCurrentEntry] = getFilteredData(dailyTracker, granularity, startDate, endDate)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="tooltip-container">
                    <p className="tooltip-label">{dateFormatForDisplay(label)}</p>
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
                <div className="box-top">
                    <div className="max-amount">
                        Max:
                        <div>
                            <span title={formatToIndianCurrency(maxCurrentEntry.current, 0, false)}>
                                {formatToIndianCurrency(maxCurrentEntry.current)}
                            </span>
                                <span>
                                ({dateFormatForDisplay(maxCurrentEntry.date)})
                            </span>
                        </div>
                    </div>
                    <div className="range-picker">
                        <DatePicker
                            label="Start Date"
                            date={startDate}
                            setDate={setStartDate}
                        />
                        <DatePicker
                            label="End Date"
                            date={endDate}
                            setDate={setEndDate}
                        />
                    </div>
                </div>
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
                            tickFormatter={(tick) => dateFormatForDisplay(new Date(tick))}
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
                <select
                    value={granularity}
                    className="linegraph-select box-select"
                    onChange={(e) => {
                        setGranularity(e.target.value);
                        localStorage.setItem(localStorageKey, e.target.value);
                    }}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
        </>
    )
}

export default LineGraphBox