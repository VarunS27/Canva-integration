import Sidebar from "./components/Sidebar";
import CanvasBoard from "./components/CanvasBoard";



export default function App() {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-950 text-whit">
      
      <CanvasBoard />
    </div>
  );
}
