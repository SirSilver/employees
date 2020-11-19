import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const employeesAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.id > a.id
})

const initialState = employeesAdapter.getInitialState({
    status: 'idle',
    error: null,
})

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const response = await axios.get('api/employees')
    return response.data
})

export const createEmployees = createAsyncThunk('employees/createEmployees', async employees => {
    const response = await axios.post('api/add_employees', employees)
    console.log(response)
    return response.data
})

export const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
    },
    extraReducers: {
        [fetchEmployees.pending]: state => {
            state.status = 'loading'
        },
        [fetchEmployees.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            employeesAdapter.upsertMany(state, action.payload)
        },
        [fetchEmployees.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [createEmployees.fulfilled]: employeesAdapter.upsertMany
    }
})

export const { selectAll: selectAllEmployees } = employeesAdapter.getSelectors(state => state.employees)

export default employeesSlice.reducer
