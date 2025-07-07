import { MessageCircle, HelpCircle, Shield } from 'lucide-react'

const InfoSection = () => {
  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            DÉCOUVREZ COMMENT INTERAGIR FACILEMENT AVEC DOCAI POUR VOS QUESTIONS DE SANTÉ.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              UNE CONVERSATION POUR MIEUX COMPRENDRE
            </h3>
            <p className="text-gray-600 mb-4">
              Discutez avec DocIA comme avec un professionnel de santé. Notre IA comprend vos questions et vous répond de manière personnalisée.
            </p>
            <button className="text-cyan-500 font-medium hover:text-cyan-600">
              COMMENCER →
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              POSEZ VOS QUESTIONS ET OBTENEZ DES RÉPONSES ADAPTÉES À VOS BESOINS.
            </h3>
            <p className="text-gray-600 mb-4">
              Notre IA analyse vos questions et vous fournit des informations médicales fiables, adaptées à votre situation spécifique.
            </p>
            <button className="text-cyan-500 font-medium hover:text-cyan-600">
              DÉCOUVRIR →
            </button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              PROFITEZ D'UNE EXPÉRIENCE UTILISATEUR INTELLIGENTE AVEC DOCAI.
            </h3>
            <p className="text-gray-600 mb-4">
              Interface intuitive, réponses rapides et informations vérifiées pour une expérience utilisateur optimale et sécurisée.
            </p>
            <button className="text-cyan-500 font-medium hover:text-cyan-600">
              EXPLORER →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection

