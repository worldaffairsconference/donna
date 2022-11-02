import { ref, firebaseAuth } from '../config/constants';

export function auth(email, pw, name, access) {
  if (access !== 'admin') {
    return new Promise((resolve, reject) => {
      reject(new Error('Invalid Access Code'));
    });
  }
  return firebaseAuth.createUserWithEmailAndPassword(email, pw).then((data) => {
    console.log(data.user.uid);
    ref
      .child(`users/${data.user.uid}/info`)
      .set({
        email: email,
        name: name,
      })
      .then(() => data.user);
  });
}
export function tauth(email, school, cnumber, pw, name) {
  return firebaseAuth.createUserWithEmailAndPassword(email, pw).then((data) => {
    console.log(data.user.uid);
    ref
      .child(`teachers/${data.user.uid}`)
      .set({
        email: email,
        school:school,
        cnumber:cnumber,
        name: name,
        waiver: false,
      })
      .then(() => data.user);
  });
}

export function logout() {
  return firebaseAuth.signOut();
}

export function deleteUserData() {
  console.log(firebaseAuth.currentUser.uid);
  return ref.child(`users/${firebaseAuth.currentUser.uid}`).remove();
}

export function deleteAccount() {
  return firebaseAuth.currentUser.delete();
}

export function login(email, pw) {
  return firebaseAuth.signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth.sendPasswordResetEmail(email);
}
