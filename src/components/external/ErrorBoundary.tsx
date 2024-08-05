import React, { Component } from 'react';
import {iconMap} from "../icons/Icons";
import ErrorPage from "../../pages/ErrorPage";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        console.error("ErrorPage caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        // @ts-ignore
        if (this.state.hasError) {
            return (
                <ErrorPage/>
            );
        }

        // @ts-ignore
        return this.props.children;
    }
}

export default ErrorBoundary;