import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import {Outlet} from "react-router-dom";
import AlertBox from "../components/AlertBox";
import Footer from "../components/Footer";
import React, {useState} from "react";
import Loading from "../components/Loading";
import Add from "../components/add/add";
import Settings from "../components/Settings";

const Layout = ({ data,
    fetchSheetData,
    setSelectedMenuItem,
    selectedMenuItem,
    setOpenAdd,
    openAdd,
    setAlertDetails,
    alertDetails,
    loading,
}) =>{
    const [hamburgerToggle, setHamburgerToggle] = useState(false);
    const [showSettings, setShowSettings] = useState(false)

    const changeHamburgerToggle = () => {
        setHamburgerToggle(prevState => !prevState)
    }

    const handleMenuClick = (value) => {
        setSelectedMenuItem(value)
        setHamburgerToggle(!hamburgerToggle)
    }

    const setAlert = (severity, title, message, timeout) => {
        setAlertDetails(prevState => ({
            ...prevState,
            severity,
            title,
            message,
            timeout,
        }));
    }

    return (
        <div className="main">
            <Navbar
                    onRefresh={fetchSheetData}
                    openAdd={openAdd}
                    onOpenAdd={setOpenAdd}
                    showSettings={showSettings}
                    onShowSettings={setShowSettings}
                    setHamburgerToggle={changeHamburgerToggle}/>
            <div className="container">
                <Menu
                    instruments={data?.instruments}
                    metadata={data?.metadata}
                    selectedMenuItem={selectedMenuItem}
                    handleMenuClick={handleMenuClick}
                    hamburgerToggle={hamburgerToggle}
                />
                <Settings
                    data={data}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                />
                <div className="content-container">
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

export default Layout