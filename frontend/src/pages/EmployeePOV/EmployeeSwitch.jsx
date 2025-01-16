import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../../components/TableCo'; 
import Grade from '../Manager/Grade'; // Import Grade Component
import { fetchEmployeeTrainings, fetchEmployeeSkillMatrix } from './employeeapi'; // Import the API function
import './EmployeeSwitch.css';
import GeneralSearchBar from '../../components/GenralSearchBar';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const EmployeeSwitch = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [skillMatrix, setSkillMatrix] = useState({ rows: [], skillNames: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const employeeId = useSelector((state) => state.auth.user?.employeeId);

  useEffect(() => {
    console.log("hihihihihih")
    fetchTrainings();
    fetchSkillMatrix();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await fetchEmployeeTrainings(employeeId);
      setTrainings(data);
      setFilteredTrainings(data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      toast.error("Failed to fetch trainings.");
    }
  };

  const fetchSkillMatrix = async () => {
    try {
      
      const response = await fetchEmployeeSkillMatrix(employeeId);
      const skillNames = [...new Set(response.data.map((item) => item.skillName))];

      // Grouping by department for grid-like grade structure
      const groupedData = response.data.reduce((acc, { departmentName, skillName, grade, skillId }) => {
        let department = acc.find((d) => d.departmentName === departmentName);
        if (!department) {
          department = { departmentName, skills: {} };
          acc.push(department);
        }
        department.skills[skillName] = { grade, skillId };
        return acc;
      }, []);

      setSkillMatrix({ rows: groupedData, skillNames });
    } catch (error) {
      toast.error('Error fetching skill matrix');
    }
  };

  
  const handleViewDetails = (training) => {
    if (!training || !training.trainingId) {
      console.error('Training details are missing!');
      return;
    }
    navigate('/EmployeeTrainingDetails', { 
      state: { 
        employeeId : employeeId,
        trainingId: training.trainingId,
        trainingTitle: training.trainingTitle,
        trainerName: training.trainerName,
        startTrainingDate: training.startTrainingDate,
        endTrainingDate: training.endTrainingDate,
      } 
    });
  };

  const getTrainingStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (today >= start && today <= end) {
      return <span className="status-bubble ongoing">Ongoing</span>;
    } else if (today > end) {
      return <span className="status-bubble completed">Completed</span>;
    } else {
      return <span className="status-bubble upcoming">Upcoming</span>;
    }
  };

  const skillMatrixColumns = [
    { id: 'departmentName', label: 'Department Name', align: 'center' },
    ...(skillMatrix.skillNames.length > 0
      ? skillMatrix.skillNames.map((skill) => ({
          id: skill,
          label: skill,
          align: 'center',
          render: (row) =>
            row.skills[skill] ? (
              <Grade
                pemp_id={employeeId}
                pskill_id={row.skills[skill].skillId}
                pgrade={row.skills[skill].grade}
                isChangable={false} // View-only
              />
            ) : (
              'N/A'
            ),
        }))
      : []),
  ];
  
  const handleSearch = (selectedValue) => {
    setSearchTerm(selectedValue);
    if (!selectedValue) {
      setFilteredTrainings(trainings);
    } else {
      setFilteredTrainings(
        trainings.filter((training) => training.id === selectedValue.id)
      );
    }
  };

  return (
    <div>
      <div className="employeeSwitch-training-content">
        <header className="employeeSwitch-dash-header">
          <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back"/>
          <h4 className='employeeSwitch-title'>Back to main page</h4>
        </header>

        {/* Skill Matrix Table */}
        <div className="employeeSwitch-table-container">
          <h3>Skill Matrix</h3>
          <TableComponent
            rows={skillMatrix.rows} // Use grouped data
            columns={skillMatrixColumns} // Include grade grid for skills
          />
        </div>

        {/* Other Components */}
        <div className="employeeSwitch-search-bar-container">
          <GeneralSearchBar
            options={trainings}
            label='Search Training'
            displayKey='trainingTitle'
            includeSelectAll={false}
            selectedValues={searchTerm}
            setSelectedValues={handleSearch}
            isMultiSelect={false}
          />
        </div>

        <div className="employeeSwitch-table-container">
          <TableComponent
            rows={filteredTrainings}
            columns={[
              { id: 'trainingTitle', label: 'Training Title', align: 'center' },
              { id: 'trainerName', label: 'Trainer Name', align: 'center' },
              {
                id: 'skillNames',
                label: 'Skills',
                align: 'center',
                render: (row) => row.skillNames || 'No skills',
              },
              {
                id: 'startTrainingDate',
                label: 'Start Date',
                align: 'center',
                render: (row) =>
                  new Date(row.startTrainingDate).toLocaleDateString(),
              },
              {
                id: 'endTrainingDate',
                label: 'End Date',
                align: 'center',
                render: (row) =>
                  new Date(row.endTrainingDate).toLocaleDateString(),
              },
              { id: 'trainingStatus', label: 'Training Status', align: 'center', render: (row) => getTrainingStatus(row.startTrainingDate, row.endTrainingDate) },
                  {
                    id: 'actions',
                    label: 'View Details',
                    align: 'center',
                    render: (row) => (
                      <FiEdit onClick={() => handleViewDetails(row)} className="action-icon" size={18} style={{color: '#0061A1', fontWeight: '900'}}/>
                    ),
                  },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSwitch;
