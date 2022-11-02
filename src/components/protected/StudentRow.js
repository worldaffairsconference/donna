import React from 'react';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { RegOpen } from '../../config/config.js';

export function StudentRow(props) {
  function deleteStudent(key) {
    ref.child(`teachers/${firebaseAuth.currentUser.uid}/students/${key}`).remove();
  }
  let key;
  const action = props.studentKey;
  const studentInfo = props.studentData.map((student) => (
    <tr>
      <td>{student.name}</td>
      <td>{student.grade}</td>
      {student.panel1 ? (
        <td>
          <FontAwesome
            name="check"
            style={{
              textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
              color: '#008000',
              padding: '0px 20px 0px 20px',
            }}
          />
        </td>
      ) : (
        <td> </td>
      )}
      {student.panel2 ? (
        <td>
          <FontAwesome
            name="check"
            style={{
              textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
              color: '#008000',
              padding: '0px 20px 0px 20px',
            }}
          />
        </td>
      ) : (
        <td> </td>
      )}
    </tr>
  ));

  return <tbody>{studentInfo}</tbody>;
}
