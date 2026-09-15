import {createBrowserRouter} from 'react-router';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import Protected from './features/auth/components/protected.jsx';
import Home from './features/Interview/pages/Home.jsx'
import Interview from './features/Interview/pages/interview.jsx';
import { Interviewdata } from './features/Interview/pages/Interviewdata.js';
export const router=createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/login",
        element:<LoginPage/>
    },
    {
        path:"/register",
        element:<RegisterPage/>
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><Interview data={Interviewdata}/></Protected>
    }
]);
