import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router'
import Home from './Components/Home'
import Create from './Components/Create'
import Post from './Components/Post'

function NavBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className='nav-bar'>
      <span className='nav-logo'>FinForum</span>
      <div className='nav-links'>
        <Link className='top-link' to={"/"}>Home</Link>
        <Link className='top-link' to={"/create"}>Create a Post</Link>
      </div>
      <form className='nav-search' onSubmit={submitSearch}>
        <input
          type='text'
          placeholder='Search posts...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
