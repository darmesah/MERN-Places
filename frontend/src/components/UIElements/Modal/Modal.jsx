import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import Backdrop from '../BackDrop/BackDrop';
import classes from './Modal.module.css';

const ModalOverlay = (props) => {
  return (
    <div className={`${classes.modal} ${props.className}`} style={props.style}>
      <header className={`${classes.modal__header} ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`${classes.modal__content} ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`${classes.modal__footer} ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
};

const Modal = (props) => {
  const nodeRef = useRef(null);

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        nodeRef={nodeRef}
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
