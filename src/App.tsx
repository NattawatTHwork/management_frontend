import { ChakraProvider } from '@chakra-ui/react'
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/User/UserDashboard';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuperAdminUser from './pages/SuperAdmin/SuperAdminUser';
import SuperAdminRank from './pages/SuperAdmin/SuperAdminRank';
import SuperAdminPosition from './pages/SuperAdmin/SuperAdminPosition';
import SuperAdminOffice from './pages/SuperAdmin/SuperAdminOffice';
import SuperAdminTask from './pages/SuperAdmin/SuperAdminTask';
import AdminUser from './pages/Admin/AdminUser';
import AdminTask from './pages/Admin/AdminTask';
import AdminMyTask from './pages/Admin/AdminMyTask';
import UserMyTask from './pages/User/UserMyTask';
import UserLeave from './pages/User/UserLeave';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path='/' element={<UserDashboard />} />
        <Route path='/superadmin' element={<SuperAdminDashboard />} />
        <Route path='/superadmin/user' element={<SuperAdminUser />} />
        <Route path='/superadmin/rank' element={<SuperAdminRank />} />
        <Route path='/superadmin/position' element={<SuperAdminPosition />} />
        <Route path='/superadmin/office' element={<SuperAdminOffice />} />
        <Route path='/superadmin/task' element={<SuperAdminTask />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/user' element={<AdminUser />} />
        <Route path='/admin/task' element={<AdminTask />} />
        <Route path='/admin/mytask' element={<AdminMyTask />} />
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route path='/mytask' element={<UserMyTask />} />
        <Route path='/leave' element={<UserLeave />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
