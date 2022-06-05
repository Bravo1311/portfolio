import React from "react";
import { BsInstagram, BsLinkedin, BsYoutube, BsGithub } from 'react-icons/bs';
import Cardsection from "./Cardsection";

const Footer = () => (
  // <section clasName="footer  bg-dark text-white">
  //   <a href="https://www.instagram.com/"><BsInstagram/></a>
  //   <a href="https://www.instagram.com/"><BsLinkedin/></a>
  //   <p className="lead container">You can react via email too</p>
  //   <p className="lead container">NO COPYRIGHT</p>
  // </section>
  <div className="row" >
    <div className="col-lg-4 footer mt-4" >
      <a className="contact" href="https://github.com/Bravo1311"><BsGithub size={25} color  = "#171515 " /></a>
      <a className="contact" href="https://www.linkedin.com/in/kartik-agrawal-a74b5215a/"><BsLinkedin size={25} /></a>
      <a className="contact" href="https://www.youtube.com/channel/UCmXbIh3Q1erZ7WARaYHF75g"><BsYoutube size={30} color = "#FF0000"/></a>
      <a className="contact" href="https://www.instagram.com/pj_kartik/"><BsInstagram size={25} color="#FA4EAB" /></a>    
    </div>

  </div>
)

export default Footer;