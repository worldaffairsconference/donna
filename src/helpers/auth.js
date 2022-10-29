import { ref, firebaseAuth } from '../config/constants';

export function auth(email, pw, name, advisor) {
  return firebaseAuth.createUserWithEmailAndPassword(email, pw).then((data) => {
    console.log(data.user.uid);
    ref
      .child(`users/${data.user.uid}/info`)
      .set({
        email: email,
        uid: data.user.uid,
        name: name,
        advisor: advisor,
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
