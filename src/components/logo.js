import React from "react"
import { Link } from "gatsby"
import logobg from "../assets/images/heade-image.png"

const Logo = props => (
  <div className="site-logo">
    <Link style={{ display: "flex", alignItems: "center" }} to="/">
      <img 
      style={{height: "60px", width: "100%"}}  
      src={logobg}
        alt="Logo"
      />
    </Link>
  </div>
)

export default Logo
