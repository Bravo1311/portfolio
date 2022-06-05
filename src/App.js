import React from "react";
import Navbar from "./Navbar";
import Appsection from "./Appsection";
import Herosection from "./Herosection";
import Cardsection from "./Cardsection";
import Footer from "./footer";
import "./App.css";
import Example from "./Navbar";
//import bootstrap from "bootstrap";

const App = () =>(
    <div>
        {/* <h1>Kartik</h1> */}
        <div id = "title" style={{height:"auto"}}>
        <Example/>        
        <Appsection/>
        </div>
        
        <div id = "part2">
        {/* <Cardsection/> */}
        <Footer/>
        </div>
        
    </div>    
) ;

export default App;
