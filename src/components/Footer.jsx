import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">DocIA</h3>
            <p className="text-slate-200 mb-4">
              Votre assistant médical intelligent pour des informations de santé fiables et personnalisées.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">COMPANY</h4>
            <ul className="space-y-2 text-slate-200">
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Équipe</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">SERVICES</h4>
            <ul className="space-y-2 text-slate-200">
              <li><a href="#" className="hover:text-white transition-colors">Consultation IA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Diagnostic</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prévention</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suivi médical</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">NEWSLETTER</h4>
            <p className="text-slate-200 mb-4">
              Restez informé des dernières actualités santé et des nouveautés DocIA.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Votre email" 
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-300"
              />
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-200 text-sm">
            © 2024 DocIA. Tous droits réservés. | Politique de confidentialité | Conditions d'utilisation
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-slate-200 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <div className="w-6 h-6 bg-cyan-500 rounded"></div>
            </a>
            <a href="#" className="text-slate-200 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <div className="w-6 h-6 bg-cyan-500 rounded"></div>
            </a>
            <a href="#" className="text-slate-200 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <div className="w-6 h-6 bg-cyan-500 rounded"></div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

