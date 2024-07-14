import React from 'react'
import MainBox from "../components/grid/MainBox";
import LineGraphBox from "../components/grid/LineGraphBox";
import DonutChartBox from "../components/grid/DonutChartBox";
import {getAggregatedData} from "../utils/home.utils";
const Home = ({
                    instruments,
                    transactionsRowMap,
                    transactionsColumnMap,
                    metadata,
                    reports,
                    setSelectedMenuItem,
}) => {
    if(!instruments)
        return <div></div>

    // getAggregatedData(transactionsRowMap, metadata);
    return (
        transactionsColumnMap ?
            <div className="home">
                <div className="box box1">
                    <MainBox
                        transactionsColumnMap = {transactionsColumnMap}
                        instruments={instruments}
                        metadata={metadata}
                        setSelectedMenuItem={setSelectedMenuItem}/>
                </div>
                <div className="box box2">
                    <LineGraphBox
                        reports={reports}/>
                </div>
                <div className="box box3">box 3</div>
                <div className="box box4">
                    <DonutChartBox/>
                </div>
                <div className="box box5"></div>
            </div> :
            <div/>
    )
}

export default Home