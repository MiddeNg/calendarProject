import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"

function dayJSToFirestoreTS(day) {
  return new Timestamp(day.unix(), 0)
}

function firestoreTSToDayJS(ts) {
  return dayjs(ts.toDate(), 0)
}

export { dayJSToFirestoreTS, firestoreTSToDayJS }