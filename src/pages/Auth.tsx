import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Lock, User, Mail } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        // Redirect to desktop instead of dashboard
        navigate("/desktop");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/desktop`
          }
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode fazer login.");
        // Redirect to desktop after signup
        navigate("/desktop");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Grid background component
  const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
    </div>
  );

  // Floating animation for icons
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4 relative overflow-hidden">
      {/* Windows 11 Style Background */}
      <div className="absolute inset-0 bg-[url('https://win11.blueedge.me/img/wallpaper.jpg')] bg-cover bg-center opacity-30"></div>
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-8">
          <motion.div 
            className="relative"
            animate={floatAnimation}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
            <Clock className="h-12 w-12 text-white relative z-10" />
          </motion.div>
          <h1 className="text-3xl font-bold ml-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Workhub Cloud
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-white/80 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {isLogin ? "Acesse sua conta" : "Crie sua conta"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Nome Completo
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-gray-800 pl-10 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-800 pl-10 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Senha
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white border-gray-300 text-gray-800 pl-10 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 rounded-md font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Carregando...
                  </div>
                ) : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-6 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Fazer login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}