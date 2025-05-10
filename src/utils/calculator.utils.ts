export function getCapitalGainsData(transactionsRowMap, instrument, name,
                                    unitsField, buyNavField, currentNavField,
                                    shortTermPeriod) {
    if (!transactionsRowMap || !(instrument in transactionsRowMap) || !unitsField || !buyNavField || !currentNavField) {
        return [0, 0];
    }

    try{

        let totalUnits = 0, longTermUnits = 0, shortTermUnits = 0, withdrawnUnits = 0, currentNav = 0;
        let longTermUnitsToBuyNav = [], shortTermUnitsToBuyNav = [];

        const today = new Date();
        const thresholdDate = new Date(today.setMonth(today.getMonth() - shortTermPeriod));

        transactionsRowMap[instrument].forEach(transaction => {
            if (transaction.Name === name) {
                const transactionDate = new Date(transaction.Date);
                const transactionUnits = transaction[unitsField];
                currentNav = transaction[currentNavField];

                if (transactionUnits < 0) {
                    withdrawnUnits += -transactionUnits;
                } else {
                    totalUnits += transactionUnits;
                    if (transactionDate < thresholdDate) {
                        longTermUnits += transactionUnits;
                        longTermUnitsToBuyNav.push([transactionUnits, transaction[buyNavField]]);
                    } else {
                        shortTermUnits += transactionUnits;
                        shortTermUnitsToBuyNav.push([transactionUnits, transaction[buyNavField]]);
                    }
                }
            }
        });

        // Adjust units considering withdrawals
        const adjustForWithdrawals = (units, unitsToBuyNav) => {
            let withdrawnCopy = withdrawnUnits;
            let totalBuyValue = 0;

            for (let i = 0; i < unitsToBuyNav.length; i++) {
                let [unit, buyNav] = unitsToBuyNav[i];

                if (withdrawnCopy >= unit) {
                    withdrawnCopy -= unit;
                } else {
                    unit -= withdrawnCopy;
                    withdrawnCopy = 0;
                    totalBuyValue += unit * buyNav;
                }
            }

            return { remainingUnits: units - withdrawnUnits, totalBuyValue };
        };

        const longTermAdjustment = adjustForWithdrawals(longTermUnits, longTermUnitsToBuyNav);
        longTermUnits = longTermAdjustment.remainingUnits;
        const longTermBuyValue = longTermAdjustment.totalBuyValue;

        const shortTermAdjustment = adjustForWithdrawals(shortTermUnits, shortTermUnitsToBuyNav);
        shortTermUnits = shortTermAdjustment.remainingUnits;
        const shortTermBuyValue = shortTermAdjustment.totalBuyValue;

        const longTermValue = longTermUnits * currentNav - longTermBuyValue;
        const shortTermValue = shortTermUnits * currentNav - shortTermBuyValue;

        return [longTermValue, shortTermValue];
    }
    catch (e){
        console.error(e)
        return [0, 0];
    }
}

export function getRedemptionAmountData(transactionsRowMap, instrument, name,
                                    unitsField, currentNavField,
                                    redemptionUnits) {
    if (!transactionsRowMap || !(instrument in transactionsRowMap) || !unitsField || !currentNavField) {
        return [0, 0];
    }

    try{
        let currentNav = 0, investedAmount = 0, redemptionUnitsCopy = redemptionUnits;

        const relevantTransactions = transactionsRowMap[instrument]
        .filter(transaction => transaction.Name === name) 
        .sort((a, b) => {                               
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);
            return dateA.getTime() - dateB.getTime(); 
        });

        let redeemdedUnits = relevantTransactions
        .filter(transaction => transaction[unitsField] < 0) 
        .reduce((sum, transaction) => sum + Math.abs(transaction[unitsField]), 0);
        
        relevantTransactions.forEach(transaction => {
            let transactionUnits = transaction[unitsField];
            if(transactionUnits < 0)
                return;
            currentNav = transaction[currentNavField];

            if (redeemdedUnits > 0) {
                if (redeemdedUnits >= transactionUnits){
                    redeemdedUnits -= transactionUnits;
                    return;
                }
                else{
                    transactionUnits -= redeemdedUnits;
                    redeemdedUnits = 0;
                }
            } 
            if (redemptionUnits > 0){
                if (redemptionUnits >= transactionUnits){
                    investedAmount += (transactionUnits/transaction[unitsField])*transaction.Invested;
                    redemptionUnits -= transactionUnits;
                }
                else{
                    investedAmount += (redemptionUnits/transactionUnits)*transaction.Invested
                    redemptionUnits = 0;
                }
            }
        });

        if(redemptionUnits > 0)
            return [-1, -1]
        
        const currentAmount = redemptionUnitsCopy*currentNav;
        return [investedAmount, currentAmount];
    }
    catch (e){
        console.error(e)
        return [0, 0];
    }
}