import classes from './Input.module.css';

const Input = (props) => {
  const element =
    props.element === 'input' ? (
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      />
    ) : (
      <textarea
        name={props.name}
        placeholder={props.placeholder}
        rows={props.rows || 3}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      />
    );

  return (
    <div
      className={`${classes['form-control']} ${
        props.hasError && classes['form-control--invalid']
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {props.hasError}
    </div>
  );
};

export default Input;
