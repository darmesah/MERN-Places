import { Suspense } from 'react';
import { Await, defer, json, redirect, useLoaderData } from 'react-router-dom';
import PlaceList from './components/PlaceList';

const UserPlaces = () => {
  const { places } = useLoaderData();

  return (
    <Suspense
      fallback={<p style={{ textAlign: 'center' }}>Loading Places...</p>}
    >
      <Await resolve={places}>
        {(data) =>
          data.error ? (
            <p>{data.error}</p>
          ) : (
            <PlaceList items={data.userPlaces} />
          )
        }
      </Await>
    </Suspense>
  );
};

export default UserPlaces;

export const loader = async ({ request, params }) => {
  const { userId } = params;

  const places = fetch(
    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
  ).then((res) => {
    if (!res.ok) {
      return { error: 'This is my error message' };
    }
    return res.json();
  });

  return defer({ places });
};

export const action = async ({ params, request }) => {
  const { userId } = params;

  const data = await request.formData();
  const id = data.get('_id');
  const token = data.get('token');

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/places/${id}`,
    {
      method: request.method,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
  );

  if (!response.ok) {
    throw json({ message: 'Could not delete event' });
  }

  return redirect(`/${userId}/places`);
};
