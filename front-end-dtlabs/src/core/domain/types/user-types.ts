export type LoginDto = {
  email: string;
  password: string;
}

export type RegisterUserDto = {
  name: string;
  email: string;
  password: string;
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type JwtPayload = {
  sub: string;
  email: string;
  isAdmin?: boolean;
};

export type JwtRegister = { 
  user: 
    { id: string; name: string; email: string, password: string }, 
  tokens: 
    { accessToken: string } 
}