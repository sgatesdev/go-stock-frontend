// import bootstrap css
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Analysis from './pages/Analysis';
import EditStock from './pages/EditStock';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="row">
          <Nav />
        </div>
        <div className="row">
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/stocks" element={<Stocks />}></Route>
            <Route path="/stocks/:id" element={<EditStock />}></Route>
            <Route path="/analysis" element={<Analysis />}></Route>
            <Route path="/analysis/:id" element={<Analysis />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
