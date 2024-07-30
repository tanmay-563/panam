import React from 'react'
import MainBox from "../components/grid/MainBox";
import LineGraphBox from "../components/grid/LineGraphBox";
import DonutChartBox from "../components/grid/DonutChartBox";
import DetailsBox from "../components/grid/Details/DetailsBox";
const Home = ({
                    instruments,
                    metadata,
                    reports,
                    aggregatedData,
}) => {
    if(!instruments)
        return <div></div>

    return (
        <div className="home">
            <div className="box box1">
                <MainBox
                    metadata={metadata}
                    aggregatedData={aggregatedData}/>
            </div>
            <div className="box box2">
                <DetailsBox aggregatedData={aggregatedData} metadata={metadata} instruments={instruments}/>
            </div>
            <div className="box box3">
                <DonutChartBox aggregatedData={aggregatedData} metadata={metadata}/>
            </div>
            <div className="box box4">
                <LineGraphBox
                    reports={reports}/>
            </div>
        </div>
    )
}

export default Home