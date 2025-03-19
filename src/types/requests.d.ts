import { Request } from 'express';

interface TokenPayload {
  user_id: number;
  username: string;
}

export interface CustomRequest extends Request {
  tokenPayload?: TokenPayload;
}
