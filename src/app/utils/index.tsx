import { Auth } from "aws-amplify";

async function getJwtToken() : Promise<string | void>{
  return Auth.currentSession().then((data) => {
    return data.getIdToken().getJwtToken();
  }). catch (err => {
    console.log(err);
  });
}

export { getJwtToken };