// src/store/designationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks (async actions)
export const fetchDesignations = createAsyncThunk(
    'designation/fetchDesignations',
    async () => {
        const response = await axios.get('http://localhost:3000/api/v1/designation/getAllDesignations');
        console.log(response.data.data);
        return response.data.data;
    }
);

export const addDesignation = createAsyncThunk(
    'designation/addDesignation',
    async (designationData) => {
        const response = await axios.post('/api/designation', designationData);
        return response.data.result;
    }
);

// Initial State
const initialState = {
    designations: [],
    loading: false,
    error: null,
};

// Redux Slice
const designationSlice = createSlice({
    name: 'designation',
    initialState,
    reducers: {
        // You can add other reducers if needed
    },
    extraReducers: (builder) => {
        // Handle fetch designations
        builder.addCase(fetchDesignations.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchDesignations.fulfilled, (state, action) => {
            state.loading = false;
            state.designations = action.payload;
        });
        builder.addCase(fetchDesignations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle add designation
        builder.addCase(addDesignation.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addDesignation.fulfilled, (state, action) => {
            state.loading = false;
            state.designations.push(action.payload);
        });
        builder.addCase(addDesignation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

// Export actions and reducer
export default designationSlice.reducer;
