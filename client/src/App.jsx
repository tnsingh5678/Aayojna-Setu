import React, { useContext, useEffect } from 'react'
import {Context} from './main'
import { BrowserRouter, Route, Routes} from "react-router-dom"
import Login from './component/auth/Login'
import Register from './component/auth/Register'
import { Toaster } from "react-hot-toast";
import NotFound from './component/NotFound/notfound'
import Home from './Home'
import SideBar from './component/components/SideBarHome'
import Sidebardata from "./data/Sidebardata"
import axios from "axios";
import About from './Pages/About'
import SideAbout from './data/SideAbout'
import Contacts from './Pages/Contacts'
import Schemes from './Pages/Schemes'
import ApplicationForm from './Pages/Application'
import SideBarHome from './component/components/SideBarHome'
import SideBarAbout from './component/components/SideBarAbout'
const App = () => {
  const{isAuthorized, setIsAuthorized, setUser} = useContext(Context);
  useEffect(()=>{
    const fetchUser = async()=>{
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials:true
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true)
      } catch (error) {
        setIsAuthorized(false)
      }
    };
    fetchUser();
  }
  ,[isAuthorized])
  return (
    <>
     <BrowserRouter>
       {/* <Navbar/> */}
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/" element={<Register/>}></Route>
        <Route path="/singh" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<SideBarHome/>}></Route>
        <Route path="/About" element={<SideBarAbout/>}></Route>
        <Route path='/contacts' element={<Contacts/>}></Route>
        <Route path='/schemes' element={<Schemes/>}></Route>
        <Route path='/Application' element={<ApplicationForm/>}></Route>
      </Routes>
      {/* <Footer/> */}
      <Toaster/>
     </BrowserRouter>
    </>
  )
}

export default App