import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import employeeReducer from "../features/employeeSlice.js";
import designationReducer from "../features/designationSlice.js";
import departmentReducer from "../features/departmentSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        employee: employeeReducer,
        designation: designationReducer,
        department: departmentReducer
    },
});

export default store;
