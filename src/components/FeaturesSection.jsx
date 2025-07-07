import { Clock, FileText, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-cyan-500 font-medium">Services</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            DÉCOUVREZ LES FONCTIONNALITÉS DE DOCAI
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            DocIA offre une gamme complète de services pour vous accompagner dans vos questions de santé. Découvrez comment notre intelligence artificielle peut vous aider au quotidien.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              ASSISTANCE 24/7 POUR VOS QUESTIONS MÉDICALES
            </h3>
            <p className="text-gray-600">
              Accédez à DocIA à tout moment pour obtenir des réponses à vos questions de santé, jour et nuit.
            </p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              RÉPONSES PERSONNALISÉES ET ADAPTÉES À CHAQUE PATIENT
            </h3>
            <p className="text-gray-600">
              Chaque réponse est adaptée à votre situation spécifique pour une aide médicale personnalisée.
            </p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              INTERFACE INTUITIVE ET FACILE À UTILISER
            </h3>
            <p className="text-gray-600">
              Interface simple et intuitive, accessible sur tous vos appareils pour une expérience optimale.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
            EN SAVOIR PLUS
          </Button>
          <Button variant="outline" className="ml-4 border-cyan-500 text-cyan-500 hover:bg-cyan-50">
            COMMENCER →
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

