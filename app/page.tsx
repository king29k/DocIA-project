import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Shield, Clock, Users, Brain, Settings, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-teal-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="DocIA Logo" width={40} height={40} className="rounded-full" />
              <span className="text-xl font-bold">DocIA</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#accueil" className="hover:text-teal-200 transition-colors">
                Accueil
              </Link>
              <Link href="#about" className="hover:text-teal-200 transition-colors">
                À propos
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-teal-200 transition-colors">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="#features" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">
                    Fonctionnalités
                  </Link>
                  <Link href="#precision" className="block px-4 py-2 hover:bg-gray-100">
                    Diagnostic
                  </Link>
                  <Link href="#support" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                    Support 24/7
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/auth">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full">Se connecter</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="bg-teal-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                DOCAI : VOTRE
                <br />
                ASSISTANT
                <br />
                MÉDICAL
                <br />
                INTELLIGENT
              </h1>
              <p className="text-lg text-teal-100 leading-relaxed max-w-md">
                DocIA est votre compagnon santé intelligent qui vous accompagne dans vos questions médicales avec des
                réponses fiables et personnalisées, disponible 24h/24 et 7j/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full">
                    Commencer maintenant
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-teal-800 px-8 py-3 rounded-full bg-transparent"
                >
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-200 rounded-3xl aspect-square flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Placeholder"
                    width={96}
                    height={96}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto">
              DÉCOUVREZ COMMENT INTERAGIR FACILEMENT AVEC DOCAI POUR VOS QUESTIONS DE SANTÉ.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">UNE CONVERSATION FLUIDE ET EMPATHIQUE</h3>
                <p className="text-gray-600 text-sm">
                  Posez vos questions de santé comme si vous parliez à un professionnel bienveillant qui vous comprend.
                </p>
                <Button variant="link" className="text-teal-600 p-0">
                  Commencer →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Settings className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  POSEZ VOS QUESTIONS ET RECEVEZ DES RÉPONSES PERSONNALISÉES
                </h3>
                <p className="text-gray-600 text-sm">
                  Notre IA analyse vos questions et vous fournit des informations médicales adaptées à votre situation.
                </p>
                <Button variant="link" className="text-teal-600 p-0">
                  Découvrir →
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  PROFITEZ D'UNE EXPÉRIENCE UTILISATEUR INTUITIVE AVEC DOCAI
                </h3>
                <p className="text-gray-600 text-sm">
                  Interface simple et sécurisée pour une expérience optimale dans vos recherches de santé.
                </p>
                <Button variant="link" className="text-teal-600 p-0">
                  Explorer →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Precision Section */}
      <section id="precision" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-gray-500 mb-2">PRÉCISION</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                UNE PRÉCISION INÉGALÉE POUR VOS DIAGNOSTICS
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Grâce à notre intelligence artificielle avancée, DocIA analyse vos symptômes avec précision et vous
                guide dans vos questions de santé avec des informations fiables et actualisées.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">DIAGNOSTIC FIABLE</h4>
                  <p className="text-gray-600 text-sm">
                    Analyses basées sur des données médicales validées et des protocoles reconnus.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">SUPPORT EMPATHIQUE</h4>
                  <p className="text-gray-600 text-sm">
                    Un accompagnement bienveillant adapté à vos besoins et préoccupations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full">Essayer</Button>
                <Button variant="link" className="text-gray-900 p-0">
                  En savoir plus →
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-200 rounded-3xl aspect-square flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Placeholder"
                    width={96}
                    height={96}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="support" className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              DÉCOUVREZ LES FONCTIONNALITÉS DE DOCAI
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              DocIA offre des réponses instantanées et précises aux questions des patients. Grâce à son langage
              empathique, il facilite la compréhension des diagnostics et des soins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">ASSISTANCE 24/7 POUR VOS QUESTIONS MÉDICALES</h3>
                <p className="text-gray-600 text-sm">
                  Accédez à des informations médicales à tout moment, jour et nuit.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  RÉPONSES PERSONNALISÉES ET ADAPTÉES À CHAQUE PATIENT
                </h3>
                <p className="text-gray-600 text-sm">Chaque réponse est adaptée à votre situation spécifique.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm bg-white">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">INTERFACE INTUITIVE ET FACILE À UTILISER</h3>
                <p className="text-gray-600 text-sm">Une expérience utilisateur simple et accessible à tous.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="px-6 py-2 rounded-full bg-transparent">
                En savoir plus
              </Button>
              <Button variant="link" className="text-gray-900 p-0">
                Commencer →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">DISCUTEZ AVEC DOCAI MAINTENANT</h2>
          <p className="text-gray-600 text-lg mb-8">Posez vos questions sur la santé en toute confiance.</p>
          <Link href="/auth">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full">
              Se lancer dès maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Blog Section */}
      <section id="about" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-2">Blog</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SHORT HEADING GOES HERE</h2>
            <p className="text-gray-600 max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Placeholder"
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-xs text-gray-500 mb-2">Design</p>
                <h3 className="font-bold text-gray-900 mb-2">COMPRENDRE LES MÉDICAMENTS COURANTS</h3>
                <p className="text-gray-600 text-sm mb-4">Découvrez les effets et utilisations des médicaments.</p>
                <Button variant="link" className="text-gray-900 p-0 text-sm">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Placeholder"
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-xs text-gray-500 mb-2">Research</p>
                <h3 className="font-bold text-gray-900 mb-2">CONSEILS POUR UNE VIE SAINE</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Adoptez des habitudes saines pour améliorer votre bien-être.
                </p>
                <Button variant="link" className="text-gray-900 p-0 text-sm">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Placeholder"
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-xs text-gray-500 mb-2">Frameworks</p>
                <h3 className="font-bold text-gray-900 mb-2">INTERPRÉTER VOS RÉSULTATS MÉDICAUX</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comprenez vos résultats pour mieux discuter avec votre médecin.
                </p>
                <Button variant="link" className="text-gray-900 p-0 text-sm">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="px-6 py-2 rounded-full bg-transparent">
              Voir tout
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/images/logo.png" alt="DocIA Logo" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold">DocIA</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Colonnes Un</h4>
              <ul className="space-y-2 text-teal-200 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Un
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Deux
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Trois
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Quatre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Cinq
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Colonnes Deux</h4>
              <ul className="space-y-2 text-teal-200 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Six
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Sept
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Huit
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Neuf
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Dix
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Colonnes Trois</h4>
              <ul className="space-y-2 text-teal-200 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Onze
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Douze
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Treize
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Quatorze
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Lien Quinze
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">S'abonner</h4>
              <p className="text-teal-200 text-sm mb-4">
                Rejoignez notre newsletter pour rester informé de nos dernières actualités.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  className="flex-1 px-3 py-2 text-sm bg-teal-700 border border-teal-600 rounded text-white placeholder-teal-300"
                />
                <Button size="sm" className="bg-teal-600 hover:bg-teal-500">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-teal-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-teal-200">
            <p>&copy; 2025 DocIA. Tous droits réservés. Développé pour le Douala General Hospital.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="hover:text-white">
                Twitter
              </Link>
              <Link href="#" className="hover:text-white">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-white">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
