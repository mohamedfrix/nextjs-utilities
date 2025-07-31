
import express, { Request, Response } from 'express';
import cors from 'cors';
import { FormRequestData, FormResponseData, RefreshTokenRequest, UserModel, RefreshTokenResponse } from '../src/types/form';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Dummy user for demonstration
const dummyUser: UserModel = {
  id: '1',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  age: 30,
  gender: 'male',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

app.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as FormRequestData;

  // Dummy authentication logic
  if (email === dummyUser.email && password === 'password123') {
    const response: FormResponseData = {
      success: true,
      message: 'Login successful',
      access_token: 'dummy-access-token',
      refresh_token: 'dummy-refresh-token',
      user: dummyUser,
    };
    res.json(response);
  } else {
    const response: FormResponseData = {
      success: false,
      message: 'Invalid email or password',
    };
    res.status(401).json(response);
  }
});


app.post('/refresh-token', (req: Request, res: Response) => {
  const { refresh_token } = req.body as RefreshTokenRequest;

  // Dummy refresh logic: always succeed if refresh_token is present in body
  if (refresh_token) {
    const response: RefreshTokenResponse = {
      success: true,
      message: 'Token refreshed successfully',
      access_token: 'dummy-new-access-token',
      refresh_token: 'dummy-new-refresh-token',
    };
    res.json(response);
  } else {
    const response: RefreshTokenResponse = {
      success: false,
      message: 'Invalid refresh request',
    };
    res.status(401).json(response);
  }
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
