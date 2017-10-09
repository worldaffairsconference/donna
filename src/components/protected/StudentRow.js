import React, { Component } from 'react'
import { Table } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export function StudentRow(props) {
      const content = props.studentData.map((student) =>
      <tr>
        <td>{student.name}</td>
        <td>{student.grade}</td>
        <td>{student.panel[0]}</td>
        <td>{student.panel[1]}</td>
        <td>{student.panel[2]}</td>
        <td>{student.panel[3]}</td>
        <td>{student.accessability}</td>
        <td>
          <FontAwesome
            name='edit'
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', padding: '0px 25px 0px 0px' }}
          />
          <FontAwesome
            name='trash'
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </td>
      </tr>
     );

    return (
      <tbody>
       {content}
     </tbody>
    );
}
