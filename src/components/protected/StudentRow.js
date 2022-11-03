import React from 'react';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { RegOpen } from '../../config/config.js';

export function StudentRow(props) {
  function deleteStudent(key) {
    ref
      .child(`teachers/${firebaseAuth.currentUser.uid}/students/${key}`)
      .remove();
  }
  let key;
  const action = props.studentKey;
  const studentInfo = props.studentData.map((student) => (
    <tr>
      <td>{student.name}</td>
      <td>{student.grade}</td>
      <td>{student.p1}</td>
      <td>{student.p2}</td>
      <td>{student.note}</td>
    </tr>
  ));

  return <tbody>{studentInfo}</tbody>;
}
