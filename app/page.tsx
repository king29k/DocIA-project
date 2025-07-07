import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageCircle, Shield, Clock, Users, Brain, Stethoscope } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="DocIA Logo" width={50} height={50} className="rounded-full" />
            <span className="text-2xl font-bold text-white">DocIA</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-white hover:text-teal-200 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#about" className="text-white hover:text-teal-200 transition-colors">
              À propos
            </Link>
            <Link href="#contact" className="text-white hover:text-teal-200 transition-colors">
              Contact
            </Link>
          </div>
          <Link href="/auth">
            <Button className="bg-white text-teal-800 hover:bg-teal-50">Se connecter</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              DOCAI : VOTRE
              <br />
              <span className="text-teal-200">ASSISTANT</span>
              <br />
              <span className="text-teal-200">MÉDICAL</span>
              <br />
              INTELLIGENT
            </h1>
            <p className="text-xl text-teal-100 leading-relaxed">
              DocIA est votre compagnon santé intelligent qui vous accompagne dans vos questions médicales avec des
              réponses fiables et personnalisées, disponible 24h/24 et 7j/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-lg">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-800 px-8 py-4 text-lg bg-transparent"
              >
                En savoir plus
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="aspect-square bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center">
                <Image src="/images/logo.png" alt="DocIA Assistant" width={200} height={200} className="rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-teal-900 mb-4">
              DÉCOUVREZ COMMENT INTERAGIR FACILEMENT AVEC DOCAI POUR VOS QUESTIONS DE SANTÉ.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">UNE CONVERSATION FLUIDE ET EMPATHIQUE</h3>
                <p className="text-gray-600">
                  Posez vos questions de santé comme si vous parliez à un professionnel bienveillant qui vous comprend.
                </p>
                <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent">
                  Commencer →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  POSEZ VOS QUESTIONS ET RECEVEZ DES RÉPONSES PERSONNALISÉES
                </h3>
                <p className="text-gray-600">
                  Notre IA analyse vos questions et vous fournit des informations médicales adaptées à votre situation.
                </p>
                <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent">
                  Découvrir →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900">
                  PROFITEZ D'UNE EXPÉRIENCE UTILISATEUR INTUITIVE AVEC DOCAI
                </h3>
                <p className="text-gray-600">
                  Interface simple et sécurisée pour une expérience optimale dans vos recherches de santé.
                </p>
                <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent">
                  Explorer →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Precision Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-teal-900 mb-6">UNE PRÉCISION INÉGALÉE POUR VOS DIAGNOSTICS</h2>
              <p className="text-gray-600 text-lg mb-8">
                Grâce à notre intelligence artificielle avancée, DocIA analyse vos symptômes avec précision et vous
                guide dans vos questions de santé avec des informations fiables et actualisées.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-bold text-teal-900 mb-2">DIAGNOSTIC FIABLE</h4>
                  <p className="text-gray-600 text-sm">
                    Analyses basées sur des données médicales validées et des protocoles reconnus.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-teal-900 mb-2">SUPPORT EMPATHIQUE</h4>
                  <p className="text-gray-600 text-sm">
                    Un accompagnement bienveillant adapté à vos besoins et préoccupations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-teal-600 hover:bg-teal-700">Essayer</Button>
                <Button variant="outline" className="text-teal-600 border-teal-600 bg-transparent">
                  En savoir plus →
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <Stethoscope className="h-32 w-32 text-teal-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-teal-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">DÉCOUVREZ LES FONCTIONNALITÉS DE DOCAI</h2>
            <p className="text-teal-200 text-lg">
              DocIA offre des réponses instantanées et précises aux questions des patients. Grâce à son langage
              empathique, il facilite la compréhension des diagnostics et des soins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-teal-800 border-teal-700 text-white">
              <CardContent className="p-8 text-center space-y-4">
                <Clock className="h-12 w-12 text-teal-300 mx-auto" />
                <h3 className="text-xl font-bold">ASSISTANCE 24/7 POUR VOS QUESTIONS MÉDICALES</h3>
                <p className="text-teal-200">Accédez à des informations médicales à tout moment, jour et nuit.</p>
              </CardContent>
            </Card>

            <Card className="bg-teal-800 border-teal-700 text-white">
              <CardContent className="p-8 text-center space-y-4">
                <Brain className="h-12 w-12 text-teal-300 mx-auto" />
                <h3 className="text-xl font-bold">RÉPONSES PERSONNALISÉES ET ADAPTÉES À CHAQUE PATIENT</h3>
                <p className="text-teal-200">Chaque réponse est adaptée à votre situation spécifique.</p>
              </CardContent>
            </Card>

            <Card className="bg-teal-800 border-teal-700 text-white">
              <CardContent className="p-8 text-center space-y-4">
                <Users className="h-12 w-12 text-teal-300 mx-auto" />
                <h3 className="text-xl font-bold">INTERFACE INTUITIVE ET FACILE À UTILISER</h3>
                <p className="text-teal-200">Une expérience utilisateur simple et accessible à tous.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">DISCUTEZ AVEC DOCAI MAINTENANT</h2>
          <p className="text-teal-100 text-lg mb-8">Posez vos questions sur la santé en toute confiance.</p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/images/logo.png" alt="DocIA Logo" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold text-white">DocIA</span>
              </div>
              <p className="text-teal-200">Votre assistant santé intelligent disponible 24h/24.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Sécurité
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-8 pt-8 text-center text-teal-200">
            <p>&copy; 2025 DocIA. Tous droits réservés. Développé pour le Douala General Hospital.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
