import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import MainHeader from "./MainHeader";
import classes from "./MainNavigation.module.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/BackDrop/BackDrop";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer onClick={closeDrawerHandler} show={drawerIsOpen}>
        <nav className={classes["main-navigation__drawer-nav"]}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          onClick={openDrawerHandler}
          className={classes["main-navigation__menu-btn"]}
        >
          <FiMenu />
        </button>
        <h1 className={classes["main-navigation__title"]}>
          <Link to="/">Places</Link>
        </h1>
        <nav className={classes["main-navigation__header-nav"]}>
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
