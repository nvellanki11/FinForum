import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router'
import Home from './Components/Home'
import Create from './Components/Create'
import Post from './Components/Post'

function NavBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  // Handles filtering posts by user text input
  // Query = used in Home.jsx, compared against post titles (only info displayed in feed)
  const handleSearchChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Encoded query param, rerenders without page reload
    navigate(`/?q=${encodeURIComponent(value)}`)
  }

  return (
    <div className='nav-bar'>
      <span className='nav-logo'>FinForum</span>
      <div className='nav-links'>
        <Link className='top-link' to={"/"}>Home</Link>
        <Link className='top-link' to={"/create"}>Create a Post</Link>
      </div>
      <form className='nav-search' onSubmit={(e) => e.preventDefault()}>
        <input
          type='text'
          placeholder='Search posts...'
          value={query}
          onChange={handleSearchChange}
        />
      </form>
    </div>
  )
}

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path='/post/:id' element={<Post/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
