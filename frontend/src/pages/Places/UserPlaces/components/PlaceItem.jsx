import { useState } from "react";
import { useSubmit } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../../../../components/FormElements/Button";
import Card from "../../../../components/UIElements/Card/Card";
import Map from "../../../../components/UIElements/Map/Map";
import Modal from "../../../../components/UIElements/Modal/Modal";
import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const submit = useSubmit();

  const { _id, image, title, description, address, location, creator } = props;

  const [showMap, setShowMap] = useState(false);
  const [showConfrimModal, setShowConfrimModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfrimModal(true);

  const cancelDeleteHandler = () => setShowConfrimModal(false);

  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.userId);
  const confirmDeleteHandler = () => {
    submit({ _id, token }, { method: "delete" });
    // setShowConfrimModal(false);
  };

  const isCreator = creator === id;

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass={classes["place-item__modal-content"]}
        footerClass={classes["place-item__modal-actions"]}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className={classes["map-container"]}>
          <Map location={location} />
        </div>
      </Modal>
      <Modal
        show={showConfrimModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass={classes["place-item__modal-actions"]}
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed to delete this place? Please note that it
          cannot be undone thereafter
        </p>
      </Modal>
      <li className={classes["place-item"]}>
        <Card className={classes["place-item__content"]}>
          <div className={classes["place-item__image"]}>
            <img
              loading="lazy"
              src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
              alt={title}
            />
          </div>
          <div className={classes["place-item__info"]}>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className={classes["place-item__actions"]}>
            <Button onClick={openMapHandler} inverse>
              VIEW ON MAP
            </Button>
            {isCreator && <Button to={`/places/${_id}`}>EDIT</Button>}

            {isCreator && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
