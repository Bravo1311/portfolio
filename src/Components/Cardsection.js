import React from "react";
import Section from "../section";

const Cardsection = () =>{
    return(
        <section >
      <div className="container-fluid ">
        <h2 className="">
          You know, I'm something of a musician myself.
        </h2>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section className = "col-lg-4 col-md-6 col-sm-6" title="Agar Tum Saath Ho | Tamasha" link="https://www.youtube.com/watch?v=wHRScvoZ8xc" thumbnail="http://img.youtube.com/vi/wHRScvoZ8xc/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section  className = "col-lg-4 col-md-6 col-sm-6 | Coldplay" title="Fix You | Coldplay" link="https://www.youtube.com/watch?v=ITvp139IXpc" thumbnail="http://img.youtube.com/vi/ITvp139IXpc/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="The Scientist | Coldplay" link="https://www.youtube.com/watch?v=WGGXoSk1JHA" thumbnail="http://img.youtube.com/vi/WGGXoSk1JHA/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="Perfect | Ed Sheeran" link="https://www.youtube.com/watch?v=VCqAHUpvnNg" thumbnail="http://img.youtube.com/vi/VCqAHUpvnNg/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="Agar Tum Saath Ho Encore | Tamasha" link="https://www.youtube.com/watch?v=hexWmr1G3JE" thumbnail="http://img.youtube.com/vi/hexWmr1G3JE/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="What I've Done | Linkin Park" link="https://www.youtube.com/watch?v=Kj5nHesMink" thumbnail="http://img.youtube.com/vi/Kj5nHesMink/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="Bad Liar | Imagine Dragons" link="https://www.youtube.com/watch?v=PzyrwFTyB3w" thumbnail="http://img.youtube.com/vi/PzyrwFTyB3w/hqdefault.jpg"/>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <Section title="Boulevard of Broken Dreams | Green Day" link="https://www.youtube.com/watch?v=STfFe8Rh_CM" thumbnail="http://img.youtube.com/vi/STfFe8Rh_CM/hqdefault.jpg"/>
          </div>
          
            
           
           
       
          {/* <div className="col-4">
            <div className="card" style={{width: "18rem"}}>
              <img
                src="https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-success">Go somewhere</a>
              </div>
            </div>
          </div> */}
         
        </div>
      </div>
    </section>
    )
}

export default Cardsection;