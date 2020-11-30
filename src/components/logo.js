import React from "react"
import { Link } from "gatsby"
import logobg from "../assets/images/logodovebg.jpeg";

const Logo = (props) => (
  <div className="site-logo" >
    <Link style={{display: "flex", alignItems: "center"}} to="/"><img style={{height: "30px", width: "50px"}}  src={logobg} alt="Logo" />{props.title}</Link>
  </div>
)

export default Logo