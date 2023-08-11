import { Authenticator, Divider, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getJwtToken } from '../utils';
import { Suspense } from 'react';

function Authenticate() {
    return (
      <Authenticator signUpAttributes={['email']}>
        {({ signOut, user }) => (
            <div>
              <p>Welcome {user?.username}</p>
              <p>Email: {user?.attributes?.email}</p>
              <Suspense>
                <p>{getJwtToken()}</p>
              </Suspense>
              {/* <p>test: {getJwtToken()}</p> */}
              <button onClick={signOut}>Sign out</button>
            </div>
        )}
      </Authenticator>
    );
  }

  export default Authenticate;