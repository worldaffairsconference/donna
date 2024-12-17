import React from 'react';

export function StudentRow({ plenOptions, studentData }) {
  const studentInfo = studentData.map((student) => {
    // Resolve plenary names from plenOptions
    const plen1Name =
      plenOptions.p1.options.find((opt) => opt.id === student.p1?.rank1)?.name || 'N/A';
    const plen2Name =
      plenOptions.p2.options.find((opt) => opt.id === student.p2?.rank1)?.name || 'N/A';
    const plen3Name =
      plenOptions.p3.options.find((opt) => opt.id === student.p3?.rank1)?.name || 'N/A';

    return (
      <tr key={student.id}>
        <td>{student.name || 'Unknown'}</td>
        <td>{student.grade || 'N/A'}</td>
        <td>{plen1Name}</td>
        <td>{plen2Name}</td>
        <td>{plen3Name}</td>
        <td>
          <div
            style={{
              width: '200px',
              overflow: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {student.note || 'None'}
          </div>
        </td>
      </tr>
    );
  });

  return <tbody>{studentInfo}</tbody>;
}
