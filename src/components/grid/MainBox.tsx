import {formatToIndianCurrency} from "../../utils/helper";
const MainBox = ({
                     contentColumnMap,
                     instruments
}) => {
    let totalInvested = 0;
    let totalCurrent = 0;
    instruments.forEach((instrument)=>{
        totalInvested += contentColumnMap[instrument]["Invested"].slice(-1)[0]
        totalCurrent += contentColumnMap[instrument]["Current"].slice(-1)[0]
    })

    const isOverallProfit = totalCurrent > totalInvested
    return (
        <div className="total-assets">
            <h4> MY ASSETS </h4>
            <div className="main-box">
                <h4>
                    {formatToIndianCurrency(totalCurrent)}
                </h4>
                <div className={`delta ${isOverallProfit ? 'green-color' : 'red-color'}`}>
                    <h6 data-prefix={isOverallProfit ? "\u25B4" : "\u25BE"}>
                        {formatToIndianCurrency(totalCurrent-totalInvested)}
                    </h6>
                </div>
            </div>
        </div>
    )
}

export default MainBox