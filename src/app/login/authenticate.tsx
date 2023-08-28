import { Authenticator, } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getJwtToken } from '../utils';
import { useEffect, useState } from 'react';
import Map from '../map';

function Authenticate() {
  const [token, setToken] = useState('');

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
          <Map />
        </div>
      )}
    </Authenticator>
  );
}

export default Authenticate;