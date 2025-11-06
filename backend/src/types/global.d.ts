/**
 * Global type declarations for modules that may not have type definitions
 * This file serves as a fallback if @types packages are not available
 * Note: These are minimal declarations. @types packages should be preferred.
 */

declare module "express" {
  export interface Application {
    use(...handlers: any[]): Application;
    get(path: string, ...handlers: any[]): Application;
    post(path: string, ...handlers: any[]): Application;
    set(key: string, value: any): Application;
  }
  export interface Request {
    body: any;
    params: any;
    query: any;
    ip?: string;
  }
  export interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
  }
  export interface NextFunction {
    (err?: any): void;
  }
  export interface Router {
    get(path: string, ...handlers: any[]): Router;
    post(path: string, ...handlers: any[]): Router;
  }
  export function json(): any;
  export function urlencoded(options?: any): any;
  export function Router(): Router;
  function express(): Application;
  export default express;
}

declare module "body-parser" {
  function json(options?: any): any;
  function urlencoded(options?: any): any;
  export { json, urlencoded };
  export default { json, urlencoded };
}

declare module "cookie-parser" {
  function cookieParser(secret?: string): any;
  export default cookieParser;
}

declare module "cors" {
  export interface CorsOptions {
    origin?:
      | string
      | string[]
      | ((
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void
        ) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }
  function cors(options?: CorsOptions): any;
  export default cors;
}

declare module "helmet" {
  function helmet(options?: any): any;
  export default helmet;
}

declare module "hpp" {
  function hpp(options?: any): any;
  export default hpp;
}

declare module "express-rate-limit" {
  export interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string;
    handler?: (req: any, res: any, next: any) => void;
  }
  function rateLimit(options?: RateLimitOptions): any;
  export default rateLimit;
}

declare module "mongoose" {
  export interface Document {
    _id?: any;
    save(): Promise<this>;
    toObject(): any;
  }
  export interface Model<T extends Document> {
    new (data?: any): T;
    findById(id: string): Promise<T | null>;
    find(query?: any): Promise<T[]>;
    create(data: any): Promise<T>;
  }
  export interface Schema {
    new (definition?: any, options?: any): Schema;
  }
  export interface Connection {
    readyState: number;
  }
  export function connect(uri: string, options?: any): Promise<any>;
  export function disconnect(): Promise<void>;
  export function model<T extends Document>(
    name: string,
    schema?: Schema
  ): Model<T>;
  export const connection: Connection;
  const mongoose: {
    connect: typeof connect;
    disconnect: typeof disconnect;
    model: typeof model;
    connection: Connection;
  };
  export default mongoose;
}

declare module "@google/genai" {
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: {
      generateContent(options: { model: string; contents: string }): Promise<{
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      }>;
    };
  }
}

declare module "http" {
  export interface Server {
    listen(port: number, callback?: () => void): Server;
    close(callback?: () => void): void;
    on(event: string, listener: (...args: any[]) => void): Server;
  }
  export function createServer(requestListener?: any): Server;
}

declare module "dotenv" {
  export function config(options?: any): { parsed?: Record<string, string> };
}

// Node.js global types
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
  exit(code?: number): never;
  on(event: string, listener: (...args: any[]) => void): void;
};

// Console global (Node.js)
declare var console: {
  log(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
};

// Error.captureStackTrace (Node.js specific)
interface ErrorConstructor {
  captureStackTrace?(errorObject: Error, constructorOpt?: Function): void;
}
