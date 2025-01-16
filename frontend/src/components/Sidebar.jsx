import './Sidebar.css';
import { FiMenu, FiClipboard, FiBriefcase, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton.jsx";
import { BsTicket } from "react-icons/bs";
import { PiOfficeChair } from "react-icons/pi";
import {MdBook, MdOutlineModelTraining} from "react-icons/md";
import { useState } from 'react';
import {useSelector} from "react-redux";
import {FaChalkboardTeacher, FaUserAlt} from "react-icons/fa";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {IoIosGrid} from "react-icons/io";
import {GiSkills} from "react-icons/gi";

// Utility to map icon strings to actual icon components
const iconMap = {
    FiClipboard: <FiClipboard size={22} color="white" />,
    FiBriefcase: <FiBriefcase size={22} color="white" />,
    FiUser: <FiUser size={22} color="white" />,
    BsTicket: <BsTicket size={22} color="white" />,
    PiOfficeChair: <PiOfficeChair size={22} color="white" />,
    MdOutlineModelTraining: <MdOutlineModelTraining size={22} color="white" />,
    MdBook: <MdBook size={22} color="white" />,
    FaUserAlt: <FaUserAlt size={22} color="white" />,
    FaChalkboardTeacher: <FaChalkboardTeacher size={22} color="white" />,
    GiSkills: <GiSkills size={22} color="white" />,
    AiOutlineCheckCircle: <AiOutlineCheckCircle size={22} color="white" />,
    IoIosGrid: <IoIosGrid size={22} color="white"/>,
};

const Sidebar = () => {
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState(null);

    const access = useSelector((state) =>  state?.auth?.user?.employeeAccess).split(',')

    const HRManagementAccess = access[0];
    const ProjectManagementAccess = access[1];
    const TrainingManagementAccess = access[2];
    const TicketManagementAccess = access[3];

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    const closeSubmenus = () => {
        setOpenSection(null);
    };


    const navItems = [
        {
            name: "HR Management",
            access: HRManagementAccess[0],
            icon: "FiClipboard",
            children: [
                { name: "Employees", slug: "/employees", icon: "FiUser", access: HRManagementAccess[2] },
                { name: "Departments", slug: "/departments", icon: "FiBriefcase", access: HRManagementAccess[6] },
                { name: "Designations", slug: "/designations", icon: "PiOfficeChair", access: HRManagementAccess[10], },
            ],
        },
        {
            name: "Ticket Tracking",
            icon: "BsTicket",
            access: TicketManagementAccess[0],
            children: [
                { name: "Create Ticket", slug: "/create-ticket", icon: "BsTicket", access: TicketManagementAccess[2] },
                { name: "View Tickets", slug: "/view-tickets", icon: "BsTicket", access: TicketManagementAccess[6] },
            ],
        },
        {
            name: "Training",
            icon: "MdOutlineModelTraining",
            access: TrainingManagementAccess[0],
            children: [
                { name: "Employee Status", slug: "/EmployeeSwitch", icon: "FaUserAlt", access: "1" },
                { name: "Skills", slug: "/Update_skills", icon: "GiSkills", access: TrainingManagementAccess[2] },
                { name: "Skill Matrix", slug: "/SearchBar", icon: "IoIosGrid", access: TrainingManagementAccess[6] || TrainingManagementAccess[10] },
                { name: "Assign Training", slug: "/SendAndGiveTraining", icon: "FaChalkboardTeacher", access: TrainingManagementAccess[14] },
                { name: "Training Plan", slug: "/trainings", icon: "MdBook", access: TrainingManagementAccess[18] },
                { name: "Trainer Status", slug: "/TrainerSwitch", icon: "AiOutlineCheckCircle", access: "1" },
            ],
        },
    ];

    return (
        <div className="sidebar" onMouseLeave={closeSubmenus}>
            <div>
                <FiMenu className="menu-icon" size={22} color="white" />
                <div className="menu">
                    {navItems.map((item) => (
                        (item.access === '1' && <div key={item.name}>
                            <div
                                className="icon-container main-item"
                                onClick={() => item.children && toggleSection(item.name)}
                            >
                                <div className="main-item-content">
                                    {iconMap[item.icon]}
                                    <span className="menu-text">{item.name}</span>
                                </div>
                                {item.children && (
                                    <span className="chevron">
                                        {openSection === item.name ? (
                                            <FiChevronUp size={18} color="white" />
                                        ) : (
                                            <FiChevronDown size={18} color="white" />
                                        )}
                                    </span>
                                )}
                            </div>
                            {item.children && (
                                <div
                                    className={`submenu ${
                                        openSection === item.name ? "expanded" : ""
                                    }`}
                                >
                                    {item.children.map((child) => (
                                        (child.access === '1' && <Link
                                            key={child.name}
                                            to={child.slug}
                                            className="icon-container"
                                        >
                                            {iconMap[child.icon]}
                                            <span className="menu-text">{child.name}</span>
                                        </Link>)
                                    ))}
                                </div>
                            )}
                        </div>)
                    ))}
                </div>
            </div>
            <div>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Sidebar;