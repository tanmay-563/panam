import Home from "./pages/Home";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
import MutualFunds from "./pages/MutualFunds";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import React, { useEffect, useState } from 'react';

function App() {
    console.log(process.env.NODE_ENV)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSheetData = () => {
        console.log("fetching...")
        setLoading(true);
        if (process.env.NODE_ENV == "development"){
            setData([]);
        }
        else{
            google.script.run.withSuccessHandler((data) => {
                setData(data);
            }).getSheetData();
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchSheetData();
    }, []);

    let Layout = () =>{
        return (
            <div className="main">
                <Navbar onRefresh={fetchSheetData}/>
                <div className="container">
                    <div className="menuContainer">
                        <Menu/>
                    </div>
                    <div className="contentContainer">
                        <Outlet/>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
    // if(loading){
    //     Layout = () => {
    //         return <div>Loading..</div> //TODO setup loading icon
    //     }
    // }
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
                    path: "mutual-funds",
                    element: <MutualFunds data={data}/>,
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