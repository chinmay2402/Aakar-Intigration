import './DepartmentDashboard.css';
import Infocard from '../../components/Infocard/Infocard.jsx';
import TableComponent from '../../components/Table/TableComponent.jsx';
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { fetchAllWorkingDepartments } from "../../features/departmentSlice.js";
import { FiPlusCircle, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DepartmentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch working departments on component mount
    useEffect(() => {
        dispatch(fetchAllWorkingDepartments());
    }, [dispatch]);

    // Access working departments from Redux state
    const { departments } = useSelector(state => state.department);

    // Populate rows from working departments
    const rows = departments.working.map((department) => ({
        deptId: department.departmentId,
        deptName: department.departmentName,
        deptStartDate: new Date(department.departmentStartDate).toLocaleDateString(), // This excludes the time
    }));

    const columns = [
        { id: 'deptId', label: 'Department ID', align: 'left' },
        { id: 'deptName', label: 'Department Name', align: 'left' },
        { id: 'deptStartDate', label: 'Start Date', align: 'left' },
    ];

    return (
        <div className='dashboard'>
            <div className='flex justify-between items-end mb-5'>
                <div className='infocard-container h-max'>
                    <Infocard
                        icon={`<FiBriefcase />`}
                        number={rows.length}
                        text={'All Departments'}
                        className={'selected'}
                    />
                </div>
                <button
                    className="flex border-2 border-[#0061A1] rounded text-[#0061A1] font-semibold p-3 hover:cursor-pointer"
                    onClick={() => navigate('/department/addDepartment')}>
                    <FiPlusCircle style={{marginRight: '10px', width: '25px', height: '25px'}}/>
                    Add department
                </button>
            </div>
            {/* Searchbar Component */}
            {/* <Searchbar lst={rows} /> */}

            {/* Table Component */}
            <TableComponent rows={rows} columns={columns} linkBasePath={`/department`}/>
        </div>
    );
};

export default DepartmentDashboard;
