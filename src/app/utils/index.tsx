import { Auth } from "aws-amplify";

function getJwtToken() {
    return Auth.currentSession().then((data) => {
        console.log(data.getIdToken().getJwtToken());
      return data.getIdToken().getJwtToken();
    });
}

export { getJwtToken };