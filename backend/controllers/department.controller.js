import { connection } from '../db/index.js'
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import nameValidate from "../validators/name.validate.js";
import dateValidate from "../validators/date.validate.js";

// Get all departments
export const getAllDepartments = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM department'

    connection.query(query, (err, data) => {
        if (err) {
            const error = new ApiError(400, 'Error retrieving departments')
            return res.status(400).json(error.toJSON())
        }
        res
            .status(200)
            .json(new ApiResponse(200, data, 'Departments retrieved successfully.'))
    })
})

// Get working / live / open departments - where departmentEndDate is NULL
export const getAllWorkingDepartments = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM department WHERE departmentEndDate IS NULL'
    connection.query(query, (err, data) => {
        if (err) {
            const error = new ApiError(400, 'Error retrieving live/open departments.')
            return res.status(400).json(error.toJSON())
        }

        res
            .status(200)
            .json(new ApiResponse(200, data, 'All live/open departments retrieved successfully.'))
    })
})

// Get closed departments where departmentEndDate is NOT NULL
export const getClosedDepartments = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM department WHERE departmentEndDate IS NOT NULL'

    connection.query(query, (err, data) => {
        if (err) {
            const error = new ApiError(400, 'Error retrieving closed departments.')
            return res.status(400).json(error.toJSON())
        }
        res
            .status(200)
            .json(new ApiResponse(200, data, 'All closed departments retrieved successfully.'))
    })
})

// Create a new department
export const addDepartment = asyncHandler(async (req, res) => {
    // Extract values from request body
    const { departmentName, departmentStartDate, departmentEndDate } = req.body;

    // console.log("line 58 done");

    // Validate the department name
    const nameValidationError = nameValidate(departmentName);
    if (nameValidationError) {
        return res.status(400).json(new ApiError(400, nameValidationError, [nameValidationError]));
    }

    // console.log("line 64 done");

    // Validate the start date
    const startDateValidationError = dateValidate(departmentStartDate);
    if (startDateValidationError) {
        return res.status(400).json(new ApiError(400, startDateValidationError, [startDateValidationError]));
    }

    // console.log("line 72 done");

    // Ensure the start date is before the end date
    const startDate = new Date(departmentStartDate);
    const endDate = new Date(departmentEndDate);

    if (startDate >= endDate) {
        return res.status(400).json(new ApiError(400, 'Start date should be before the end date.', ['Start date should be before the end date.']));
    }

    // Proceed with the query if both department name and dates are valid
    const query = `INSERT INTO department (
        departmentName, departmentStartDate, departmentEndDate
    ) VALUES (?, ?, ?)`;

    const values = [
        departmentName,
        departmentStartDate,
        departmentEndDate,
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(new ApiError(500, 'Error creating department', [err.message]));
        }

        res
            .status(201)
            .json(new ApiResponse(201, { departmentId: result.insertId, ...req.body }, 'Department created successfully.'));
    });
});


// Delete a department - just putting today's date (date as closing) in end date field - no removal of data is taken place
export const deleteDepartment = asyncHandler(async (req, res) => {
    const deptId = req.body.deptId;  // Extract deptId from the body

    const query = `UPDATE department SET departmentEndDate = ? WHERE departmentId = ?`;

    const d = new Date();
    const formattedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0];

    const values = [
        formattedDate,
        deptId,
    ];

    connection.query(query, values, (err, data) => {
        if (err) {
            console.log('Database error:', err);  // Log the error to debug
            return res.status(500).json(new ApiError(500, 'Error deleting department'));
        }
        if (data.affectedRows === 0) {
            return res.status(404).json(new ApiError(404, 'Department not found'));
        }
        res.status(200).json(new ApiResponse(200, req.body, 'Department deleted successfully.'));
    });
});

// Update department
export const updateDepartment = asyncHandler(async (req, res) => {
    const deptId = req.body.deptId;  // Extract deptId from the body
    const departmentName = req.body.departmentName;
    const departmentStartDate = req.body.departmentStartDate;
    const departmentEndDate = req.body.departmentEndDate;

    if (!deptId || !departmentName) {
        return res.status(400).json(new ApiError(400, 'Department ID and name are required'));
    }

    // Step 1: Fetch current department details from the database
    const getCurrentDepartmentQuery = `SELECT departmentStartDate, departmentEndDate FROM department WHERE departmentId = ?`;
    connection.query(getCurrentDepartmentQuery, [deptId], (err, results) => {
        if (err) {
            console.log('Database error:', err);  // Log the error to debug
            return res.status(500).json(new ApiError(500, 'Error fetching department data'));
        }
        if (results.length === 0) {
            return res.status(404).json(new ApiError(404, 'Department not found'));
        }

        // Step 2: Get current start and end dates from the database
        const currentDepartment = results[0];
        const currentStartDate = currentDepartment.departmentStartDate;
        const currentEndDate = currentDepartment.departmentEndDate;

        // Step 3: Prepare values to be updated
        const updatedDepartmentStartDate = departmentStartDate || currentStartDate;  // Use existing date if not provided
        const updatedDepartmentEndDate = departmentEndDate || currentEndDate;        // Use existing date if not provided

        // Step 4: Update the department with new or existing values
        const updateQuery = `UPDATE department SET 
            departmentName = ?, 
            departmentStartDate = ?, 
            departmentEndDate = ? 
            WHERE departmentId = ?`;

        const values = [
            departmentName,
            updatedDepartmentStartDate,
            updatedDepartmentEndDate,
            deptId
        ];

        connection.query(updateQuery, values, (err, data) => {
            if (err) {
                console.log('Database error:', err);  // Log the error to debug
                return res.status(500).json(new ApiError(500, 'Error updating department'));
            }
            if (data.affectedRows === 0) {
                return res.status(404).json(new ApiError(404, 'Department not found'));
            }
            res.status(200).json(new ApiResponse(200, req.body, 'Department updated successfully.'));
        });
    });
});
