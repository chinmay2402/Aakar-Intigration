import express from "express";
import {
    addEmployee,
    deleteEmployee, getAllEmployees,
    loginEmployee,
    logoutEmployee,
    updateEmployee
} from "../controllers/employee.controller.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/addEmployee', addEmployee);
router.post('/loginEmployee', loginEmployee);
router.post('/logoutEmployee',authMiddleware, logoutEmployee);
router.post('/deleteEmployee', deleteEmployee);
router.post('/updateEmployee', updateEmployee);
router.get('/getAllEmployees', getAllEmployees);

export default router