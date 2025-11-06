import { ErrorBoundary } from "./components/ErrorBoundary";
import { MapGenerator } from "./components/MapGenerator";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <MapGenerator />
      </div>
    </ErrorBoundary>
  );
}

export default App;
