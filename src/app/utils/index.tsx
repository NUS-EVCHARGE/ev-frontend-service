import { Auth } from "aws-amplify";
import { Dayjs } from 'dayjs';

async function getJwtToken(): Promise<string | void> {
  if (!Auth || !Auth.currentAuthenticatedUser) {
    return;
  }
  return Auth.currentSession().then((data) => {
    console.log(data.getIdToken().getJwtToken());
    return data.getIdToken().getJwtToken();
  }).catch(err => {
    console.log(err);
  });
}

// parse time in the format 2023-10-28T16:35:48Z
function parseTime(time: string): [string, string, string, string] {
  const [wholeDate, wholeTime] = time.split("T")
  const [day, month, year] = wholeDate.split("-")
  const [parsedTime, _] = wholeTime.split("Z")
  return [day, month, year, parsedTime]
}

// parse time in the format 2023-10-28T16:35:48Z and check with dayjs
function isDateMatch(date: Dayjs, time: string): Boolean {
  const [day, month, year, parsedTime] = parseTime(time)
  let compareDay = date.day.toString()
  let compareMonth = date.month.toString()
  let compareYear = date.year.toString()
  console.log(compareDay, compareMonth, compareYear, time)
  return compareDay == day && compareMonth == month && compareYear == year
}
export { getJwtToken, parseTime, isDateMatch };