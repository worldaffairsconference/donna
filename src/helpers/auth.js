import { ref, firebaseAuth, firebaseAuthNoLogin } from '../config/constants';

export function auth(email, pw, name, grade, access) {
  // Check whether teachers/access exists in RTDB
  return new Promise(async (resolve, reject) => {
    const snapshot = await ref.child(`teachers/${access}`).once('value');
    if (!snapshot.exists()) {
      reject(new Error('Access code does not exist'));
      return;
    } else {
      if (snapshot.val().regstatus === false) {
        reject(
          new Error(
            `Registration is currently unavailable for ${
              snapshot.val().name
            }, ${
              snapshot.val().school
            }. Please ask your faculty advisor to contact the WAC team for further information.`
          )
        );
        return;
      }


      //Uncomment this to reinstitute a registration limit per school


      /*if (snapshot.val().students) {
        if (
          Object.keys(snapshot.val().students).length + 1 >
          snapshot.val().regcountmax
        ) {
          reject(
            new Error(
              `Registration is currently unavailable for ${
                snapshot.val().school
              }. Maximum sign-up quota is reached. Please ask your faculty advisor to contact the WAC team for further information.`
            )
          );
          return;
        }
      }*/
    }

    firebaseAuth
      .createUserWithEmailAndPassword(email, pw)
      .then((data) => {
        ref
          .child(`teachers/${access}/students/${data.user.uid}`)
          .set({
            email: email,
            name: name,
            grade: grade,
            p1: { rank1: '', rank2: '', rank3: '' },
            p2: { rank1: '', rank2: '', rank3: '' },
            p3: { rank1: '', rank2: '', rank3: '' },
            plen1: '',
            plen2: '',
            plen3: '',
            note: '',
            lunch: false,
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
  // Check whether teachers/access exists in RTDB
  return new Promise(async (resolve, reject) => {
    const snapshot = await ref.child(`teachers/${access}`).once('value');
    if (!snapshot.exists()) {
      reject(new Error('Access code does not exist'));
      return;
    }

    firebaseAuthNoLogin
      .createUserWithEmailAndPassword(email, pw)
      .then((data) => {
        ref
          .child(`teachers/${access}/students/${data.user.uid}`)
          .set({
            email: email,
            name: name,
            grade: grade,
            p1: { rank1: '', rank2: '', rank3: '' },
            p2: { rank1: '', rank2: '', rank3: '' },
            p3: { rank1: '', rank2: '', rank3: '' },
            plen1: '',
            plen2: '',
            plen3: '',
            note: '',
            lunch: false,
          })
          .then(() => {
            ref
              .child(`students/${data.user.uid}`)
              .set({
                teacherID: access,
              })
              .then(() => {
                resetPassword(email).then(() => {
                  resolve(data.user);
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
        regcountmax: 300,
        waiver: false,
      })
      .then(() => data.user);
  });
}

export function logout() {
  return firebaseAuth.signOut();
}

export async function deleteUserData(uid, teacherid) {
  return new Promise(async (resolve, reject) => {
    await ref.child(`students/${uid}`).remove();
    await ref.child(`teachers/${teacherid}/students/${uid}`).remove();
    // console.log(teacherid);
    // console.log(uid);
    await ref
      .child(`teachers/${teacherid}/students/${uid}`)
      .once('value', (snapshot) => {
        let data = snapshot.val();
        if (data.p1) {
          ref.child(`plenaries/${data.p1}/students/${uid}`).remove();
        }
        if (data.p2) {
          ref.child(`plenaries/${data.p2}/students/${uid}`).remove();
        }
        if (data.p3) {
          ref.child(`plenaries/${data.p3}/students/${uid}`).remove();
        }
      });
    alert('Data deleted successfully. Please delete account in firebase.');
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

