import { Hero } from "@/components/Hero";
import { ChatInterface } from "@/components/ChatInterface";
import { WalletAnalysis } from "@/components/WalletAnalysis";
import { MarketInsights } from "@/components/MarketInsights";
import { CollectionAnalysis } from "@/components/CollectionAnalysis";
import { RiskAssessment } from "@/components/RiskAssessment";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ChatInterface />
      <WalletAnalysis />
      <MarketInsights />
      <CollectionAnalysis />
      <RiskAssessment />
    </div>
  );
};

export default Index;
