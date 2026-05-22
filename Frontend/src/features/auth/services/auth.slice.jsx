import { createSlice } from "@reduxjs/toolkit";


const authslice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        checkingAuth: true,
        error: null

    },
    reducers: {
        setuser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCheckingAuth: (state, action) => {
            state.checkingAuth = action.payload;
        }
    }
})

export const { setuser, setLoading, setError, setCheckingAuth } = authslice.actions;
export default authslice.reducer;




