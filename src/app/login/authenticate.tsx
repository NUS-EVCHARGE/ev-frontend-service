import { Authenticator, } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getJwtToken } from '../utils';
import { useEffect, useState } from 'react';
import Map from '../map';
import { ChargingStationArray } from '../map';

function Authenticate() {
  const [token, setToken] = useState('');

  const markers: ChargingStationArray = [
    { id: 1, address: "Address1", lat: 1.2922, lng: 103.7766 },
    { id: 2, address: "Address2", lat: 1.3332674, lng: 103.6367302 },
  ];


  useEffect(() => {

    async function getToken() {
      const jwtToken = await getJwtToken();
      if (jwtToken) {
        setToken(jwtToken);
      }
    };

    if (!token) {
      getToken();
    }
  }, []);

  return (
    <Authenticator signUpAttributes={['email']}>
      {({ signOut, user }) => (


        <div>
          <p>Welcome {user?.username}</p>
          <p>Email: {user?.attributes?.email}</p>
          <button onClick={signOut}>Sign out</button>

          <Map chargingStations={markers} />
        </div>
      )}
    </Authenticator>
  );
}

export default Authenticate;