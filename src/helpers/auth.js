import { ref, firebaseAuth, firebaseAuthNoLogin } from '../config/constants';

export function auth(email, pw, name, grade, access) {
  // Check whether teachers/access exists in rtdb
  return new Promise(async (resolve, reject) => {
    const snapshot = await ref.child(`teachers/${access}`).once('value');
    if (!snapshot.exists()) {
      reject(new Error('Access code does not exist'));
      return;
    } else {
      if (snapshot.val().students) {
        if (
          Object.keys(snapshot.val().students).length + 1 >
          snapshot.val().regcountmax
        ) {
          reject(
            new Error(
              `Registration is currently unavailable for ${
                snapshot.val().school
              }. Maximum sign up quota is reached. Please ask your faculty advisor to contact the WAC team for further information.`
            )
          );
          return;
        }
      }
    }

    firebaseAuth
      .createUserWithEmailAndPassword(email, pw)
      .then((data) => {
        ref
          .child(`teachers/${access}/students/${data.user.uid}`)
          .set({
            email: email,
            name: name,
            p1: '',
            p2: '',
            grade: grade,
            note: '',
          })
          .then(() => {
            ref
              .child(`students/${data.user.uid}`)
              .set({
                teacherID: access,
              })
              .then(() => {
                resolve(data.user);
              });
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function addAttendee(email, pw, name, grade, access) {
  // Check whether teachers/access exists in rtdb
  return new Promise(async (resolve, reject) => {
    const snapshot = await ref.child(`teachers/${access}`).once('value');
    if (!snapshot.exists()) {
      reject(new Error('Access code does not exist'));
      return;
    }

    return firebaseAuthNoLogin
      .createUserWithEmailAndPassword(email, pw)
      .then((data) => {
        ref
          .child(`teachers/${access}/students/${data.user.uid}`)
          .set({
            email: email,
            name: name,
            p1: '',
            p2: '',
            grade: grade,
            note: '',
          })
          .then(() => {
            ref
              .child(`students/${data.user.uid}`)
              .set({
                teacherID: access,
              })
              .then(() => {
                resetPassword(email).then(() => {
                  return data.user;
                });
              });
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function tauth(email, school, cnumber, pw, name) {
  return firebaseAuth.createUserWithEmailAndPassword(email, pw).then((data) => {
    ref
      .child(`teachers/${data.user.uid}`)
      .set({
        email: email,
        school: school,
        cnumber: cnumber,
        name: name,
        regstatus: true,
        regcountmax: 25,
        waiver: false,
      })
      .then(() => data.user);
  });
}

export function logout() {
  return firebaseAuth.signOut();
}

export async function deleteUserData(teacher) {
  return new Promise(async (resolve, reject) => {
    await ref.child(`students/${firebaseAuth.currentUser.uid}`).remove();
    await ref
      .child(`teachers/${teacher}/students/${firebaseAuth.currentUser.uid}`)
      .remove();
    await deleteAccount();
    alert('Account deleted successfully.');
    resolve(true);
    return;
  });
}

export function deleteTeacherUserData() {
  return new Promise(async (resolve, reject) => {
    await ref.child(`teachers/${firebaseAuth.currentUser.uid}`).remove();
    await deleteAccount();
    alert('Account deleted successfully.');
    resolve(true);
    return;
  });
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

export function adminResetPassword(email) {
  return firebaseAuthNoLogin.sendPasswordResetEmail(email);
}
