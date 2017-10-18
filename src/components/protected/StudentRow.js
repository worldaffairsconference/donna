import React, { Component } from 'react'
import { Table } from 'reactstrap';
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
            <FontAwesome
              name='edit'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', padding: '0px 25px 0px 0px' }}
            />
<<<<<<< HEAD
            <a onClick={() => {
              key = props.studentData.indexOf(student)
              deleteStudent(action[key]);
              location.reload()
            }}><FontAwesome
              name='trash'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' , color: '#FF0000'}}
            /></a>
          </td>
        </tr>
       );
=======
            </td>
          : <td>{' '}
            </td>
        }
        <td>{student.accessibility}</td>
      </tr>
     );
>>>>>>> 9946c3de34ab333bb3563cca43d2148f786b9f7c


    return (
      <Table>
      <tbody>
<<<<<<< HEAD
          {studentInfo}
     </tbody>
=======
        {studentInfo}
        {studentAction}
      </tbody>
      {/* {showEdit
      ? <EditStudent />
      : null} */}
      </Table>
>>>>>>> 9946c3de34ab333bb3563cca43d2148f786b9f7c
    );
}
