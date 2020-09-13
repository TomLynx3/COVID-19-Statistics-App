import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="container-buttons">
      <NavLink exact to="/" className="btn" activeClassName="btn active">
        Таблица
      </NavLink>
      <NavLink to="/graphic" className="btn" activeClassName="btn active">
        График
      </NavLink>
    </div>
  );
};

export default Navbar;
