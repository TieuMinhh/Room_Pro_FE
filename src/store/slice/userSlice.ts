import axiosCustomize from "@/service/axios.customize";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

export const LoginUserAPIs = createAsyncThunk(
  "user/login",
  async (userData: any) => {
    const result = await axiosCustomize.post("api/v1/auth/login", userData);
    return result.data
  }
);

export const logoutUserAPIs = createAsyncThunk("user/logout", async () => {
  const result = await axiosCustomize.post("api/v1/auth/logout");
  return result.data
});

export const LoginTenantAPIs = createAsyncThunk(
  "tenant/login",
  async (userData: any) => {
    const result = await axiosCustomize.post("api/v1/auth/tenant/login", userData);
    return result.data
  }
);

export const RegisterTenantAPIs = createAsyncThunk(
  "tenant/register",
  async (userData: any) => {
    const result = await axiosCustomize.post("api/v1/auth/tenant/register", userData);
    return result.data
  }
);
export const updateUserAPIs = createAsyncThunk("user/update", async (userData: any) => {
  // If userData is FormData (contains file), don't set Content-Type header
  // Axios will automatically set the correct Content-Type with boundary
  const config = userData instanceof FormData ? {} : {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const result = await axiosCustomize.put("api/v1/profile", userData, config);
  return result.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUserAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(logoutUserAPIs.fulfilled, (state, action) => {
      state.currentUser = null;
    });
    builder.addCase(updateUserAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(LoginTenantAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(RegisterTenantAPIs.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const selectCurrentUser = (state: any) => state.user.currentUser;

export const userReducer = userSlice.reducer;
