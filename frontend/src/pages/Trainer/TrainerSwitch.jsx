import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeftCircle, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import TableCo from '../../components/TableCo';
import './TrainerSwitch.css';
import GeneralSearchBar from '../../components/GenralSearchBar';
import { fetchTrainings, fetchTrainingEmployees } from './trainerapi';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const TrainerSwitch = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeesData, setEmployeesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const employeeId = useSelector((state) => state.auth.user?.employeeId);

  useEffect(() => {
    if (employeeId) {
      loadTrainings();
    } else {
      console.error('Employee ID is missing!');
      toast.error('Failed to fetch employee data. Employee ID is not available.');
    }
  }, [employeeId]);

  const loadTrainings = async () => {
      const data = await fetchTrainings(employeeId);
      setTrainings(data);
      setFilteredTrainings(data);
  };

  const handleViewEmployees = async () => {
    
      const allEmployees = [];
      for (const training of trainings) {
        const response = await fetchTrainingEmployees(training.trainingId);
        const employeesWithDetails = response.data.map((employee) => ({
          ...employee,
          trainingId: training.trainingId,
          trainingTitle: training.trainingTitle,
          trainerName: training.trainerName,
          startTrainingDate: training.startTrainingDate,
          endTrainingDate: training.endTrainingDate,
        }));
        allEmployees.push(...employeesWithDetails);
      }
      setEmployeesData(allEmployees);
      setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const handleViewDetails = (training) => {
    const today = new Date();
    const trainingEndDate = new Date(training.endTrainingDate);
    const isActive = today > trainingEndDate ? 1 : 0;
    navigate('/TrainerTrainingDetails', {
      state: {
        trainingId: training.trainingId,
        trainingTitle: training.trainingTitle,
        startTrainingDate: training.startTrainingDate,
        endTrainingDate: training.endTrainingDate,
        skillNames: training.skillNames,
        active: isActive
      },
    });
  };

  const handleEmployeeViewDetails = (row) => {
    if (!row || !row.employeeId || !row.trainingId) {
      console.error('Required details are missing!');
      return;
    }

    navigate('/EmployeeTrainingDetails', {
      state: {
        employeeId: row.employeeId,
        trainingId: row.trainingId,
        trainingTitle: row.trainingTitle,
        trainerName: row.trainerName,
        startTrainingDate: row.startTrainingDate,
        endTrainingDate: row.endTrainingDate,
      },
    });
  };

  const columns = [
    { id: 'trainingTitle', label: 'Training Title', align: 'center' },
    { id: 'skillNames', label: 'Skills', align: 'center' },
    { id: 'startTrainingDate', label: 'Start Date', align: 'center', render: (row) => new Date(row.startTrainingDate).toLocaleDateString() },
    { id: 'endTrainingDate', label: 'End Date', align: 'center', render: (row) => new Date(row.endTrainingDate).toLocaleDateString() },
    { id: 'trainingStatus', label: 'Training Status', align: 'center', render: (row) => getTrainingStatus(row.startTrainingDate, row.endTrainingDate) },
    {
      id: 'actions',
      label: 'View Employees',
      align: 'center',
      render: (row) => (
        <FiEdit
          onClick={() => handleViewDetails(row)}
          className="action-icon"
          size={18}
          style={{ color: '#0061A1', fontWeight: '900' }}
        />
      ),
    },
  ];

  const employeeColumns = [
    { id: 'employeeName', label: 'Employee Name', align: 'center' },
    { id: 'departmentName', label: 'Department', align: 'center' },
    { id: 'trainingTitle', label: 'Training Title', align: 'center' },
    { id: 'startTrainingDate', label: 'Start Date', align: 'center', render: (row) => new Date(row.startTrainingDate).toLocaleDateString() },
    { id: 'endTrainingDate', label: 'End Date', align: 'center', render: (row) => new Date(row.endTrainingDate).toLocaleDateString() },
    {
      id: 'actions',
      label: 'View Details',
      align: 'center',
      render: (row) => (
        <FiEdit
          onClick={() => handleEmployeeViewDetails(row)}
          className="action-icon"
          size={18}
          style={{ color: '#0061A1', fontWeight: '900' }}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="trainerSwitch-training-content">
        <header className="trainerSwitch-dash-header">
          <FiArrowLeftCircle
            className="employeeSwitch-back-button"
            onClick={() => navigate(`/Overall-Switch`)}
            title="Go back"
          />
          <h4 className="employeeSwitch-title">Back to main page</h4>
        </header>

        <div className="trainerSwitch-tickets">
          <div className="ticket">
            <h3>Total Trainings</h3>
            <p>{trainings.length}</p>
          </div>
          <div className="ticket" onClick={handleViewEmployees}>
            <h3>Total Employees</h3>
            <p>{totalEmployees}</p>
          </div>
        </div>
        <div className="trainerSwitch-search-bar-container">
          <GeneralSearchBar
            options={trainings}
            label="Search Training"
            displayKey="trainingTitle"
            isMultiSelect={false}
            selectedValues={searchTerm}
            setSelectedValues={handleSearch}
            includeSelectAll={false}
          />
        </div>
        <div className="trainerSwitch-table-container">
          <TableCo
            rows={filteredTrainings}
            columns={columns}
            items={trainings}
            itemKey="trainingId"
            searchLabel="Search Training"
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>Employees Enrolled</h2>
        <TableCo
          rows={employeesData}
          columns={employeeColumns}
          items={employeesData}
          itemKey="employeeId"
        />
        <button onClick={closeModal} className="close-button">Close</button>
      </Modal>
    </div>
  );
};

export default TrainerSwitch;
