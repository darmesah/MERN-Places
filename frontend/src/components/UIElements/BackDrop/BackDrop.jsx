import classes from './BackDrop.module.css';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

export default Backdrop;
