import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <div className=" ">
      <ul className="flex w-full justify-between items-center">
        <li className="w-1/4">
          <NavLink to={"/"}>
            <img src={logo} className=" w-28 h-28" />
          </NavLink>
        </li>

        <div className="flex justify-evenly w-2/4 font-semibold text-xl">
          <NavLink to={"/books"}>
            <li>Books</li>
          </NavLink>
          <NavLink to={"/dashboard"}>
            <li>DashBoard</li>
          </NavLink>
          <NavLink to={"/login"}>
            <li>Login</li>
          </NavLink>
          <NavLink to={"/signup"}>
            <li>Sign Up</li>
          </NavLink>
        </div>
      </ul>
    </div>
  );
};

export default Header;
