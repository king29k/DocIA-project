import { Button } from '@/components/ui/button.jsx'
import { Target, Users } from 'lucide-react'

const PrecisionSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <span className="text-cyan-500 font-medium">Précision</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              UNE PRÉCISION INÉGALÉE POUR VOS DIAGNOSTICS
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              DocIA utilise les dernières avancées en intelligence artificielle pour analyser vos symptômes et vous fournir des informations médicales précises. Notre système s'appuie sur une vaste base de données médicales validées par des professionnels de santé.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-cyan-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">DIAGNOSTIC FIABLE</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Algorithmes avancés pour une analyse précise de vos symptômes et une orientation médicale appropriée.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-cyan-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">SUPPORT EMPATHIQUE</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Une approche humaine et bienveillante pour vous accompagner dans votre parcours de santé.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                COMMENCER
              </Button>
              <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-50">
                EN SAVOIR PLUS →
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md h-80 bg-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-400 rounded"></div>
                <p>Image placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrecisionSection

