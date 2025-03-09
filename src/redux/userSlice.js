import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

// Fetch Users from API
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update User
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser, {rejectWithValue}) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedUser),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      // Return the updated user directly
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add New User
export const addUser = createAsyncThunk(
  'users/addUser',
  async (newUser, {rejectWithValue}) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newUser),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const data = await response.json();
      // Assign a random ID since the mock API doesn't generate one
      return {...data, id: Math.floor(Math.random() * 1000)};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  users: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    // addUser
    builder
      .addCase(addUser.pending, state => {
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
      .addCase(updateUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.map(user =>
          user.id === action.payload.id ? action.payload : user,
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    // deleteUser
    builder
      .addCase(deleteUser.pending, state => {
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
