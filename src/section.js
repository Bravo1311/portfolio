import React from "react";
import { BsYoutube, BsLinkedin } from 'react-icons/bs';

const Section = ({title = "Basketball", thumbnail = "http://img.youtube.com/vi/wHRScvoZ8xc/hqdefault.jpg", link = "https://www.youtube.com/channel/UCmXbIh3Q1erZ7WARaYHF75g"
      , songname = "Music Cover"}) =>(
    <div className="cards">
              <img
                src={thumbnail}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <a href={link} className="btn btncolor"><BsYoutube size={50}/></a>
              </div>
            </div>
)

export default Section;