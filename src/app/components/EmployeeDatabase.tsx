const EmployeeDatabase = ({ employeeData }: { employeeData: any[] }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Employee Database</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-1">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDatabase;
