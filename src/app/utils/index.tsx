import { Auth } from "aws-amplify";
import { Dayjs } from 'dayjs';

async function getJwtToken(): Promise<string | void> {
  if (!Auth || !Auth.currentAuthenticatedUser) {
    return;
  }
  return Auth.currentSession().then((data) => {
    return data.getIdToken().getJwtToken();
  }).catch(err => {
    console.log(err);
  });
}

// parse time in the format 2023-10-28T16:35:48Z
function parseTime(time: string): [string, string, string, string] {
  const [wholeDate, wholeTime] = time.split("T")
  const [year, month, day] = wholeDate.split("-")
  const [parsedTime, _] = wholeTime.split("Z")
  return [day, month, year, parsedTime]
}

// parse time in the format 2023-10-28T16:35:48Z and check with dayjs
function isDateMatch(date: Dayjs, time: string): Boolean {
  const [day, month, year, parsedTime] = parseTime(time)
  let wholeCompareDate = date.format("YYYY-MM-DD")
  const [compareYear, compareMonth, compareDay] = wholeCompareDate.split("-")
  console.log(compareDay, compareMonth, compareYear, time)
  return compareDay == day && compareMonth == month && compareYear == year
}

function generateFullTime(date: Dayjs, time: string): string {
  let wholeDate = date.format('YYYY-MM-DD')

  let wholeTime = time + ":00Z"
  return wholeDate + "T" + wholeTime
}
export { getJwtToken, parseTime, isDateMatch, generateFullTime };