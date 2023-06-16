import { Suspense } from 'react';
import { Await, defer, json, useLoaderData } from 'react-router-dom';

import UsersList from './components/UsersList';

const Users = () => {
  const { users } = useLoaderData();

  return (
    <Suspense
      fallback={<p style={{ textAlign: 'center' }}>Loading Users...</p>}
    >
      <Await resolve={users}>
        {(loadedUsers) => <UsersList items={loadedUsers} />}
      </Await>
    </Suspense>
  );
};

export default Users;

export const loadUsers = async () => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`);

  if (!response.ok) {
    throw json({ message: 'Could not fetch users.' }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.users;
  }
};

export const loader = () => {
  return defer({
    users: loadUsers(),
  });
};
