import ConfirmationBox from "./ConifrmationBox";
import AddTransaction from "./addTransactions/AddTransaction";

const Dialog = ({dialogType, setDialogType, ...props}) =>{
    if(!dialogType || dialogType === '')
        return <div></div>

    let dialogContent;

    switch (dialogType.toLowerCase()) {
        case "addtransaction":
            dialogContent = (<AddTransaction
                                dialogType={dialogType}
                                setDialogType={setDialogType}
                                {...props}/>);
            break;
        case "deleteconfirmation":
            dialogContent = (<div></div>);
            break;
        default:
            dialogContent = (<div></div>);
    }

    return (
        <div className="dialog">
            {dialogContent}
        </div>
    )
}

export default Dialog