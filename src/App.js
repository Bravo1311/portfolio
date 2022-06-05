import React from "react";
import Appsection from "./Components/Appsection";

import Cardsection from "./Components/Cardsection";
import Footer from "./Components/footer";
import "./App.css";
import Navbars from "./Components/Navbar";
// import Example from "./Components/Carousel";
import Companies from "./Components/Companies";
//import bootstrap from "bootstrap";

const App = () => (
    <div className="container-fluid" style={{ backgroundColor: "#F6E7D8", padding: "0px", marginRight: "0px" }}>
        {/* <h1>Kartik</h1> */}
        <div  id="title" style={{ height: "auto" }}>
            <Navbars />
            <Appsection />
        </div>

        <div id="portfolio">
            <Companies/>    
                   
        </div>

        <div id="youtubte">
            <Cardsection/>            
        </div>

        <div id="carousel">
            {/* <Example /> */}
        </div>
      

        <div id="part2">
            <Footer />
        </div>

    </div>


);

export default App;


