import React from 'react'
import MainBox from "../components/grid/MainBox";
import LineGraphBox from "../components/grid/LineGraphBox";
const Home = ({
                    instruments,
                    transactionsColumnMap,
                    metadata,
                    reports,
                    setSelectedMenuItem,
}) => {
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
                </div>
                <div className="box box3">box 3</div>
                <div className="box box4">
                    <LineGraphBox
                        reports={reports}/>
                </div>
            </div> :
            <div/>
    )
}

export default Home