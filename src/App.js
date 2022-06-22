import React, { useEffect } from "react";

import Navbars from "./Components/Navbar";
import Appsection from "./Components/Appsection";
import Cardsection from "./Components/Cardsection";
import Footer from "./Components/footer";
import "./App.css";
import Portf from "./Components/Portfolio";
import Example from "./Components/Carousel";
import Companies from "./Components/Companies";
import {
    HashRouter, Routes, Route, Navigate, Link, Outlet
    , useParams, NavLink
} from "react-router-dom"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



//import bootstrap from "bootstrap";


function App() {

    useEffect(() => {
        const notify = () => toast("Fetching the Model Do not Close", {
          autoClose: 60000
        });
    
        notify();
      }, [])
    return (
        <HashRouter>
            <Navbars />
            <Routes>
                <Route path="/" element={
                    <><Appsection />
                        <Companies />
                        <Cardsection />
                        <Footer />
                    </>} />
                <Route path='/cv' element={<Portf />} />

                {/* 
             

                  

                    <Example id="carousel" />

                    <Footer id="part2" />

                </Route>
                <Route path="/portfolio">
                    <Portf />
                </Route> */}

            </Routes>
        </HashRouter>
    )
}
// <div className="container-fluid" style={{ backgroundColor: "#F6E7D8", padding: "0px", marginRight: "0px" }}>
//     {/* <h1>Kartik</h1> */}
// <div id="title" style={{ height: "auto" }}>
//     <Navbars />
//     <Appsection />
// </div>
//     <div id="portfolio">
//         <Companies />

//     </div>

//     <div id="youtubte">
//         <Cardsection />
//     </div>

//     <div id="carousel">
//         <Example />
//     </div>


//     <div id="part2">
//         <Footer />
//     </div>

// </div>

export default App;


