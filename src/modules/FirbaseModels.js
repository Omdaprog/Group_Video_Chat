
import database from "../config"

const userID = database.ref('/notifs/').push().key

export const eventListener = async (roomID, handleUpdate) => {

  await database.ref('/notifs/' + roomID + '/' + userID).remove()

  database.ref('/notifs/' + roomID + '/' + userID)
    .on('value', snapshot => {
      snapshot.exists() && handleUpdate(snapshot.val(), userID)
    })
  


  // 
}

export const currentUser = async (roomID) => {
  await database.ref('/notifs/' + roomID +  '/' + userID ).set({
    type: "currentUser",
    currentUserID : userID,
  })
}



export const sendingSignal = async (userToSignal, callerID , signal, roomID) => {
  await database.ref('/notifs/' + roomID + "/" + userToSignal).update({
    type: 'sendingSignal',
    from: callerID,
    to: userToSignal,
    signal: JSON.stringify(signal)
  })
}


export const returningSignal = async (roomID ,signal, callerID, to) => {
  await database.ref('/notifs/' + roomID + "/" + callerID).update({
    type: 'returningSignal',
    userID: to,
    signal: JSON.stringify(signal)
  })
}

// export const doLeaveNotif = async (to, database, username) => {
//   await database.ref('/notifs/' + to).update({
//     type: 'leave',
//     from: username
//   })
// }

// export const doCandidate = async (to, candidate, database, username) => {
//   // send the new candiate to the peer
//   await database.ref('/notifs/' + to).update({
//     type: 'candidate',
//     from: username,
//     candidate: JSON.stringify(candidate)
//   })
// }
