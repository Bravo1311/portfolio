import React from "react";
import CV from "./CV.png"
import PDF from "./kartik Agrawal.pdf"

const Portf = () =>(
    <div className="container-fluid">
        {/* <img src = {CV}  alt="My CV" style={{marginLeft:"auto", marginRight:"auto", width:"50%"}}/> */}
        <embed className="center" src={PDF} width="80%" height="1000px"style={{ margin:"5% 10% 5% 10% "}}/>
        {/* <iframe src={PDF} style={{width:"600px", height:"500px", frameborder:"0"}}></iframe> */}
      
    </div>
)

export default Portf;