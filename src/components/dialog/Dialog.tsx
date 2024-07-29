import ConfirmationBox from "./ConfirmationBox";
import AddTransaction from "./addTransactions/AddTransaction";

const Dialog = ({dialogType, setDialogType, ...props}) =>{
    if(!dialogType || dialogType === '')
        return <div></div>
    let dialogContent;

    switch (dialogType.toLowerCase()) {
        case "addtransaction":
            dialogContent = <AddTransaction
                                dialogType={dialogType}
                                setDialogType={setDialogType}
                                {...props}/>;
            break;
        case "deleteconfirmation":
            dialogContent = <ConfirmationBox
                                dialogType={dialogType}
                                setDialogType={setDialogType}
                                {...props}/>;
            break;
        default:
            return <div></div>;
    }

    return (
        <div className="dialog">
            {dialogContent}
        </div>
    )
}

export default Dialog