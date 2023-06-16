import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { authActions } from '../../store/auth';

import classes from './NavLinks.module.css';

const NavLinks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const userId = useSelector((state) => state.auth.userId);

  const logoutHandler = () => {
    navigate('/', { replace: true });

    dispatch(authActions.logout());
  };

  return (
    <ul className={classes['nav-links']}>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          ALL USERS
        </NavLink>
      </li>
      {isAuth && (
        <li>
          <NavLink
            to={`/${userId}/places`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            MY PLACES
          </NavLink>
        </li>
      )}
      {isAuth && (
        <li>
          <NavLink
            to="/places/new"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            ADD PLACE
          </NavLink>
        </li>
      )}
      {!isAuth && (
        <li>
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            AUTHENTICATE
          </NavLink>
        </li>
      )}
      {isAuth && (
        <li>
          <button onClick={logoutHandler} to="/logout">
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
