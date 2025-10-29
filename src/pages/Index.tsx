import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Parallax } from "react-parallax";
import { Clock, BarChart3, Globe, Zap, ArrowRight, Users, Shield, Cloud } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Floating animation for icons
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  // Staggered animation for feature cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden">
      {/* Windows 11 Style Background */}
      <div className="absolute inset-0 bg-[url('https://win11.blueedge.me/img/wallpaper.jpg')] bg-cover bg-center opacity-30"></div>
      
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              animate={floatAnimation}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
                <Clock className="h-20 w-20 text-white relative z-10" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Workhub Cloud
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transforme seu trabalho remoto com nossa plataforma tudo-em-um. 
              Área de trabalho virtual, rastreamento de tempo e cálculo automático de ganhos.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-md font-semibold"
              >
                <span className="relative z-10">Começar Agora</span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="text-lg px-8 py-6 bg-blue-800/50 hover:bg-blue-800/70 text-white transition-all duration-300 transform hover:scale-105 shadow-lg rounded-md font-semibold backdrop-blur-sm border border-white/20"
              >
                <span className="relative z-10">Fazer Login</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Recursos Poderosos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para trabalhar de forma eficiente e produtiva
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={item}
              className="p-8 rounded-lg bg-white border border-gray-300 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-blue-100 mr-4">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Time Tracking</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Rastreie seu tempo de trabalho com precisão e calcule seus ganhos automaticamente com nossa tecnologia avançada.
              </p>
              <div className="flex items-center text-blue-500 font-medium">
                Saiba mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="p-8 rounded-lg bg-white border border-gray-300 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-indigo-100 mr-4">
                  <Globe className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Workspace Virtual</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Área de trabalho completa no navegador com aplicativos integrados e janelas arrastáveis para máxima produtividade.
              </p>
              <div className="flex items-center text-indigo-500 font-medium">
                Saiba mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="p-8 rounded-lg bg-white border border-gray-300 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-green-100 mr-4">
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Modo Foco</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Aumente sua produtividade com timer Pomodoro e relatórios detalhados para otimizar seu fluxo de trabalho.
              </p>
              <div className="flex items-center text-green-500 font-medium">
                Saiba mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">10K+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-indigo-500 mb-2">50K+</div>
              <div className="text-gray-600">Horas Trabalhadas</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-700 mb-2">24/7</div>
              <div className="text-gray-600">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Pronto para transformar seu trabalho?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já estão usando o Workhub Cloud para aumentar sua produtividade.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg rounded-md font-semibold"
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-300 relative z-10 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Clock className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Workhub Cloud</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Users className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Shield className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Cloud className="h-5 w-5" />
              </a>
            </div>
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              © 2025 Workhub Cloud. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;