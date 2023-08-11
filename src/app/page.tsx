"use client";
import {Amplify} from 'aws-amplify';
import awsExports from "./aws-exports";

import Authenticate from './Login/authenticate';

// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID
  }
})

function App() {
  return (
    <div className="App">
      <Authenticate />
    </div>
  );
}

export default App;