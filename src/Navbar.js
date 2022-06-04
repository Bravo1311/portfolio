import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
const styles= {
  color: 'red',
};

const Navbar = () => (
  // <nav classNameName = "navbar navbar-expand-lg bg-light align-items">
  //   <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  //     <span className="navbar-toggler-icon"></span>
  //   </button>
  //   <div classNameName="collapse navbar-collapse" id="navbarSupportedContent">
  //     <a classNameName="navbar-brand">Kartik</a>
  //     <ul classNameName="navbar-nav ms-auto">
  //       <li classNameName="nav-item">
  //         <a classNameName="nav-link">Contact</a>
  //       </li>
  //       <li classNameName="nav-item">
  //         <a classNameName="nav-link">Pricing</a>
  //       </li>
  //       <li classNameName="nav-item">
  //         <a classNameName="nav-link">Download</a>
  //       </li>
  //     </ul>
  //   </div>
  // </nav>

<nav className="navbar navbar-expand-lg  ">
<div className="container-fluid">
  <a className="navbar-brand" href="#"></a>
  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse " style={styles} id="navbarSupportedContent">
    <ul className="navbar-nav ms-auto ">
      <li className="nav-item">
        <a className="nav-link" aria-current="page" href="#"><h5>Home</h5></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href=""><h5>Portfolio</h5></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href=""><h5>My Music Gallery</h5></a>
      </li>
      {/* <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Dropdown
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li><a className="dropdown-item" href="#">Action</a></li>
          <li><a className="dropdown-item" href="#">Another action</a></li>
          <li><hr className="dropdown-divider"></hr></li>
          <li><a className="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </li> */}
    </ul>
  </div>
</div>
</nav>





    // <nav classNameName="navbar navbar-expand-lg text-white bg-dark">
    //   <a classNameName="navbar-brand text-success" href="#">Navbar</a>

    //   <div classNameName="collapse navbar-collapse">
    //     <ul classNameName="navbar-nav mr-auto">
    //       <li classNameName="nav-item active">
    //         <a classNameName="nav-link text-white" href="#">Home </a>
    //       </li>
    //       <li classNameName="nav-item">
    //         <a classNameName="nav-link text-white" href="#">About Us</a>
    //       </li>
    //       <li classNameName="nav-item dropdown">
    //         <a classNameName="nav-link text-white">
    //           Products
    //         </a>
    //       </li>
    //       <li classNameName="nav-item">
    //         <a classNameName="nav-link disabled" href="#">Meeting</a>
    //       </li>
    //     </ul>
    //     <form classNameName="form-inline my-2 my-lg-0">
    //       <input
    //         classNameName="form-control mr-sm-2"
    //         type="search"
    //         placeholder="Search"
    //         aria-label="Search"
    //       />
    //       <button classNameName="btn btn-outline-success my-2 my-sm-0" type="submit">
    //         Search
    //       </button>
    //     </form>
    //   </div>
    // </nav>
   

);

export default Navbar;