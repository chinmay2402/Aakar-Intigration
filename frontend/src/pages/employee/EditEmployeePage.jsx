import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateEmployee } from '../../features/employeeSlice.js';
import { TextField, FormControl, InputLabel, MenuItem, Select, Button, Autocomplete } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditEmployeePage = () => {
    const dispatch = useDispatch();
    const { employeeId } = useParams();
    const employeeData = useSelector((state) => state.employee.employeeDetails); // Assuming employee details are in redux state
    const [employeeInputValues, setEmployeeInputValues] = useState({
        employeeName: '',
        employeePhone: '',
        employeeEmail: '',
        employeeEndDate: null,
        employeeAccess: '',
        jobProfiles: [],
    });

    useEffect(() => {
        if (employeeId && employeeData) {
            setEmployeeInputValues(employeeData);
        }
    }, [employeeData, employeeId]);

    // Handle input changes for employee details
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeInputValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle changes to job profiles
    const handleJobProfileChange = (e, index, key) => {
        const { value } = e.target;
        const updatedJobProfiles = [...employeeInputValues.jobProfiles];
        updatedJobProfiles[index][key] = value;
        setEmployeeInputValues((prevState) => ({
            ...prevState,
            jobProfiles: updatedJobProfiles,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const updates = {
            employeeName: employeeInputValues.employeeName,
            employeePhone: employeeInputValues.employeePhone,
            employeeEmail: employeeInputValues.employeeEmail,
            employeeEndDate: employeeInputValues.employeeEndDate || null,
            employeeAccess: employeeInputValues.employeeAccess,
        };

        const jobProfiles = employeeInputValues.jobProfiles.map((job) => ({
            ...job,
            operation: job.operation || 'update', // Ensure operation exists
        }));

        // Dispatch the updateEmployee action
        dispatch(
            updateEmployee({
                employeeId,
                updates,
                jobProfiles,
            })
        );

        // After submission, redirect or show success
        history.push('/employees'); // Or wherever you want to redirect
    };

    return (
        <div>
            <h1>Edit Employee</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Employee Name"
                    name="employeeName"
                    value={employeeInputValues.employeeName}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    label="Phone"
                    name="employeePhone"
                    value={employeeInputValues.employeePhone}
                    onChange={handleInputChange}
                    fullWidth
                />
                <TextField
                    label="Email"
                    name="employeeEmail"
                    value={employeeInputValues.employeeEmail}
                    onChange={handleInputChange}
                    fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End Date"
                        value={dayjs(employeeInputValues.employeeEndDate)}
                        onChange={(newValue) =>
                            setEmployeeInputValues((prevState) => ({
                                ...prevState,
                                employeeEndDate: newValue ? newValue.toISOString() : null,
                            }))
                        }
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField
                    label="Access Code"
                    name="employeeAccess"
                    value={employeeInputValues.employeeAccess}
                    onChange={handleInputChange}
                    fullWidth
                />

                {/* Job Profiles */}
                {employeeInputValues.jobProfiles.map((job, index) => (
                    <div key={index}>
                        <Autocomplete
                            options={[{ id: 1, name: 'Senior Developer' }, { id: 2, name: 'Tech Lead' }]} // Example data
                            value={job.designationName}
                            onChange={(e, value) => handleJobProfileChange(e, index, 'designationName')}
                            renderInput={(params) => <TextField {...params} label="Designation" />}
                        />
                        <TextField
                            label="Manager ID"
                            name={`managerId-${index}`}
                            value={job.managerId}
                            onChange={(e) => handleJobProfileChange(e, index, 'managerId')}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Operation</InputLabel>
                            <Select
                                value={job.operation || 'update'}
                                onChange={(e) => handleJobProfileChange(e, index, 'operation')}
                            >
                                <MenuItem value="update">Update</MenuItem>
                                <MenuItem value="add">Add</MenuItem>
                                <MenuItem value="delete">Delete</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                ))}
                <Button type="submit">Update Employee</Button>
            </form>
        </div>
    );
};

export default EditEmployeePage;
