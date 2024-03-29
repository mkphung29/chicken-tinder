import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Discovery from './pages/Discovery';
import Matches from './pages/Matches';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const authToken = cookies.AuthToken

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"/dashboard"} element={<Dashboard/>}/>
        <Route path={"/onboarding"} element={<Onboarding/>}/>
        <Route path={"/discovery"} element={<Discovery/>}/>
        <Route path={"/matches"} element={<Matches/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
