// import Navbar from "../components/Navbar";
// import Menu from "../components/Menu";
// import {Outlet} from "react-router-dom";
// import LoadingOverlay from "../components/LoadingOverlay";
// import AlertBox from "../components/AlertBox";
// import add from "../components/add/add";
// import Footer from "../components/Footer";
// import React from "react";
//
// const Layout = () => {
//     return (
//         <div className="main">
//             <Navbar onRefresh={fetchSheetData} onOpenAdd={setOpenAdd}/>
//             <div className="container">
//                 <div className="menuContainer">
//                     <Menu
//                         instruments={data?.instruments}
//                         config={data?.config}
//                         selectedMenuItem={selectedMenuItem}
//                         setSelectedMenuItem={setSelectedMenuItem}
//                     />
//                 </div>
//                 <div className="contentContainer">
//                     <Outlet/>
//                     {loading && <LoadingOverlay/>}
//                     {Object.keys(alertDetails).length &&
//                         <AlertBox
//                             severity={alertDetails.severity}
//                             title={alertDetails.title}
//                             message={alertDetails.message}
//                         />
//                     }
//                     {openAdd && <add
//                         instruments={data?.instruments}
//                         headerMap={data?.headerMap}
//                         contentColumnMap={data?.contentColumnMap}
//                         selectedMenuItem={selectedMenuItem}
//                         setOpenAdd={setOpenAdd}
//                         setAlert={setAlert}
//                         config={data?.config}
//                     />}
//                 </div>
//             </div>
//             <Footer/>
//         </div>
//     )
// }
//
// export default Layout