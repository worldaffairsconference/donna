import React from 'react';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { RegOpen } from '../../config/config.js';

export function StudentRow(props) {
  const plenInfo = props.plenOptions;
  const studentInfo = props.studentData.map((student) => (
    <tr>
      <td>{student.name}</td>
      <td>{student.grade}</td>
      <td>{student.p1 && plenInfo[student.p1].name}</td>
      <td>{student.p2 && plenInfo[student.p2].name}</td>
      <td>{student.note}</td>
    </tr>
  ));

  return <tbody>{studentInfo}</tbody>;
}
