import { Authenticator, Divider, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getJwtToken } from '../utils';
import { Suspense, useEffect, useState } from 'react';

function Authenticate() {
  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const jwtToken = await getJwtToken();
      setToken(jwtToken);
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
          <p>{token}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default Authenticate;