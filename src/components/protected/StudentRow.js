import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { ref, firebaseAuth } from '../../config/constants';
import EditStudent from './EditStudent';

export function StudentRow(props) {

      var showEdit = true;

      // this.state = {
      //   showEdit: true,
      // }

      function deleteStudent(key){
        ref.child(`users/${firebaseAuth().currentUser.uid}/students/${key}`).remove();

      };
      let key
      const action = props.studentKey
      console.log(props.studentData.length)
      const studentInfo = props.studentData.map((student) =>
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
          {console.log(key)}
          <td>
            {// <FontAwesome
            //   name='edit'
            //   style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', padding: '0px 25px 0px 0px' }}
            // />
          }
            <a onClick={() => {
              key = props.studentData.indexOf(student)
              deleteStudent(action[key]);
              location.reload()
            }}>
              <Button color="danger">
                <FontAwesome name='trash' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' , color: '#FFF'}}/>
              </Button>
            </a>
          </td>
        </tr>
       );

    return (
      <tbody>
          {studentInfo}
     </tbody>
    );
}
