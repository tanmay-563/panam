import {iconMap} from "../components/icons/Icons";
import React from "react";

const ErrorPage = () => {
    return (
        <div className="error-page">
            <div className="error-icon">
                {iconMap["_error"]}
            </div>
            <h1>Something went wrong!</h1>
            <p>Make sure data is properly entered in the sheet.</p>
        </div>
    )
}

export default ErrorPage;