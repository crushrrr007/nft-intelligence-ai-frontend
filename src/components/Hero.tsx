import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/nft-hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary-glow rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
            NFT Intelligence
            <span className="block text-5xl md:text-7xl text-foreground mt-2">AI</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-Powered NFT Analytics Platform
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of artificial intelligence to analyze, predict, and optimize your NFT investments with real-time market insights and risk assessments.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="glass px-4 py-2 rounded-full border border-primary/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm">Real-time Analytics</span>
              </div>
            </div>
            <div className="glass px-4 py-2 rounded-full border border-primary/20">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-warning" />
                <span className="text-sm">Risk Assessment</span>
              </div>
            </div>
            <div className="glass px-4 py-2 rounded-full border border-primary/20">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-sm">AI Predictions</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8 py-6 text-lg font-semibold hover-lift glow-primary"
            >
              Start Analysis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="glass border-primary/30 text-foreground hover:bg-primary/10 px-8 py-6 text-lg hover-lift"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};