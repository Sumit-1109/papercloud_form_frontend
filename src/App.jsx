import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Create from './pages/Create/Create'
import { useState } from 'react'
import FormPage from './pages/FormPage/FormPage'

function App() {

  const [editMode, setEditMode] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home setEditMode={setEditMode} editMode={editMode} />} />
      <Route path='/create' element={<Create setEditMode={setEditMode} editMode={false} />} />
      <Route path="/edit/:formId" element={<Create setEditMode={setEditMode} editMode={true} />} />
      <Route path='/view/:formId' element={<FormPage/>} />

    </Routes>
  )
}

export default App
