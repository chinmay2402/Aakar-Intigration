import React, { useState } from 'react';
import { FiArrowLeftCircle, FiEdit } from 'react-icons/fi';
import './AddDepartment.css';
import TextField from '@mui/material/TextField';
import TableComponent from "../../components/Table/TableComponent.jsx";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import dayjs from 'dayjs';

const AddDepartment = () => {
    const formatDate = (date) => {
        if (!date) return '';
        const jsDate = new Date(date);
        return moment(jsDate).format('DD-MM-YYYY');
    };

    const projectColumns = [
        { id: 'projectName', label: 'Project name', align: 'center' },
        { id: 'projectNumber', label: 'Project number', align: 'center' },
        { id: 'startDate', label: 'Start date', align: 'center' },
        { id: 'endDate', label: 'End date', align: 'center' },
    ];

    const rows = [];

    const [departmentName, setDepartmentName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [departmentStartDate, setDepartmentStartDate] = useState(null); // Initialize as null
    const [departmentEndDate, setDepartmentEndDate] = useState(null); // Initialize as null

    // Handles date change
    const handleDateChange = (newDate) => {
        // Ensure the value is either a valid dayjs object or null
        setDepartmentStartDate(newDate ? dayjs(newDate) : null);
    };

    // Handles form submission
    const handleSubmit = () => {
        console.log(departmentId);
        console.log(departmentName);
        console.log(departmentStartDate);
        console.log(departmentEndDate);
    };

    return (
        <div className="add-department-dashboard">
            <section className="add-department-head flex justify-between mb-3">
                <div className="flex items-center gap-3">
                    <FiArrowLeftCircle size={28} className="text-[#0061A1] hover:cursor-pointer"
                                       onClick={() => window.history.back()} />
                    <div className="text-[17px]">
                        <span>Dashboard / </span>
                        <span className="font-semibold">Add Departments</span>
                    </div>
                </div>
                <button
                    className="flex justify-center items-center gap-3 bg-[#0061A1] text-white py-1.5 px-2 rounded"
                    onClick={handleSubmit}
                >
                    <FiEdit size={20} className="edit-icon" />
                    <span>Save details</span>
                </button>
            </section>
            <section className="add-department-body bg-white px-10 py-7 flex flex-col gap-5 h-[525px]">
                <div className="add-department-details my-4 bg-white rounded">
                    <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#7D7D7D", fontWeight: "bold" }}>Department details</h3>
                    <div className="employee-details flex gap-10">
                        <TextField
                            label="Department Id"
                            variant="outlined"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            name={'departmentId'}
                            sx={{ width: "300px" }}
                        />

                        <TextField
                            label="Department Name"
                            variant="outlined"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            name={'departmentName'}
                            sx={{ width: "300px" }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Department Start Date"
                                value={departmentStartDate} // Ensure it's a dayjs object or null
                                onChange={handleDateChange}
                                format="YYYY/MM/DD" // Optional: format displayed in the input box
                                renderInput={(params) => <TextField {...params} />}
                                sx={{ width: "300px" }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddDepartment;
