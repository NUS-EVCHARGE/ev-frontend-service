import { ComponentPropsToStylePropsMap } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { Dayjs } from 'dayjs';
import { parse } from "path";

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
  console.log("parse time", time)
  const [wholeDate, wholeTime] = time.split("T")
  const [year, month, day] = wholeDate.split("-")
  const [parsedTime, _] = wholeTime.split("Z")
  return [day, month, year, parsedTime]
}

// parse time in the format 2023-10-28T16:35:48Z and check with dayjs
function isDateMatch(date: string, time: string): Boolean {
  // console.log("date matched called")
  const [day, month, year, parsedTime] = parseTime(time)
  const [compareYear, compareMonth, compareDay] = date.split("-")
  console.log(compareDay, compareMonth, compareYear, time)
  return compareDay == day && compareMonth == month && compareYear == year
}

function isTimeMatch(compareTime: string, time: string): Boolean {
  const [day, month, year, parsedTime] = parseTime(time)
  let fullCompareTime = compareTime + ":00"
  console.log("is time matched: ", fullCompareTime, parsedTime, "result: ", fullCompareTime === parsedTime)
  return fullCompareTime.trim() === parsedTime.trim()
}

function isTimeBeforeNow(selectedDate: string, compareTime: string): Boolean {
  let timeNowHours = new Date().getHours()
  let timeNowMin = new Date().getMinutes()
  let timeDay = new Date().getDay()
  let timeMonth = new Date().getMonth()
  let timeYear = new Date().getFullYear()
  let [compareTimeHour, compareTimeMin] = compareTime.split(":")
  let [compareYear, compareMonth, compareDay] = selectedDate.split("-")

  if (timeYear >= +compareYear && timeMonth >= +compareMonth && timeDay >= +compareDay) {
    if (timeNowHours >= +compareTimeHour && timeNowMin > +compareTimeMin) {
      return true
    }
  }

  // console.log("compare timen now:", timeNow)
  return false
}

function generateFullTime(date: string, time: string): string {

  let wholeTime = time + ":00Z"
  return date + "T" + wholeTime
}

function getReadableStringFromDate(date: Date): string {
  return date.getFullYear + "-" + date.getMonth + "-" + date.getDay + " " + date.getHours + ":" + date.getMinutes
}
export { getJwtToken, parseTime, isDateMatch, generateFullTime, isTimeMatch, isTimeBeforeNow, getReadableStringFromDate };