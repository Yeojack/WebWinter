// src/App.jsx

import { Route, Routes } from 'react-router';

import Layout from '@/components/layout';
import ViewData from '@/pages/ViewData';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Trends from '@/pages/Trends';
import Upload from '@/pages/Upload';
import Production from '@/pages/Production';
import Market from '@/pages/Market';
import Growth from '@/pages/Growth';
import Register from '@/pages/Register';
import RequireAuth from '@/components/RequireAuth';
import MainLayout from '@/components/MainLayout';

function App() {
  return (
    <Routes>
      <Route element={
            <RequireAuth>
            <MainLayout />
            </RequireAuth>
          }
        >
          <Route path='/' element={<Home />} />
          <Route path='/trend' element={<Trends />} />
          <Route path='/viewData' element={<ViewData />} />
          <Route path='/upload' element={<Upload/>} />
          <Route path='/production' element = {<Production/>} />
          <Route path='/market' element = {<Market/>} />
          <Route path='/growth' element = {<Growth/>} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='*' element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
