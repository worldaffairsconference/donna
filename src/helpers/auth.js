import { ref, firebaseAuth } from '../config/constants'

export function auth (email, pw, school) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(function(user){
      ref.child(`users/${user.uid}/info`)
        .set({
          email: email,
          uid: user.uid,
          school: school,
          payment: false
        })
        .then(() => user)
    })
}



export function logout () {
  return firebaseAuth().signOut()
}

export function deleteUserData() {
  console.log(firebaseAuth().currentUser.uid);
  return ref.child(`users/${firebaseAuth().currentUser.uid}`).remove();
}

export function deleteAccount () {
  return firebaseAuth().currentUser.delete().then(function() {
  // User deleted.
  });
}


export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}
