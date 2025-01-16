import React, { useState, useEffect } from 'react';
import {
    Box,
    Checkbox,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

const AccessTable = ({ access, setAccess }) => {
    const initialState = {
        HRManagement: { active: false, subOptions: [] },
        ProjectManagement: { active: false, subOptions: [] },
        TrainingManagement: { active: false, subOptions: [] },
        TicketTracking: { active: false, subOptions: [] },
    };

    const subOptions = {
        HRManagement: ['Employee Management', 'Department Management', 'Designation Management'],
        ProjectManagement: ['Project Management', 'Substage Management'],
        TrainingManagement: ['Skills', 'Grade', 'Checkbox', 'Assign training', 'Training Plan'],
        TicketTracking: [
            'View self created tickets',
            'View department created tickets',
            'View department assigned tickets',
            'View all tickets',
            'Change ticket status',
            'Change ticket assignee',
            'Get and release ticket',
            'Reopen ticket',
        ],
    };

    const [moduleState, setModuleState] = useState(initialState);

    const handleToggleModule = (module) => {
        setModuleState((prevState) => ({
            ...prevState,
            [module]: {
                ...prevState[module],
                active: !prevState[module].active,
                subOptions: prevState[module].active
                    ? [] // Reset sub-options when toggling off
                    : Array(subOptions[module].length).fill({ Add: false, Read: false, Update: false, Delete: false }),
            },
        }));
    };

    const handleCheckboxChange = (module, subOptionIndex, action) => {
        setModuleState((prevState) => {
            const updatedSubOptions = [...prevState[module].subOptions];
            updatedSubOptions[subOptionIndex] = {
                ...updatedSubOptions[subOptionIndex],
                [action]: !updatedSubOptions[subOptionIndex][action],
            };

            return {
                ...prevState,
                [module]: {
                    ...prevState[module],
                    subOptions: updatedSubOptions,
                },
            };
        });
    };

    // Generate access string and update setAccess whenever moduleState changes
    useEffect(() => {
        const generateAccessString = () => {
            const groups = Object.keys(moduleState).map((module) => {
                const { active, subOptions } = moduleState[module];
                if (!active) return '0'.repeat(52); // All bits 0 if module is inactive

                const bits = ['1']; // First bit for module active state
                subOptions.forEach((subOption) => {
                    ['Add', 'Read', 'Update', 'Delete'].forEach((action) => {
                        bits.push(subOption[action] ? '1' : '0');
                    });
                });
                return bits.join('').padEnd(52, '0'); // Pad to 52 bits
            });

            return groups.join(',');
        };

        const newAccessString = generateAccessString();
        setAccess(newAccessString); // Update the access string in parent state
    }, [moduleState, setAccess]);

    return (
        <div className="add-employee-details my-1 bg-white rounded">
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#7D7D7D', fontWeight: 'bold' }}>Manage Access</h3>
            <Box sx={{ maxWidth: 700, marginLeft: '10px', marginTop: '20px' }}>
                {Object.keys(subOptions).map((module) => (
                    <Box key={module} sx={{ marginBottom: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'semibold',
                                    flexGrow: 1,
                                    fontSize: '17px',
                                    marginBottom: '10px',
                                    color: '#000',
                                }}
                            >
                                {module.replace(/([A-Z])/g, ' $1').trim()}
                            </Typography>
                            <Switch
                                checked={moduleState[module].active}
                                onChange={() => handleToggleModule(module)}
                                color="primary"
                                inputProps={{ 'aria-label': `${module} toggle` }}
                            />
                        </Box>

                        {moduleState[module].active && (
                            <TableContainer
                                component={Paper}
                                sx={{
                                    borderRadius: 2,
                                    border: '1px solid #c4c4c4',
                                    boxShadow: 'none',
                                }}
                            >
                                <Table sx={{ minWidth: 400 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Options</TableCell>
                                            <TableCell align="center">Add</TableCell>
                                            <TableCell align="center">Read</TableCell>
                                            <TableCell align="center">Update</TableCell>
                                            <TableCell align="center">Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subOptions[module].map((subOption, index) => (
                                            <TableRow key={subOption}>
                                                <TableCell component="th" scope="row">
                                                    {subOption}
                                                </TableCell>
                                                {['Add', 'Read', 'Update', 'Delete'].map((action) => (
                                                    <TableCell key={action} align="center">
                                                        <Checkbox
                                                            checked={
                                                                moduleState[module].subOptions[index]?.[action] || false
                                                            }
                                                            onChange={() =>
                                                                handleCheckboxChange(module, index, action)
                                                            }
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default AccessTable;