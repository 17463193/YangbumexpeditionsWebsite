import { useState } from 'react'
import './App.css'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import NavbarHero from './components/NavbarHero/NavbarHero';
import 'animate.css/animate.min.css';
import About from './pages/About/About';
import Servicesp from './pages/Servicesp/Servicesp';
import PackageDetails from './pages/Tourpackage/PackageDetails';
import Tourpackage from './pages/Tourpackage/Tourpackage';
import DestinationDetail from './pages/Destination/DestinationDetail';
import FestivalList from './pages/Festivals/FestivalList';
import FestivalDetail from './pages/Festivals/FestivalDetail';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import Detail from './pages/blogandresturant/detial';
import Contact from './pages/Contact/Contact';
import AttractionDetails from './pages/Attraction/AttractionDetails';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Terms from './pages/Terms/Terms';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <NavbarHero/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/servicesp' element={<Servicesp />} />
        <Route path="/packages" element={<Tourpackage />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/destinations/:location" element={<DestinationDetail />} />
        <Route path="/festivals" element={<FestivalList />} />
        <Route path="/blogdetail" element={<BlogDetail />} />
        <Route path="/festival/:id" element={<FestivalDetail />} />      
        <Route path="/:type/:id" element={<Detail />} />
        <Route path="/attractions/:id" element={<AttractionDetails />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/terms" element={<Terms />} />
</Routes>
      <Footer />
    </div>
  ) 
}

export default App

