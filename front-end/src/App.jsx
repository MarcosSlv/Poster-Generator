import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-gray-600 min-h-screen pt-40">
      <Outlet />
    </div>
  );
}

export default App;