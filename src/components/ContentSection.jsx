import { Button } from '@/components/ui/button.jsx'

const ContentSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            SHORT HEADING GOES HERE
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded"></div>
                <p className="text-sm">Image placeholder</p>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">CATÉGORIE</span>
              <span className="text-xs text-gray-500 ml-2">5 min lecture</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              COMPRENDRE LES MÉDICAMENTS COURANTS
            </h3>
            <p className="text-gray-600 mb-4">
              Découvrez les informations essentielles sur les médicaments les plus prescrits et leurs effets.
            </p>
            <Button variant="outline" className="w-full">
              EN SAVOIR PLUS →
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded"></div>
                <p className="text-sm">Image placeholder</p>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">PRÉVENTION</span>
              <span className="text-xs text-gray-500 ml-2">8 min lecture</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              CONSEILS POUR UNE VIE SAINE
            </h3>
            <p className="text-gray-600 mb-4">
              Adoptez les bonnes habitudes pour préserver votre santé au quotidien avec nos conseils pratiques.
            </p>
            <Button variant="outline" className="w-full">
              EN SAVOIR PLUS →
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded"></div>
                <p className="text-sm">Image placeholder</p>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">DIAGNOSTIC</span>
              <span className="text-xs text-gray-500 ml-2">6 min lecture</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              INTERPRÉTER VOS RÉSULTATS MÉDICAUX
            </h3>
            <p className="text-gray-600 mb-4">
              Apprenez à comprendre vos analyses et résultats médicaux avec l'aide de DocIA.
            </p>
            <Button variant="outline" className="w-full">
              EN SAVOIR PLUS →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContentSection

