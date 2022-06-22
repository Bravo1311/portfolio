import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGlassCheers} from 'react-icons/fa';



const Appsection = () => (
    // <div className="row text-center">
    //   <div>
      
    //   <div className="col  col-lg-4 col-md-6 col-sm-6"></div>
    //   <h1 className="mt-5">Hi, I'm Kartik,</h1>
    //   <h4 style={{paddingLeft:"100px"}}>an accidental programmer</h4>
    //   <h4 style={{paddingLeft:"100px"}}>Welcome to my life!!!!!!!</h4>
      
    
    //   </div>

    //   <div className="row appsection" style={{ fontSize:"18px", marginTop:"100px"}} >
    //     <p className="col col-lg-4 col-md-6 col-sm-6 mt-5">I did my bachelors in Mechanical Engineering...</p>
    //     <p className="col col-lg-4 col-md-6 col-sm-6  mt-5">...Did solid modelling...</p>
    //     <p className="col col-lg-4 col-md-6 col-sm-6  mt-5">...Explored new Renewable Energy Resources...</p>
    //     <p className="col col-lg-6 col-md-6 col-sm-6  mt-5">...Managed operations for Jeff Bezos...</p>
    //     <p className="col col-lg-6 col-md-6 col-sm-12  mt-5">...and here I am. </p>
    //   </div>
    // </div>
    <div className="container-fluid text-center" id="title" style={{ height: "auto" }}>
       <h1 className="pt-5">Hi, I'm Kartik,</h1>
       <h4 style={{paddingLeft:"100px"}}>an accidental programmer</h4>
       <h4 style={{paddingLeft:"100px"}}>Welcome to my life.</h4>
       <br></br>
       <img style={{borderRadius:"100%"}} width = "210px" src = "https://media-exp1.licdn.com/dms/image/C5603AQH0gqnvJyJPGw/profile-displayphoto-shrink_400_400/0/1641911630435?e=1660176000&v=beta&t=610vhnwL6eDKnWfRB5TsKUBwKGduCqCGWS97qLorQPE" alt = "profile photo"/>
       <p style={{padding:"5% 10% 1% 10%"}}>I completed my B.E Mechanical Engineering from BITS Pilani in 2021. I began my career as a developer in Amazon, by making excel VBA macros. Since then, I have enjoyed working in this field.
          The satisfaction you get when you solve a problem with code is something that drives me. I look forward to connect with people from all walks of life and apply the 
          lessons learnt in my journey.
       </p>
       <p style={{margin:"0%", paddingBottom:"40px"}}>Cheers to many more lines of code!!! <FaGlassCheers size={30} color = "#354259"/></p>
    </div>
    
)

export default Appsection;