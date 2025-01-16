import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Textfield from '../../components/Textfield';
import TableComponent from '../../components/TableCo';
import CustomTimePicker from '../../components/CustomTimePicker';
import { fetchAllSessions, saveSession, deleteSession } from './trainerapi'; // Centralized API functions
import { FiArrowLeftCircle, FiEdit2, FiTrash, FiPenTool } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CustomDatePicker from '../../components/CustomDatePicker';
import '../Overall/TrainingDetails.css';
import dayjs from 'dayjs';

const TrainerTrainingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState([]);
  const { 
    trainingId, 
    trainingTitle,  
    startTrainingDate, 
    endTrainingDate,
    skillNames,
    active
  } = location.state || {};

  const [newSession, setNewSession] = useState({
    sessionName: '',
    date: '',
    startTime: null,
    endTime: null,
    sessionDescription: '',
    trainingId: trainingId,
});

const [refreshTrigger, setRefreshTrigger] = useState(false);
const [editingSession, setEditingSession] = useState(null); // To track session being edited

  // Fetch session data on component mount or refresh
  useEffect(() => {
    console.log("hgjh",active)
    if (!trainingId) {
      console.error('No trainingId found in location.state.');
      navigate(-1); // Navigate back if trainingId is missing
      return;
    }

    const loadSessions = async () => {
        const data = await fetchAllSessions(trainingId);
        setSessionData(data);
    };

    loadSessions();
  }, [trainingId, refreshTrigger, navigate]);

  const handleAttendanceClick = (session) => {
    toast.success("Session added successfully!");
    console.log("Navigating to attendance...");
    navigate('/TrainerViewAttendance', { state: { trainingId, sessionId: session.sessionId, session } });
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewSession((prevSession) => ({ ...prevSession, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    const startDate = dayjs(startTrainingDate).format("YYYY-MM-DD");
    const endDate = dayjs(endTrainingDate).format("YYYY-MM-DD");
    const selectedDate = dayjs(date).format("YYYY-MM-DD");
    const today = dayjs(new Date()).format("YYYY-MM-DD");

    console.log("Start date:", startDate);
    console.log("End date:", endDate);
    console.log("Selected date:", selectedDate);
    console.log("Today date:", today);
    
    if (selectedDate >= startDate && selectedDate <= endDate && selectedDate >= today) {
        setNewSession(prevState => ({
            ...prevState,
            [name]: dayjs(date), 
        }));
    } else {
        toast.error("Select date between range");
        setNewSession((prevSession) => ({ ...prevSession, [name]: null })); // Reset if invalid
    }
  };

  const handleTimeChange = (name, time) => {
      setNewSession((prevSession) => ({ ...prevSession, [name]: time }));
  };

  const handleEmployees = () => {
    const today = new Date();
    const trainingEndDate = new Date(endTrainingDate);
    const isActive = today > trainingEndDate ? 1 : 0;
  
    navigate('/EmployeeTrainingEnrolled', { state: { trainingId, active: isActive } });
  };
  
  const handleSave = async () => {
    const formatTime = (time) => {
      if (!time) return null;
      const dateObj = new Date(time);
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };
  
    const formattedSession = {
      ...newSession,
      sessionStartTime: formatTime(newSession.startTime),
      sessionEndTime: formatTime(newSession.endTime),
      sessionDate: dayjs(newSession.date).format("YYYY-MM-DD"),
    };
  
    try {
      const response = await saveSession(formattedSession, editingSession?.sessionId);
  
      if (editingSession) {
        const updatedSessions = sessionData.map(session =>
          session.sessionId === editingSession.sessionId ? response : session
        );
        setSessionData(updatedSessions);
        toast.success("Session updated successfully!");
      } else {
        setSessionData((prevSessions) => [
          {
            sessionId: response.sessionId,
            sessionName: newSession.sessionName,
            sessionDate: formattedSession.sessionDate,
            sessionStartTime: formattedSession.sessionStartTime,
            sessionEndTime: formattedSession.sessionEndTime,
            sessionDescription: newSession.sessionDescription,
            trainingId: trainingId,
          },
          ...prevSessions,
        ]);
        toast.success("Session added successfully!");
      }
  
      // Reset form and states
      setNewSession({
        sessionName: '',
        date: '',
        startTime: null,
        endTime: null,
        sessionDescription: '',
        trainingId: trainingId,
      });
      setEditingSession(null);
      setRefreshTrigger((prev) => !prev);
  
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error("Failed to save the session. Please try again.");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (confirmed) {
        await deleteSession(sessionId);
        setRefreshTrigger((prev) => !prev);
      }
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setNewSession({
      sessionName: session.sessionName,
      date: dayjs(session.sessionDate),
      startTime: dayjs(session.sessionStartTime, "HH:mm:ss"),
      endTime: dayjs(session.sessionEndTime, "HH:mm:ss"),
      sessionDescription: session.sessionDescription,
      trainingId: session.trainingId,
    });
  };

  const sessionColumns = [
    { id: 'sessionName', label: 'Session Name' },
    { id: 'sessionDate', label: 'Date', render: (row) => dayjs(row.sessionDate).format("YYYY-MM-DD") },
    { id: 'sessionStartTime', label: 'Start Time' },
    { id: 'sessionEndTime', label: 'End Time' },
    { id: 'sessionDescription', label: 'Session Description' },
    {
      id: 'attendance',
      label: 'Actions',
      render: (row) => {
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        const sessionDate = dayjs(row.sessionDate).format("YYYY-MM-DD");
        const isTrainingEditable = dayjs(new Date()).format("YYYY-MM-DD") <= dayjs(endTrainingDate).format("YYYY-MM-DD");
        const isSessionFutureOrToday = sessionDate >= today; 
        
        return (
          <>
            {/* Edit icon: Visible only if the session is future or today */}
            {isTrainingEditable && isSessionFutureOrToday ? (
              <FiPenTool
                onClick={() => handleEditSession(row)}
                className="action-icon"
                size={18}
                style={{ color: '#0061A1', fontWeight: '900' }}
              />
            ) : null}
            
            {/* Attendance icon: Visible for all sessions */}
            <FiEdit2
              onClick={() => handleAttendanceClick(row)}
              className="action-icon"
              size={18}
              style={{ color: '#0061A1', fontWeight: '900' }}
            />
  
            {/* Delete icon: Visible only if the session is future or today */}
            {isTrainingEditable && isSessionFutureOrToday ? (
              <FiTrash 
                onClick={() => handleDeleteSession(row.sessionId)} 
                className="action-icon" 
                size={18} 
                style={{ color: '#0061A1', fontWeight: '900' }} 
              />
            ) : null}
          </>
        );
      },
    },
  ];
  

return (
  <div className="training-details-page">
    <div className="training-details-main-content">
      <header className="training-details-dash-header">
        <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(`/TrainerSwitch`)} title="Go back"/>
        <h4 className='employeeSwitch-title'>Training Details</h4>
      </header>
      
      <section className="training-details-section">
        <h3>Training Details
          <button className="training-details-employee-button" onClick={handleEmployees}>Employees</button>
        </h3>
        <div className="training-details-form">
          <Textfield label="Training Name" value={trainingTitle || ''} readOnly />
          <Textfield label="Skills" value={skillNames || ''} readOnly />
          <Textfield label="Start Date" value={dayjs(startTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
          <Textfield label="End Date" value={dayjs(endTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
        </div>
      </section>
      {active === 0 && (
      <section className="training-details-add-session-details-section">
      
        <div className="training-details-add-session-header">
          <h3>{editingSession ? 'Update session' : 'Add session details'}</h3>
          <button className="training-details-save-button" onClick={handleSave}>Save</button>
        </div>
        
        <div className="training-details-session-form">
          <Textfield
              label="Session Name"
              value={newSession.sessionName}
              onChange={handleInputChange}
              name="sessionName"
              isRequired={true}
          />
          <CustomDatePicker
              label="Date"
              value={newSession.date || null}
              onChange={(date) => handleDateChange('date', date)}
          />
          <CustomTimePicker
              label="Start Time"
              value={newSession.startTime}
              onChange={(time) => handleTimeChange('startTime', time)}
          />
          <CustomTimePicker
              label="End Time"
              value={newSession.endTime}
              onChange={(time) => handleTimeChange('endTime', time)}
          />
          <Textfield
              label="Session Description"
              value={newSession.sessionDescription}
              onChange={handleInputChange}
              name="sessionDescription"
              isRequired={true}
          />
          
        </div>
      
      </section>
      )}
      
      <section className="training-details-session-details-section">
        <h3>Session Details</h3>
        <TableComponent
          rows={sessionData}
          columns={sessionColumns}
        />
      </section>
    </div>
  </div>
);
};

export default TrainerTrainingDetails;
