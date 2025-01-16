import React from 'react';
import { useSelector } from 'react-redux';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './Layout.jsx';
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";
import AddEmployee from "./pages/employee/AddEmployee.jsx";
import EditEmployeePage from "./pages/employee/EditEmployeePage.jsx";
import DepartmentDashboard from "./pages/department/DepartmentDashboard.jsx";
import {Bounce, ToastContainer} from "react-toastify";
import AddDepartment from "./pages/department/AddDepartment.jsx";
import DepartmentProfile from "./pages/department/DepartmentProfile.jsx";
import Profile from "./pages/Profile.jsx";

import ManagerSwitch from './pages/Manager/ManagerSwitch.jsx';
import SearchBar from './pages/Manager/SearchBar.jsx';
import AllTraining from './pages/Manager/AllTraining.jsx';
import TrainingDetails from './pages/Manager/TrainingDetails.jsx';
import UpdateSkill from './pages/Manager/UpdateSkill.jsx';
import Attendance from './pages/Manager/Attendance.jsx';
import ShowTrainingDept from './pages/Manager/ShowTrainingDept.jsx';
import TrainingSwitch from './pages/Manager/TrainingSwitch.jsx';
import EmployeeSwitch from './pages/EmployeePOV/EmployeeSwitch.jsx';
import EmployeeTrainingDetails from './pages/EmployeePOV/EmployeeTrainingDetails.jsx';
import TrainerSwitch from './pages/Trainer/TrainerSwitch.jsx';
import TrainerTrainingDetails from './pages/Trainer/TrainerTrainingDetails.jsx';
import TrainerAttendance from './pages/Trainer/TrainerAttendance.jsx';
import TrainerViewAttendance from './pages/Trainer/TrainerViewAttendance.jsx';
import TrainerEditAttendance from './pages/Trainer/TrainerEditAttendance.jsx';
import EmployeeTrainingEnrolled from './pages/Trainer/EmployeeTrainingEnrolled.jsx';
import ManagerEmployeeTrainingEnrolled from './pages/Manager/ManagerEmployeeTrainingEnrolled.jsx';
import SendConformEmpToTraining from './pages/Manager/SendConformEmpToTraining.jsx'


//Ticket
import Dashboard from "./ticketComponents/Dashboard/Dashboard.jsx";
import TicketForm from "./ticketComponents/CreateTicket/CreateTicket.jsx";  
import TicketPage from "./ticketComponents/TicketPage/TicketPage.jsx";
import FilteredTicketPage from "./ticketComponents/FilteredTicketPage/FilteredTicketPage.jsx";
import AdminFunctionalities from "./ticketComponents/AdminFunctionalities/AdminFunctionalities.jsx";
import ManageIssueTypes from "./ticketComponents/ManageIssueTypes/ManageIssueTypes.jsx";
import ManageBasicSolutions from "./ticketComponents/ManageBasicSolutions/ManageBasicSolutions.jsx";
import ManageTicketTitles from "./ticketComponents/ManageTicketTitles/ManageTicketTitles.jsx";
import ManageSendMailTo from "./ticketComponents/ManageSendMailTo/ManageSendMailTo.jsx";



export const API_BASE_URL = `http://localhost:3000`;
const App = () => {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/>}/>

                    <Route element={<Layout/>}>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employees"
                            element={
                                <PrivateRoute>
                                    <EmployeeDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/departments"
                            element={
                                <PrivateRoute>
                                    <DepartmentDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/addDepartment"
                            element={
                                <PrivateRoute>
                                    <AddDepartment/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/:id"
                            element={
                                <PrivateRoute>
                                    <DepartmentProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/:id"
                            element={
                                <PrivateRoute>
                                    <EmployeeProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/addEmployee"
                            element={
                                <PrivateRoute>
                                    <AddEmployee/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/edit/:id"
                            element={
                                <PrivateRoute>
                                    <EditEmployeePage/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ManagerSwitch"
                            element={
                                <PrivateRoute>
                                    <ManagerSwitch/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/SearchBar"
                            element={
                                <PrivateRoute>
                                    <SearchBar/>
                                </PrivateRoute>
                            }
                        />

                        <Route              
                            path="/trainings"
                            element={
                                <PrivateRoute>
                                    <AllTraining/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/training-details"
                            element={
                                <PrivateRoute>
                                    <TrainingDetails/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/Update_skills"
                            element={
                                <PrivateRoute>
                                    <UpdateSkill/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/attendance/:sessionId"
                            element={
                                <PrivateRoute>
                                    <Attendance/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/Dept_G_training"
                            element={
                                <PrivateRoute>
                                    <ShowTrainingDept/>
                                </PrivateRoute>
                            }
                        />

<Route
                            path="/SendConformEmpToTraining"
                            element={
                                <PrivateRoute>
                                    <SendConformEmpToTraining/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/SendAndGiveTraining"
                            element={
                                <PrivateRoute>
                                    <TrainingSwitch/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/EmployeeSwitch"
                            element={
                                <PrivateRoute>
                                    <EmployeeSwitch/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/EmployeeTrainingDetails"
                            element={
                                <PrivateRoute>
                                    <EmployeeTrainingDetails/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/TrainerSwitch"
                            element={
                                <PrivateRoute>
                                    <TrainerSwitch/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/TrainerTrainingDetails"
                            element={
                                <PrivateRoute>
                                    <TrainerTrainingDetails/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/TrainerAttendance"
                            element={
                                <PrivateRoute>
                                    <TrainerAttendance/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/TrainerViewAttendance"
                            element={
                                <PrivateRoute>
                                    <TrainerViewAttendance/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/TrainerEditAttendance"
                            element={
                                <PrivateRoute>
                                    <TrainerEditAttendance/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/EmployeeTrainingEnrolled"
                            element={
                                <PrivateRoute>
                                    <EmployeeTrainingEnrolled/>
                                </PrivateRoute>
                            }
                        />
                         <Route
                            path="/ManagerEmployeeTrainingEnrolled"
                            element={
                                <PrivateRoute>
                                    <ManagerEmployeeTrainingEnrolled/>
                                </PrivateRoute>
                            }

                        />
                        <Route
                            path="/tickettracking"
                            element={
                                <PrivateRoute>
                                    <Dashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/createTicket"
                            element={
                                <PrivateRoute>
                                    <TicketForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ticketPage/:id"
                            element={
                                <PrivateRoute>
                                   <TicketPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/FilteredTicketPage"
                            element={
                                <PrivateRoute>
                                   <FilteredTicketPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/adminFunctionalities"
                            element={
                                <PrivateRoute>
                                   <AdminFunctionalities />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/issue-types"
                            element={
                                <PrivateRoute>
                                   <ManageIssueTypes />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/basic-solutions"
                            element={
                                <PrivateRoute>
                                   <ManageBasicSolutions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ticket-titles"
                            element={
                                <PrivateRoute>
                                   <ManageTicketTitles />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/send-mail-to"
                            element={
                                <PrivateRoute>
                                   < ManageSendMailTo/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                            />
                        
                    </Route>
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"}/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
