import React from "react";
import {PieChart, ResponsiveContainer} from "recharts";

const DonutChartBox = ({}) => {
    return (
        <>
            <div>
                <h6 className="box-title"> Distribution </h6>
            </div>
            <hr/>
            <div className="box-content">
                <ResponsiveContainer width={'99%'} height={270}>
                    <PieChart>

                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DonutChartBox;