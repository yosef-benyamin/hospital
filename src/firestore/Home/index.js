import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getRoom() {
  const roomRef = await getDocs(collection(db, 'room'));
  let rooms = [];
  roomRef.forEach(room => {
    console.log('room', room.data());
    if (!rooms.includes(room.data().RoomName)) {
      rooms.push(room.data().RoomName);
    }
  });
  return rooms;
}
