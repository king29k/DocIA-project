import { Button } from '@/components/ui/button.jsx'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          DocIA
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#accueil" className="hover:text-slate-200 transition-colors">Accueil</a>
          <a href="#apropos" className="hover:text-slate-200 transition-colors">À propos</a>
          <a href="#services" className="hover:text-slate-200 transition-colors">Services</a>
          <a href="#contact" className="hover:text-slate-200 transition-colors">Contact</a>
        </div>
        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800">
          Connexion
        </Button>
      </nav>
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              DOCAI : VOTRE ASSISTANT MÉDICAL INTELLIGENT
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-slate-100">
              Obtenez des informations médicales fiables et personnalisées grâce à notre intelligence artificielle avancée. DocIA vous accompagne dans votre parcours de santé avec des réponses précises et empathiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                DÉCOUVRIR
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800">
                EN SAVOIR PLUS
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-400 rounded"></div>
                <p>Image placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

