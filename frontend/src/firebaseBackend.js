import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, writeBatch } from "firebase/firestore";
import { db } from './firebase';
import { getAuth } from "firebase/auth";
import { dayJSToFirestoreTS, firestoreTSToDayJS } from "./utils";
import { v4 as uuid } from 'uuid';

const firebaseBackend = {
  createEvent: async (inputEvent) => {
    const auth = getAuth();
    let user = auth.currentUser 
    if (!inputEvent || ! inputEvent.name ||
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

  updateEvent: async (inputEvent) => {
    if (!inputEvent || !inputEvent.id) {
      throw new Error('Invalid event data');
    }
    const docRef = doc(db, "events", inputEvent.id);
    const auth = getAuth();
    let user = auth.currentUser 
    let event = {
      uid: user.uid,
      name: inputEvent.name,
      description: inputEvent.description,
      startDateTime: dayJSToFirestoreTS(inputEvent.startDateTime), 
      endDateTime: dayJSToFirestoreTS(inputEvent.endDateTime),
      isFullDay: inputEvent.isFullDay,
    }
    await updateDoc(docRef, event);
    return docRef.id;
  },
  updateBatchEvents: async (newEvents, UpdatedEvents) => {
    const userId = getAuth().currentUser.uid
    let batch = writeBatch(db);
    console.log("newEvents", newEvents)
    console.log("UpdatedEvents", UpdatedEvents)
    newEvents.forEach(event => {
      const docRef = doc(db, "events", uuid());
      const newEvent = {
        uid: userId,
        name: event.name,
        description: event.description,
        startDateTime: dayJSToFirestoreTS(event.startDateTime), 
        endDateTime: dayJSToFirestoreTS(event.endDateTime),
        isFullDay: event.isFullDay,
      }
      console.log("newEvent", newEvent)
      batch.set(docRef, newEvent);
    })
    UpdatedEvents.forEach(event => {
      const docRef = doc(db, "events", event.id);
      batch.update(docRef, {
        name: event.name,
        description: event.description,
        startDateTime: dayJSToFirestoreTS(event.startDateTime), 
        endDateTime: dayJSToFirestoreTS(event.endDateTime),
        isFullDay: event.isFullDay,
      });
    });
    await batch.commit();
  },
  getAllEvents: async () => {
    const user = getAuth().currentUser
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("uid", "==", user.uid), orderBy("startDateTime", "asc"));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      let dbData = doc.data()
      dbData.id = doc.id
      dbData.startDateTime = firestoreTSToDayJS(dbData.startDateTime)
      dbData.endDateTime = firestoreTSToDayJS(dbData.endDateTime)
      events.push(dbData);
    });
    return events;
  },
};

export default firebaseBackend