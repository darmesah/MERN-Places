import { useRef, useState, useEffect } from 'react';
import Button from '../Button';
import classes from './ImageUpload.module.css';

const ImageUpload = (props) => {
  const [file, setFile] = useState('');
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  let pickedFile;
  const pickedHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className={props.className}>
      <input
        type="file"
        ref={filePickerRef}
        style={{ display: 'none' }}
        name="image"
        id={props.id}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        onInput={props.valueChangeHandler}
      />
      <div
        className={`${classes['image-upload']} ${
          props.center && classes.center
        }`}
      >
        <div className={classes['image-upload__preview']}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
