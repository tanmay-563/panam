import {getRedemptionAmountData} from "../../utils/calculator.utils";
import {formatToIndianCurrency} from "../../utils/common"

const RedemptionField = ({
                               selectedInstrument,
                               selectedUnitField,
                               selectedCurrentNavField,
                               redemptionUnits,
                               transactionsRowMap,
                               fieldName,
}) => {
    if(!selectedInstrument)
        return <div></div>

    const [investedAmount, currentAmount] = getRedemptionAmountData(transactionsRowMap, selectedInstrument, fieldName,
            selectedUnitField, selectedCurrentNavField, redemptionUnits)

    return (
        <div className="calculated-data-row">
            <div className="calculated-data-options">
                <div className="field-name">
                    {fieldName}
                </div>
                <div className="calculated-value-box-container">
                {(() => {
                        if (investedAmount < 0 && currentAmount < 0) {
                            return <p>Redemption Units are more than Available Units</p>;
                        }
                        else if (investedAmount >= 0 && currentAmount >= 0) {
                            return (
                                <p>
                                    You will receive {formatToIndianCurrency(currentAmount, 2, false)} on redemption
                                    <br /> 
                                    Your invested amount will reduce by {formatToIndianCurrency(investedAmount, 2, false)}
                                </p>
                            );
                        }
                        return null;
                    })()} 
                </div>
            </div>
        </div>
    )
}

export default RedemptionField