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

function App() {
    console.log(process.env.NODE_ENV)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [alertDetails, setAlertDetails] = useState({})

    const fetchSheetData = () => {
        console.log("fetching...")
        setLoading(true);
        if (process.env.NODE_ENV == "development"){
            let data = JSON.parse(devData, dateReviver);
            // console.log(data)
            setData(getProcessedData(data));
            setTimeout(() => setLoading(false), 500)
        }
        else{
            // @ts-ignore
            google.script.run.withSuccessHandler((data) => {
                console.log("data "+ data)
                setData(getProcessedData(JSON.parse(data, dateReviver)));
                setLoading(false)
            }).withFailureHandler((error) => {
                console.error("Error fetching data:", error);
                setData([]);
                setLoading(false);
            }).fetchData();
        }
    };

    useEffect(() => {
        fetchSheetData();
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Layout
                    data={data}
                    fetchSheetData={fetchSheetData}
                    setSelectedMenuItem={setSelectedMenuItem}
                    selectedMenuItem={selectedMenuItem}
                    setOpenAdd={setOpenAdd}
                    openAdd={openAdd}
                    setAlertDetails={setAlertDetails}
                    alertDetails={alertDetails}
                    loading={loading}
                />
            ),
            children: [
                {
                    path: "/",
                    element: (
                        <Home
                            instruments={data?.instruments}
                            metadata={data?.metadata}
                            reports={data?.reports}
                            aggregatedData={data?.aggregatedData}
                        />
                    ),
                },
                {
                    path: "transactions/:instrumentId",
                    element: <Instruments
                        headerMap={data?.headerMap}
                        transactionsRowMap={data?.transactionsRowMap}
                        metadata={data?.metadata}
                        instrument={selectedMenuItem}
                        setSelectedMenuItem={setSelectedMenuItem}
                    />,
                },
                {
                    path: "add/instrument",
                    element: <AddInstrument/>,
                },
            ],
        },
        {
            path: "*",
            element: <Layout
                data={data}
                fetchSheetData={fetchSheetData}
                setSelectedMenuItem={setSelectedMenuItem}
                selectedMenuItem={selectedMenuItem}
                setOpenAdd={setOpenAdd}
                openAdd={openAdd}
                setAlertDetails={setAlertDetails}
                alertDetails={alertDetails}
                loading={loading}
            />,
            children: [
                {
                    path: "*",
                    element: (
                        <Home
                            instruments={data?.instruments}
                            metadata={data?.metadata}
                            reports={data?.reports}
                            aggregatedData={data?.aggregatedData}
                        />
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