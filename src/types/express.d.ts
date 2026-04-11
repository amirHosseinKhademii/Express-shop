declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
      };
      requestId?: string;
    }
  }
}

export {};
