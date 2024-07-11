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
import Add from "./components/Add/Add";
import devData from "./devData.json";
import getProcessedData from "./utils/dataProcessor";
import ReactLoading from 'react-loading';
import LoadingOverlay from "./components/LoadingOverlay";
import AlertBox from "./components/AlertBox";

function App() {
    console.log(process.env.NODE_ENV)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [alertDetails, setAlertDetails] = useState({})
    console.log("sel " + selectedMenuItem);
    const fetchSheetData = () => {
        console.log("fetching...")
        setLoading(true);
        if (process.env.NODE_ENV == "development"){
            let data = devData.data;
            setData(getProcessedData(data));
            setTimeout(() => setLoading(false), 0)
        }
        else{
            google.script.run.withSuccessHandler((data) => {
                setData(getProcessedData(JSON.parse(data)));
                console.log("data ", JSON.parse(data))
                setLoading(false)
            }).withFailureHandler((error) => {
                console.error("Error fetching data:", error);
                setData([]);
                setLoading(false);
            }).fetchData();
        }
    };

    const setAlert = (severity, title, message, timeout) => {
        setAlertDetails({
            severity: severity,
            title: title,
            message: message,
            timeout: timeout,
        })
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
                            config={data?.config}
                            selectedMenuItem={selectedMenuItem}
                            setSelectedMenuItem={setSelectedMenuItem}
                        />
                    </div>
                    <div className="contentContainer">
                        <Outlet/>
                        {loading && <LoadingOverlay/>}
                        {Object.keys(alertDetails).length > 0 &&
                            <AlertBox
                                alertDetails={alertDetails}
                                setAlertDetails={setAlertDetails}
                            />
                        }
                        {openAdd && <Add
                            instruments={data?.instruments}
                            headerMap={data?.headerMap}
                            contentColumnMap={data?.contentColumnMap}
                            selectedMenuItem={selectedMenuItem}
                            setSelectedMenuItem={setSelectedMenuItem}
                            setOpenAdd={setOpenAdd}
                            setAlert={setAlert}
                            config={data?.config}
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
                        <Home/>
                    ),
                },
                {
                    path: "transactions",
                    element: <Instruments
                        headerMap={data?.headerMap}
                        contentRowMap={data?.contentRowMap}
                        config={data?.config}
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
                        <Home/>
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