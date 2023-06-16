import Button from '../../../../components/FormElements/Button';
import Card from '../../../../components/UIElements/Card/Card';
import PlaceItem from './PlaceItem';
import classes from './PlaceList.module.css';

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No places found. Maybe create one</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={classes['place-list']}>
      {props.items.map((place) => (
        <PlaceItem key={place._id} {...place} />
      ))}
    </ul>
  );
};

export default PlaceList;
