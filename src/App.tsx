import Home from "./pages/Home";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
import Instruments from "./pages/Instruments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import React, { useEffect, useState } from 'react';
import Add from "./components/add/Add";
import {devData} from "./devdata.js";
import getProcessedData from "./utils/dataProcessor";
import Loading from "./components/Loading";
import AlertBox from "./components/AlertBox";
import {dateReviver} from "./utils/common";

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
            console.log(devData)
            let data = JSON.parse(devData, dateReviver);
            console.log(data)
            setData(getProcessedData(data));
            setTimeout(() => setLoading(false), 500)
        }
        else{
            google.script.run.withSuccessHandler((data) => {
                setData(getProcessedData(JSON.parse(data, dateReviver)));
                console.log("data ", data)
                setLoading(false)
            }).withFailureHandler((error) => {
                console.error("Error fetching data:", error);
                setData([]);
                setLoading(false);
            }).fetchData();
        }
    };

    const setAlert = (severity, title, message, timeout) => {
        setAlertDetails(prevState => ({
            ...prevState,
            severity,
            title,
            message,
            timeout,
        }));
    }

    useEffect(() => {
        fetchSheetData();
    }, []);

    let Layout = () =>{
        return (
            <div className="main">
                <Navbar onRefresh={fetchSheetData} onOpenAdd={setOpenAdd}/>
                <div className="container">
                    <div className="menuContainer">
                        <Menu
                            instruments={data?.instruments}
                            metadata={data?.metadata}
                            selectedMenuItem={selectedMenuItem}
                            setSelectedMenuItem={setSelectedMenuItem}
                        />
                    </div>
                    <div className="contentContainer">
                        <Outlet/>
                        {loading && <Loading className="loading-overlay"/>}
                        {Object.keys(alertDetails).length > 0 &&
                            <AlertBox
                                alertDetails={alertDetails}
                                setAlertDetails={setAlertDetails}
                            />
                        }
                        {openAdd && <Add
                            instruments={data?.instruments}
                            transactionsColumnMap={data?.transactionsColumnMap}
                            selectedMenuItem={selectedMenuItem}
                            setSelectedMenuItem={setSelectedMenuItem}
                            setOpenAdd={setOpenAdd}
                            setAlert={setAlert}
                            metadata={data?.metadata}
                        />}
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: (
                        <Home
                            instruments={data?.instruments}
                            transactionsRowMap={data?.transactionsRowMap}
                            transactionsColumnMap={data?.transactionsColumnMap}
                            metadata={data?.metadata}
                            reports={data?.reports}
                            aggregatedData={data?.aggregatedData}
                            setSelectedMenuItem={setSelectedMenuItem}
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
                    />,
                },
            ],
        },
        {
            path: "*",
            element: <Layout/>,
            children: [
                {
                    path: "*",
                    element: (
                        <Home
                            instruments={data?.instruments}
                            transactionsRowMap={data?.transactionsRowMap}
                            transactionsColumnMap={data?.transactionsColumnMap}
                            metadata={data?.metadata}
                            reports={data?.reports}
                            aggregatedData={data?.aggregatedData}
                            setSelectedMenuItem={setSelectedMenuItem}
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