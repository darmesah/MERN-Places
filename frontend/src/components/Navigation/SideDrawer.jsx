import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import classes from './SideDrawer.module.css';

const SideDrawer = (props) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside
        ref={nodeRef}
        className={`${classes['side-drawer']} ${
          props.show ? classes.slide : ''
        }`}
        onClick={props.onClick}
      >
        {props.children}
      </aside>
    </CSSTransition>
  );
};

export default SideDrawer;
