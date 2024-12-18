
import { Route, Routes } from "react-router-dom";
import './App.css'
import Homepage from "./pages/homepage/Homepage";
import User from "./pages/user/user";
import Agent from "./pages/agent/agent";
import socket from "./socket";

const App = () => {
  socket.on('connection', function () {
    console.log('Connected to server');
  });

  return (
    <Routes>
      <Route path="/user" element={<User />} />
      <Route path="/agent" element={<Agent />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
};

export default App;
