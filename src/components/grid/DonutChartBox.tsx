import React, {useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from "recharts";
import convertToDountChartData from "../../utils/donutChart.utils";
import {formatToIndianCurrency, getDisplayName} from "../../utils/common";

const MAX_ITEMS = 6;


const DonutChartBox = ({aggregatedData, metadata}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const instrumentsMetadata = metadata?.instrument
    const colors = ['rgb(99, 102, 241)', 'rgb(142, 145, 255)', 'rgb(122, 125, 255)', 'rgb(76, 77, 213)', 'rgb(59, 60, 180)', 'rgb(47, 48, 142)',];
    const data = convertToDountChartData(aggregatedData, "current", Math.min(colors.length, MAX_ITEMS))

    for(let i=0; i<data.length; i++){
        data[i]["fill"] = colors[i]
    }

    const CustomTooltip = ({ payload }) => {
        if (payload && payload.length) {
            const { name, value } = payload[0];
            const total = data.reduce((sum, entry) => sum + entry.value, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return (
                <div style={{ backgroundColor: 'red', padding: '5px', border: '1px solid gray' }}>
                    <p>{`${name}: ${formatToIndianCurrency(value, 2, false)} ${percentage}`}</p>
                </div>
            );
        }
        return null;
    };


    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {getDisplayName(instrumentsMetadata,payload.name)}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--soft-color)">{`${formatToIndianCurrency(value, 2, true)}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    }

    const onPieEnter = (_, index) => {
        setActiveIndex(index)
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
                                       cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                                   }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="var(--soft-color)" fontSize="10px">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }

    const total = data.reduce((acc, entry) => acc + entry.value, 0);


    const CustomLegend = ({ payload }) => {
        return (
            <ul style={{ listStyleType: 'none', padding: 0}}>
                {payload.map((entry, index) => {
                    const percentage = ((entry.payload.value / total) * 100).toFixed(2);
                    return (
                        <li key={`item-${index}`} style={{ color: entry.color }}>
                            <span>{`${getDisplayName(instrumentsMetadata,entry.value)} (${percentage}%)`}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <>
            <div>
                <h6 className="box-title"> Distribution </h6>
            </div>
            <hr/>
            <div className="box-content">
                <ResponsiveContainer width={'99%'} height={270}>
                    <PieChart width={330} height={250}>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                             innerRadius={60} outerRadius={80} stroke='var(--soft-bg)' strokeWidth={2}
                             activeIndex={activeIndex}
                             activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}/>
                        {/*<Legend*/}
                        {/*    layout="vertical"*/}
                        {/*    verticalAlign="middle"*/}
                        {/*    align="right"*/}
                        {/*    content={CustomLegend}/>*/}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DonutChartBox;