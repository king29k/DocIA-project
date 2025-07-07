import './App.css'
import Header from './components/Header'
import InfoSection from './components/InfoSection'
import PrecisionSection from './components/PrecisionSection'
import FeaturesSection from './components/FeaturesSection'
import ChatSection from './components/ChatSection'
import ContentSection from './components/ContentSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <InfoSection />
      <PrecisionSection />
      <FeaturesSection />
      <ChatSection />
      <ContentSection />
      <Footer />
    </div>
  )
}

export default App
