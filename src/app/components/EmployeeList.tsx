import React, { useState } from 'react';

const EmployeeList = () => {
  const [editingId, setEditingId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditedEmployee(employee);
  };

  const handleSave = () => {
    onUpdateEmployee(editedEmployee);
    setEditingId(null);
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({
      ...prev,
      [id]: { ...prev[id], [name]: value }
    }));
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Employee List</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedEmployee.name}
                      onChange={(e) => handleChange(e, employee.id)}
                    />
                  ) : (
                    employee.name
                  )}
                </td>
                {/* Add similar cells for position, department, email, phone */}
                <td>
                  {editingId === employee.id ? (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={handleSave}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-primary me-1" onClick={() => handleEdit(employee)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDeleteEmployee(employee.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;