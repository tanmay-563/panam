import Home from "./pages/Home";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Instruments from "./pages/Instruments";
import React, { useEffect, useState } from 'react';
import {devData} from "./devdata.js";
import getProcessedData from "./utils/dataProcessor";
import {dateReviver} from "./utils/common";
import Layout from "./pages/Layout";
import AddInstrument from "./pages/AddInstrument";
import DeleteInstrument from "./pages/DeleteInstrument";
import CapitalGains from "./pages/calculators/CapitalGains";
import ErrorBoundary from "./components/external/ErrorBoundary";

function App() {
    console.log(process.env.NODE_ENV)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [dialogType, setDialogType] = useState('');
    const [dialogProps, setDialogProps] = useState({})
    const [alertDetails, setAlertDetails] = useState({})

    const fetchSheetData = (enableLoading = true) => {
        console.log("fetching...")
        setLoading(enableLoading);
        if (process.env.NODE_ENV == "development"){
            let data = JSON.parse(devData, dateReviver);
            console.log(data)
            setData(getProcessedData(data));
            console.log(getProcessedData(data))
            setTimeout(() => setLoading(false), 500)
        }
        else{
            // @ts-ignore
            google.script.run.withSuccessHandler((data) => {
                console.log("data "+ data)
                setData(getProcessedData(JSON.parse(data, dateReviver)));
                setLoading(false)
            }).withFailureHandler((error) => {
                console.error("ErrorPage fetching data:", error);
                setData([]);
                setLoading(false);
            }).fetchData();
        }
    };

    useEffect(() => {
        fetchSheetData();
    }, []);

    const setAlert = (severity, title, message, timeout) => {
        setAlertDetails(prevState => ({
            ...prevState,
            severity,
            title,
            message,
            timeout,
        }));
    }

    const handleInstrumentDelete = (instrument) => {
        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV === "development") {
                setTimeout(() => {
                    let response = {
                        statusCode: 200,
                        status: "Success"
                    };
                    setAlert("success", "Success", "Deleted " + instrument, 10);
                    setDialogType('')
                    resolve(response);
                }, 2000);
            } else {
                // @ts-ignore
                google.script.run
                    .withSuccessHandler((response) => {
                        if (response.statusCode >= 200 && response.statusCode < 300) {
                            setAlert("success", "Success", "Deleted successfully.", 10);
                            setDialogType('');
                            fetchSheetData(false);
                            resolve(response);
                        } else {
                            setAlert("error", "Error", response.status, 10);
                            reject(response);
                        }
                    })
                    .withFailureHandler((error) => {
                        setAlert("error", "Error", error, 10);
                        reject(error);
                    })
                    .deleteInstrument(instrument);
            }
        });
    };

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ErrorBoundary>
                    <Layout
                        data={data}
                        fetchSheetData={fetchSheetData}
                        setSelectedMenuItem={setSelectedMenuItem}
                        selectedMenuItem={selectedMenuItem}
                        setDialogType={setDialogType}
                        dialogType={dialogType}
                        setAlertDetails={setAlertDetails}
                        setAlert={setAlert}
                        alertDetails={alertDetails}
                        loading={loading}
                        dialogProps={dialogProps}
                        setDialogProps={setDialogProps}
                    />
                </ErrorBoundary>
            ),
            children: [
                {
                    path: "/",
                    element: (
                        <ErrorBoundary>
                            <Home
                                instruments={data?.instruments}
                                metadata={data?.metadata}
                                reports={data?.reports}
                                aggregatedData={data?.aggregatedData}
                            />
                        </ErrorBoundary>
                    ),
                },
                {
                    path: "transactions/:instrumentId",
                    element:
                        <ErrorBoundary>
                            <Instruments
                                headerMap={data?.headerMap}
                                transactionsRowMap={data?.transactionsRowMap}
                                metadata={data?.metadata}
                                instrument={selectedMenuItem}
                                setSelectedMenuItem={setSelectedMenuItem}
                                setDialogType={setDialogType}
                            />
                        </ErrorBoundary>,
                },
                {
                    path: "add/instrument",
                    element: <AddInstrument
                                metadata={data?.metadata}
                                setAlert={setAlert}
                                fetchSheetData={fetchSheetData}/>,
                },
                {
                    path: "delete/instrument",
                    element: <DeleteInstrument
                        metadata={data?.metadata}
                        setDialogType={setDialogType}
                        setDialogProps={setDialogProps}
                        handleInstrumentDelete={handleInstrumentDelete}/>,
                },
                {
                    path: "calculator/capitalgains",
                    element: <CapitalGains
                                metadata={data?.metadata}
                                transactionsRowMap={data?.transactionsRowMap}
                                aggregatedData={data?.aggregatedData}/>
                },
            ],
        },
        {
            path: "*",
            element:
                <ErrorBoundary>
                    <Layout
                        data={data}
                        fetchSheetData={fetchSheetData}
                        setSelectedMenuItem={setSelectedMenuItem}
                        selectedMenuItem={selectedMenuItem}
                        setDialogType={setDialogType}
                        dialogType={dialogType}
                        setAlertDetails={setAlertDetails}
                        setAlert={setAlert}
                        alertDetails={alertDetails}
                        loading={loading}
                        dialogProps={dialogProps}
                        setDialogProps={setDialogProps}
                    />
                </ErrorBoundary>,
            children: [
                {
                    path: "*",
                    element: (
                        <ErrorBoundary>
                            <Home
                                instruments={data?.instruments}
                                metadata={data?.metadata}
                                reports={data?.reports}
                                aggregatedData={data?.aggregatedData}
                            />
                        </ErrorBoundary>
                    ),
                },
            ]
        }
    ]);
    return (
        <RouterProvider router={router} />
    );
}

export default App