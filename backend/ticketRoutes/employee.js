import express from 'express';
const router = express.Router();
import db from '../config.js';




// GET all employees
router.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employee';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


// GET a specific employee by ID
router.get('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'SELECT * FROM employee WHERE employeeId = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Employee not found');
      return;
    }
    res.json(results[0]);
  });
});



router.get('/employees/department/:departmentName', async (req, res) => {
  const { departmentName } = req.params;
  try {
    // Query to fetch employees based on department name
    const [rows] = await db.query(`
      SELECT e.employeeId, e.employeeName
      FROM employee e
      INNER JOIN employeedesignation ed ON e.employeeId = ed.employeeId
      INNER JOIN department d ON ed.departmentId = d.departmentId
      WHERE d.departmentName = ? && ed.designationId = 4 -- Use parameterized query to prevent SQL injection
    `, [departmentName]);

    const response = rows.map(row => ({
      id: row.employeeId,
      name: row.employeeName,
    }));


    // Send the fetched data as JSON response
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    res.status(500).send('Internal Server Error');
  }
});













export default router;
