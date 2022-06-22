import React from "react";
import ReactDOM from 'react-dom/client';
import App from "../App";
import {
    BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet
    , useParams, NavLink
} from "react-router-dom"
import Portf from "./Portfolio";
import Navbars from "./Navbar";

const Rendering = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navbars/>} >
                    <Route path="home" element={<App />} />
                </Route>
                <Route path='/portfolio' element={<Portf/>} />
                {/* <Route path='/myApps' element={<Navigate replace to="/learn" />} />
                <Route path='/learn' element={<Learn />}>
                    <Route path='courses' element={<Courses />} >
                        <Route path=":courseId" element={<CourseId />} />
                    </Route>
                    <Route path='bundles' element={<Bundles />} />
                </Route> */}

            </Routes>
        </Router>
    )
}

export default Rendering