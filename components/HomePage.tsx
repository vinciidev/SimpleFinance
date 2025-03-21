"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { CircleDollarSign, CheckCircle2, ArrowRight, BarChart3, Calendar, CreditCard, PieChart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DemoSection from "@/components/DemoSection"

// Função para abrir o modal do Stripe
const openStripeCheckout = () => {
  // Verifica se o Stripe está carregado
  if (typeof window !== 'undefined' && window.Stripe) {
    // Cria um elemento invisível do botão do Stripe
    const stripeButton = document.createElement('stripe-buy-button');
    stripeButton.setAttribute('buy-button-id', 'buy_btn_1R54KCLW4QSUgIBP4Isp82KO');
    stripeButton.setAttribute('publishable-key', 'pk_live_51R4kYWLW4QSUgIBPdDUAE1TdAly8BfSHbLcUQLOSLtT0qcFDInwrbiLoptXXmEwFbCXU390O8MZ1TDOKSY1kEWVx00UWjmcxxw');
    stripeButton.style.display = 'none';
    document.body.appendChild(stripeButton);
    
    // Simula um clique no botão
    setTimeout(() => {
      stripeButton.shadowRoot?.querySelector('button')?.click();
    }, 100);
  }
};

export default function HomePage() {
  const router = useRouter()
  const stripeButtonRef = useRef<HTMLDivElement>(null);

  // Adiciona o botão do Stripe de forma oculta para poder acioná-lo programaticamente
  useEffect(() => {
    if (stripeButtonRef.current) {
      const stripeButton = document.createElement('stripe-buy-button');
      stripeButton.setAttribute('buy-button-id', 'buy_btn_1R54KCLW4QSUgIBP4Isp82KO');
      stripeButton.setAttribute('publishable-key', 'pk_live_51R4kYWLW4QSUgIBPdDUAE1TdAly8BfSHbLcUQLOSLtT0qcFDInwrbiLoptXXmEwFbCXU390O8MZ1TDOKSY1kEWVx00UWjmcxxw');
      stripeButton.style.display = 'none';
      stripeButtonRef.current.appendChild(stripeButton);
    }
  }, []);

  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Visão Geral Completa",
      description: "Acompanhe seus ganhos, gastos e investimentos com gráficos intuitivos e métricas detalhadas.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Controle Mensal",
      description: "Organize suas finanças por mês, com planilhas separadas para melhor organização e planejamento.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Gestão de Transações",
      description: "Registre e categorize todas as suas transações com detalhes como forma de pagamento e categoria.",
    },
    {
      icon: <PieChart className="h-10 w-10 text-primary" />,
      title: "Análise por Categoria",
      description: "Visualize como seus gastos e investimentos estão distribuídos por categoria.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Div oculta para o botão do Stripe */}
      <div ref={stripeButtonRef} className="hidden"></div>
      
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-background to-muted">
        <div className="container px-4 py-8 md:py-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CircleDollarSign className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">Simple Finance</h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold max-w-2xl">
              Controle financeiro simples e eficaz para o seu dia a dia
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Gerencie suas finanças pessoais de forma intuitiva, acompanhe seus gastos, ganhos e investimentos, e tome
              decisões financeiras mais inteligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" onClick={() => router.push("/login")}>
                Entrar
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para gerenciar suas finanças em um só lugar
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-muted">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experimente</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja como é fácil gerenciar suas finanças com o Simple Finance
            </p>
          </div>
          <DemoSection />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta às suas necessidades
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold">R$0</span>
                  <span className="ml-1 text-xl text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Acesso básico</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>1 planilha mensal</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-muted-foreground">Relatórios detalhados</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-muted-foreground">Suporte prioritário</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  {/* Mantém o botão original, mas com o onClick para o Stripe */}
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    size="lg" 
                    onClick={openStripeCheckout}
                  >
                    Começar grátis
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">Válido por apenas 1 mês</p>
                </div>
              </CardFooter>
            </Card>

            {/* Plano Premium */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Plano Premium</CardTitle>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold">R$19,90</span>
                  <span className="ml-1 text-xl text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Acesso a todas as funcionalidades</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Planilhas mensais ilimitadas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Relatórios detalhados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  {/* Mantém o botão original, mas com o onClick para o Stripe */}
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={openStripeCheckout}
                  >
                    Começar agora
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">1 mês grátis - não precisa de cartão!</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Junte-se a milhares de pessoas que já estão controlando suas finanças com o Simple Finance
          </p>
          {/* Mantém o botão original, mas com o onClick para o Stripe */}
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={openStripeCheckout} 
            className="group"
          >
            Criar conta gratuita
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CircleDollarSign className="h-6 w-6 text-primary" />
              <span className="font-semibold">Simple Finance</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Simple Finance. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
