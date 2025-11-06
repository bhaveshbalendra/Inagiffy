// Interface defining database connection contract
interface IDatabaseConnection {
  connectDB(): Promise<void>;
  disconnectDB(): Promise<void>;
}

// Class implementing the interface contract
export class DatabaseConnection implements IDatabaseConnection {
  async connectDB() {
    throw new Error("connect() must be implemented");
  }

  async disconnectDB() {
    throw new Error("disconnect() must be implemented");
  }
}
