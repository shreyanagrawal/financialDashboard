import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Home from './pages/Home';
import Nav from './components/Nav';

function App() {
    return (
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    );
}

export default App;

