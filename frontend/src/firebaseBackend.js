import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from './firebase';
import { getAuth } from "firebase/auth";
import { dayJSToFirestoreTS, firestoreTSToDayJS } from "./utils";
console.log(db)

const firebaseBackend = {
  createEvent: async (inputEvent) => {
    const auth = getAuth();
    let user = auth.currentUser 
    if (!inputEvent || ! inputEvent.name ||
      ! inputEvent.description ||
      ! inputEvent.startDateTime ||
      ! inputEvent.endDateTime 
    ) {
      throw new Error('Invalid event data');
    }
    let event = {
      uid: user.uid,
      name: inputEvent.name,
      description: inputEvent.description,
      startDateTime: dayJSToFirestoreTS(inputEvent.startDateTime), 
      endDateTime: dayJSToFirestoreTS(inputEvent.endDateTime),
      isFullDay: inputEvent.isFullDay,
    }
    console.log("event", event)
    const docRef = await addDoc(collection(db, "events"), event);
    return docRef.id;

  },

  getAllEvents: async () => {
    const user = getAuth().currentUser
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      let dbData = doc.data()
      console.log(dbData)
      dbData.startDateTime = firestoreTSToDayJS(dbData.startDateTime)
      dbData.endDateTime = firestoreTSToDayJS(dbData.endDateTime)
      events.push(dbData);
    });
    return events;
  },
};

export default firebaseBackend