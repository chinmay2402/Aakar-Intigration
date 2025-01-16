import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash, FiEye, FiPlusCircle, FiXCircle, FiArrowLeftCircle, FiAward, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AddTraining from './AddTraining';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllTraining.css';
import TableComponent from '../../components/TableCo';
import GeneralSearchBar from '../../components/GenralSearchBar';
import TableCo from '../../components/TableCo';
import {fetchAllTraining, searchTraining, deleteTraining, fetchEmployeeDataAPI,} from './TrainingAPI';
import { useSelector } from 'react-redux';

const Tickit = ({ text, icon, onClick, count }) => (
  <button className="custom-button-all-training-ticket" onClick={onClick}>
    <span className="icon">{icon}</span>
    <span className="text">{text}</span>
    <span className="count">{count !== null ? count : 'Loading...'}</span>
  </button>
);

const AllTraining = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTrainingData, setEditTrainingData] = useState(null);
  const [employeeCountOne, setEmployeeCountOne] = useState(null);
  const [employeeCountTwo, setEmployeeCountTwo] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingList, setTrainingList] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const departmentId = useSelector((state) => state.auth.user?.departmentId);
  const access = useSelector((state) =>  state?.auth?.user?.employeeAccess).split(',')[2];
  const addAccess = access[17] === "1";
  const readAccess = access[18];
  const updateAccess = access[19] === "1";
  const deleteAccess = access[20] === "1";

  useEffect(() => {
    fetchTrainingData();
    fetchEmployeeData([1, 3], setEmployeeCountOne);
    fetchEmployeeData([2, 3], setEmployeeCountTwo);
  }, []);

  const fetchTrainingData = async () => {
    console.log("Fetched access: ", access);
    try {
      const data = await fetchAllTraining();
      setTrainingData(data);
      setFilteredData(data);
      setTrainingList(
        Array.from(new Set(data.map((item) => ({ id: item.trainingId, label: item.trainingTitle }))))
      );
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast.error('Failed to fetch training data!');
    }
  };  
  
  useEffect(() => {
    fetchTrainingData();
  }, []);
  
  const handleSearch = async (searchTerm) => {
    setSearch(searchTerm);
    try {
      const data = await searchTraining(searchTerm);
      setFilteredData(data);
    } catch (error) {
      console.error('Error searching training data:', error);
      toast.error('Failed to search training data!');
    }
  };

  const handleDelete = async (trainingId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this training?');
    
    if (isConfirmed) {
      try {
        await deleteTraining(trainingId);
        setTrainingData((prevData) => prevData.filter((item) => item.trainingId !== trainingId));
        setFilteredData((prevData) => prevData.filter((item) => item.trainingId !== trainingId));
        toast.success('Training deleted successfully!');
      } catch (error) {
        console.error('Error deleting training:', error);
        toast.error('Failed to delete the training!');
      }
    }
  };  

  const handleViewDetails = (training) => {
    if (!training) {
      console.error('Training details are missing!');
      return;
    }

    navigate('/training-details', { 
      state: { 
        trainingId: training.trainingId,
        trainingTitle: training.trainingTitle,
        trainerName: training.trainerName,
        startTrainingDate: training.startTrainingDate,
        endTrainingDate: training.endTrainingDate,
      } 
    });
  };

  const handleAddTrainingToggle = () => {
    setIsAdding(prevState => !prevState);
    setIsEditing(false); 
  };

  const handleEditTraining = (training) => {
    const evaluationTypeMapping = {
      'Multiple Choice Questions': 1,
      'Assignments': 2,
      'none': null,
    };
  
    console.log("training Id : ",training.trainerId);
    const skillIds = training.skillIds.split(",").map(Number);
    const selectedSkills = skillIds.map((id, index) => ({
      id: id,
      label: training.skills[index],
    }));

    console.log("selected skilss from training : ",selectedSkills)

    const formattedTraining = {
      ...training,
      trainerId: training.trainerId,
      skills: selectedSkills,
      numberOfDays: training.numberOfDays, 
      evaluationType: evaluationTypeMapping[training.evaluationType] || null,
    };

    console.log("formated data in edeting  : ", formattedTraining);
    setEditTrainingData(formattedTraining);  
    setIsAdding(true);
    setIsEditing(true); 
  };

  const handleTrainingAdded = async () => {
    setIsAdding(false);
    setIsEditing(false);
    try {
      const response = await fetchAllTraining();

      setTrainingData(response); 
      setFilteredData(response); 
      fetchTrainingData();
      modifyTable(filteredData);
      console.log("Filetered data:", filteredData);
      //toast.success("Training added successfully!");
    } catch (error) {
      console.error('Error fetching updated training data:', error);
      toast.error('Failed to refresh training data!');
    }
  };

  const handleTrainingUpdated = () => {
    setIsAdding(false);
    setIsEditing(true);
    fetchTrainingData();
  };

  const renderSkillsBubbles = (skills) => {
    if (!skills || skills.trim() === '') {
      return <span>No Skills</span>;  
    }
    const skillList = skills.split(', ');
    return (
      <div className="skills-bubbles-container">
        {skillList.map((skill, index) => (
          <span key={index} className="skill-bubble">{skill}</span>
        ))}
      </div>
    );
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

  const handleEmployeeViewDetails = (row) => {
    console.log(row)
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

  const employeeColumns = [
    { id: 'employeeName', label: 'Name' },
    { id: 'employeeDepartmentName', label: 'Department' },
    { id: 'trainingTitle', label: 'Training' },
    { id: 'skillsIncluded', label: 'Skills' },
    { id: 'trainingStartDate', label: 'Start Date'},
    { id: 'trainingEndDate', label: 'End Date' },
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

  const columns = [
    { label: 'Training Name', id: 'trainingTitle', align: 'center' },
    { label: 'Trainer Name', id: 'trainerName', align: 'center' },
    {
      label: 'Training Skills',
      id: 'skills',
      align: 'center',
      render: (row) => renderSkillsBubbles(row.skills),
    },
    {
      label: 'Start Date',
      id: 'startTrainingDate',
      align: 'center',
      render: (row) => new Date(row.startTrainingDate).toLocaleDateString(),
    },
    {
      label: 'End Date',
      id: 'endTrainingDate',
      align: 'center',
      render: (row) => new Date(row.endTrainingDate).toLocaleDateString(),
    },
    {label: "Number of days", id: 'numberOfDays', align: 'center'},
    {label: "Evaluation type", id: 'evaluationType', align: 'center'},
    {
      label: 'Training Status',
      align: 'center',
      render: (row) => getTrainingStatus(row.startTrainingDate, row.endTrainingDate),
    },
    {
      label: 'Actions',
      align: 'center',
      render: (row) => {
        const status = getTrainingStatus(row.startTrainingDate, row.endTrainingDate);
        const isCompleted = status.props.className.includes('completed');
        return (
          <div className='training-action-container'>
            <FiEye
              onClick={() => handleViewDetails(row)}
              className="action-icon"
              size={18}
              style={{ color: '#0061A1', fontWeight: '900' }}
            />
            {!isCompleted && (
              <>
                {updateAccess &&
                  <FiEdit
                  onClick={() => handleEditTraining(row)}
                  className="action-icon"
                  size={18}
                  style={{ color: '#0061A1', fontWeight: '900' }}
                />}
                {deleteAccess &&
                  <FiTrash
                  onClick={() => handleDelete(row.trainingId)}
                  className="action-icon"
                  size={18}
                  style={{ color: '#0061A1', fontWeight: '900' }}
                />}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const modifyTable = (newData) =>{
    console.log("Modified with new data:", newData);
    setFilteredData((prevData) => [...prevData, ...newData]);
  }

  const fetchEmployeeData = async (departmentSkillTypes, setCount) => {
    try {
      if (!departmentId) {
        console.error('Missing departmentId');
        return;
      }
      const employeeCountOneData = await fetchEmployeeDataAPI(departmentId, departmentSkillTypes);
      if (employeeCountOneData) setCount(employeeCountOneData.count);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const fetchEmployeeList = async (departmentSkillTypes) => {
    try {
      const employeeCountTwoData = await fetchEmployeeDataAPI(departmentId, departmentSkillTypes);
      if (employeeCountTwoData) {
        setEmployeesData(employeeCountTwoData.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  return (
    <div className="all-training-training-content">
      <header className="all-training-dash-header">
        <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back"/>
        <h4 className='employeeSwitch-title'>Employee Details</h4>
      </header>
      <div  className='tickit-container'>
        <Tickit text="Employees for My Department Training" icon={<FiAward />} onClick={() => fetchEmployeeList([1, 3])} count={employeeCountOne} />
        <Tickit text="My Department Employees for Training" icon={<FiUser />} onClick={() => fetchEmployeeList([2, 3])} count={employeeCountTwo} />
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-modal" onClick={() => setIsModalOpen(false)}>
            &times;
          </button>
          <TableCo rows={employeesData} columns={employeeColumns} />
        </div>
      </div>
      )}
      

      <div className="add-training-container">
        <div className="all-training-search-bar-container">
          <GeneralSearchBar
            options={trainingList}
            label='Search Training'
            isMultiSelect={false}
            selectedValues={search}
            setSelectedValues={handleSearch}
            includeSelectAll={false}
          />
        </div>
        
        {addAccess &&
          <button onClick={handleAddTrainingToggle} className="add-training-btn">
          {isAdding ? <FiXCircle size={18} style={{ marginRight: '8px', color: '#0061A1'}} /> : <FiPlusCircle size={18} style={{ marginRight: '8px', color: '#0061A1'}} />}
          {isAdding ? '  Cancel' : 'New Training'}
        </button>}
      </div>

      {isAdding && (
        <AddTraining 
          onTrainingAdded={isEditing ? handleTrainingUpdated : handleTrainingAdded} 
          editTrainingData={isEditing ? editTrainingData : null} 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          departmentId={departmentId}
          //modifyTable={modifyTable}
        />      
      )}

      <div className="all-training-table-container">
        <TableComponent 
          rows={filteredData} 
          columns={columns}
          linkBasePath={null}
          defaultSortOrder='newest'
          itemKey={filteredData.trainingId}
          itemLabel={filteredData.trainingTitle}
          navigateTo="/training-details"
          searchLabel="Search Training"
        />
      </div>
    </div>
  );
};

export default AllTraining;
