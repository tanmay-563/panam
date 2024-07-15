import React, {useEffect, useRef, useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from "recharts";
import convertToDountChartData from "../../utils/donutChart.utils";
import {formatToIndianCurrency, getDisplayName} from "../../utils/common";

const MAX_ITEMS = 6;

const DonutChartBox = ({aggregatedData, metadata}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const updateSize = () => {
            console.log("updating")
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const instrumentsMetadata = metadata?.instrument
    const colors = ['rgb(99, 102, 241)', 'rgb(142, 145, 255)', 'rgb(122, 125, 255)', 'rgb(76, 77, 213)', 'rgb(59, 60, 180)', 'rgb(47, 48, 142)',];
    const data = convertToDountChartData(aggregatedData, "current", Math.min(colors.length, MAX_ITEMS))

    for(let i=0; i<data.length; i++){
        data[i]["fill"] = colors[i]
    }

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;

        const { width, height } = containerSize;
        const fontSize = Math.min(width, height) * 0.05;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const isSmallScreen = width < 400;

        let sx, sy, mx, my, ex, ey;

        if (isSmallScreen) {
            const direction = midAngle > 180 ? 1 : -1; // Up or down
            sx = cx + outerRadius * cos;
            sy = cy + outerRadius * sin;
            mx = cx + (outerRadius + 10) * cos;
            my = cy + (outerRadius + 10) * sin;
            ex = cx + (cos >= 0 ? 1 : -1) * 30;
            ey = cy + direction * 100;
        } else {
            sx = cx + (outerRadius + 10) * cos;
            sy = cy + (outerRadius + 10) * sin;
            mx = cx + (outerRadius + 30) * cos;
            my = cy + (outerRadius + 30) * sin;
            ex = mx + (cos >= 0 ? 1 : -1) * 22;
            ey = my;
        }
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={fontSize}>
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

    return (
        <>
            <div>
                <h6 className="box-title"> Distribution </h6>
            </div>
            <hr/>
            <div className="box-content" ref={containerRef}>
                <ResponsiveContainer width={'99%'} height={270}>
                    <PieChart width={330} height={250}>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                             innerRadius="40%" outerRadius="60%" stroke='var(--soft-bg)' strokeWidth={2}
                             activeIndex={activeIndex}
                             activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DonutChartBox;