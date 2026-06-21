import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Constitution from './pages/Constitution'
import SolarTerm from './pages/SolarTerm'
import Recipes from './pages/Recipes'
import Health from './pages/Health'
import QA from './pages/QA'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="constitution" element={<Constitution />} />
          <Route path="solar-term" element={<SolarTerm />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="health" element={<Health />} />
          <Route path="qa" element={<QA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App