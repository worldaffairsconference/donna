import React from 'react';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { RegOpen } from '../../config/config.js';

export function StudentRow(props) {
  const plenInfo = props.plenOptions;
  const studentInfo = props.studentData.map((student) => {
    let p1status,
      p2status,
      p3status = false;

    if (student.p1) {
      p1status = true;
    }
    if (student.p2) {
      p2status = true;
    }
    if (student.p3) {
      p3status = true;
    }

    if (
      student.p1 == 'SPRINT' ||
      student.p1 == 'SECURITY' ||
      student.p1 == 'EXECUTIVE' ||
      student.p1 == 'VOLUNTEER' ||
      student.p1 == 'OTHER'
    ) {
      p1status = false;
      p2status = false;
      p3status = false;
    }

    return (
      <tr>
        <td>{student.name}</td>
        <td>{student.grade}</td>
        <td>{p1status && plenInfo[student.p1].name}</td>
        <td>{p2status && plenInfo[student.p2].name}</td>
        <td>{p3status && plenInfo[student.p3].name}</td>
        <td>{student.note}</td>
      </tr>
    );
  });

  return <tbody>{studentInfo}</tbody>;
}
