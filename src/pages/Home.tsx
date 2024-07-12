import React from 'react'
import MainBox from "../components/grid/MainBox";
const Home = ({
                    instruments,
                  contentColumnMap
}) => {
    return (
        contentColumnMap ?
            <div className="home">
                <div className="box box1">
                    <MainBox
                        contentColumnMap = {contentColumnMap}
                        instruments={instruments}
                    />
                </div>
                <div className="box box2">box 2</div>
                <div className="box box3">box 3</div>
                <div className="box box4">box 4</div>
            </div> :
            <div/>
    )
}

export default Home