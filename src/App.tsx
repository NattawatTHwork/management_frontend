import { ChakraProvider } from '@chakra-ui/react'
import Login from './pages/Login';
import SuperAdminLogin from './pages/SuperAdminLogin';
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
import UserTimeClock from './pages/User/UserTimeClock';
import UserTimeSheet from './pages/User/UserTimeSheet';
import AdminTimeSheet from './pages/Admin/AdminTimeSheet';
import SuperAdminTimeSheet from './pages/SuperAdmin/SuperAdminTimeSheet';
import SuperAdminAcceptLeave from './pages/SuperAdmin/SuperAdminAcceptLeave';
import AdminAcceptLeave from './pages/Admin/AdminAcceptLeave';

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
        <Route path='/superadmin/timesheet' element={<SuperAdminTimeSheet />} />
        <Route path='/superadmin/accept_leave' element={<SuperAdminAcceptLeave />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/user' element={<AdminUser />} />
        <Route path='/admin/task' element={<AdminTask />} />
        <Route path='/admin/mytask' element={<AdminMyTask />} />
        <Route path='/admin/timesheet' element={<AdminTimeSheet />} />
        <Route path='/admin/accept_leave' element={<AdminAcceptLeave />} />
        <Route path='/superadminlogin' element={<SuperAdminLogin />} />
        <Route path='/mytask' element={<UserMyTask />} />
        <Route path='/leave' element={<UserLeave />} />
        <Route path='/timeclock' element={<UserTimeClock />} />
        <Route path='/timesheet' element={<UserTimeSheet />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
