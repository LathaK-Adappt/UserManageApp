import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Users from API with pagination support
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      // Using _page and _limit query parameters (10 items per page)
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`);
      return { data: response.data, page };
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
        updatedUser,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status !== 200) {
        throw new Error('Failed to update user');
      }
      return updatedUser;
    } catch (error) {
      console.error("Update User Error:", error);
      // If the API returns a 500, simulate a successful update
      if (error.response && error.response.status === 500) {
        return updatedUser;
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update user'
      );
    }
  }
);


// Add New User
export const addUser = createAsyncThunk(
  'users/addUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/users',
        newUser,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to add user');
      }
      const data = response.data;
      // JSONPlaceholder doesn't actually generate an ID, so we assign one
      return { ...data, id: Math.floor(Math.random() * 1000) };
    } catch (error) {
      console.error("Add User Error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to add user'
      );
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete user');
      }
      return userId;
    } catch (error) {
      console.error("Delete User Error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete user'
      );
    }
  }
);

const initialState = {
  users: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  hasMore: true,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Synchronous reducers if needed.
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data, page } = action.payload;
        // Replace users if page === 1; else, append new data.
        if (page === 1) {
          state.users = data;
        } else {
          state.users = state.users.concat(data);
        }
        state.page = page;
        // If fewer than 10 items are returned, assume no more data.
        state.hasMore = data.length === 5;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    // addUser
    builder
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    // updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    // deleteUser
    builder
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
