import React from 'react'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
