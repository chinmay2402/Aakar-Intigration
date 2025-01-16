import React, { useState } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const AccessDisplay = ({ accessString }) => {
    const subOptions = {
        HRManagement: ['Employee Management', 'Department Management', 'Designation Management'],
        ProjectManagement: ['Project Management', 'Substage Management'],
        TrainingManagement: ['Employee Training', 'Course Management'],
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

    const parseAccessString = (accessString) => {
        const groups = accessString.split(',');
        const result = {};

        Object.keys(subOptions).forEach((module, index) => {
            const group = groups[index];
            const active = group[0] === '1'; // First bit indicates module active state

            if (!active) {
                // If the module is inactive, skip it entirely
                return;
            }

            const subOptionStates = group.slice(1).match(/.{1,4}/g); // Group bits by 4 (Add, Read, Update, Delete)
            const parsedSubOptions = subOptionStates?.map((state, i) => ({
                name: subOptions[module][i],
                Add: state[0] === '1',
                Read: state[1] === '1',
                Update: state[2] === '1',
                Delete: state[3] === '1',
            }));

            // Filter sub-options to only include active ones
            const filteredSubOptions = parsedSubOptions?.filter(
                (option) => option.Add || option.Read || option.Update || option.Delete
            );

            if (filteredSubOptions && filteredSubOptions.length > 0) {
                result[module] = { active, subOptions: filteredSubOptions };
            }
        });

        return result;
    };

    const parsedAccess = parseAccessString(accessString);

    const [collapsedModules, setCollapsedModules] = useState(
        Object.keys(parsedAccess).reduce((acc, module) => {
            acc[module] = true; // Initially all modules are expanded
            return acc;
        }, {})
    );

    const toggleCollapse = (module) => {
        setCollapsedModules((prevState) => ({
            ...prevState,
            [module]: !prevState[module],
        }));
    };

    return (
        <Box sx={{ maxWidth: 700, marginTop: '20px' }}>
            <h3 style={{fontSize: "18px", marginBottom: "10px", color: "#7D7D7D", fontWeight: "bold"}}>
                Access Details
            </h3>

            {Object.entries(parsedAccess).map(([module, {active, subOptions}]) => (
                <Box key={module} sx={{marginBottom: '20px'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <Typography
                            sx={{ fontWeight: 'semibold', flexGrow: 1, fontSize: "17px", color: active ? 'black' : 'gray' }}
                        >
                            {module.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <IconButton onClick={() => toggleCollapse(module)}>
                            {collapsedModules[module] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Box>

                    <Collapse in={collapsedModules[module]}>
                        {active && (
                            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #c4c4c4' }}>
                                <Table>
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
                                        {subOptions.map((subOption) => (
                                            <TableRow key={subOption.name}>
                                                <TableCell>{subOption.name}</TableCell>
                                                {['Add', 'Read', 'Update', 'Delete'].map((action) => (
                                                    <TableCell
                                                        key={action}
                                                        align="center"
                                                        sx={{ color: subOption[action] ? 'green' : 'gray' }}
                                                    >
                                                        {subOption[action] ? '✔' : '✘'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Collapse>
                </Box>
            ))}
        </Box>
    );
};

export default AccessDisplay;