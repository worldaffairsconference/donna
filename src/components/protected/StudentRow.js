import React, { Component } from 'react'
import { Table } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

export function StudentRow(props) {
      const content = props.studentData.map((student) =>
      <tr>
        <td>{student.name}</td>
        <td>{student.grade}</td>
        {student.panel1
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        {student.panel2
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        {student.panel3
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        {student.panel4
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        {student.panel5
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        {student.panel6
          ? <td>
            <FontAwesome
              name='check'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#008000', padding: '0px 20px 0px 20px' }}
            />
            </td>
          : <td>{' '}
            </td>
        }
        <td>{student.accessability}</td>
        <td>
          <FontAwesome
            name='edit'
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', padding: '0px 25px 0px 0px' }}
          />
          <FontAwesome
            name='trash'
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' , color: '#FF0000'}}
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
