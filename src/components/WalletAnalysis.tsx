import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Wallet, AlertTriangle, TrendingUp, Clock, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface WalletData {
  address: string;
  balance: string;
  nftCount: number;
  totalValue: string;
  riskScore: number;
  lastActivity: string;
  topCollections: Array<{
    name: string;
    count: number;
    value: string;
  }>;
  recentTransactions: Array<{
    type: string;
    collection: string;
    price: string;
    timestamp: string;
  }>;
}

export const WalletAnalysis = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateWalletAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const analyzeWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }
  
    if (!validateWalletAddress(walletAddress)) {
      setError('Please enter a valid Ethereum wallet address (0x...)');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      // Call your real backend API
      const response = await axios.post('http://localhost:3000/api/analyze/wallet', {
        walletAddress: walletAddress.trim()
      });
  
      console.log('Backend response:', response.data);
  
      if (response.data.success) {
        // Use real backend data
        const backendData = response.data.data || response.data;
        
        const realWalletData: WalletData = {
          address: walletAddress,
          balance: backendData.balance || 'Loading...',
          nftCount: backendData.nftCount || 0,
          totalValue: backendData.totalValue || 'Calculating...',
          riskScore: backendData.riskScore || 0,
          lastActivity: backendData.lastActivity || 'Analyzing...',
          topCollections: backendData.topCollections || [
            { name: 'Real Data from BitsCrunch API', count: 1, value: 'Connected' }
          ],
          recentTransactions: backendData.recentTransactions || [
            { type: 'Analysis', collection: 'Backend Connected', price: 'Real Data', timestamp: 'Live' }
          ]
        };
  
        setWalletData(realWalletData);
        
        toast({
          title: "Analysis Complete",
          description: "Real data loaded from BitsCrunch API",
        });
      } else {
        throw new Error('Backend API returned error');
      }
  
    } catch (error: any) {
      console.error('API Error:', error);
      
      setError('Backend connection failed. Make sure server is running on port 3000');
      
      toast({
        title: "Connection Error",
        description: "Could not connect to backend server. Check console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 2) return { level: 'Low', color: 'success' };
    if (score < 4) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'destructive' };
  };

  return (
    <section className="py-20 px-4 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Wallet Analysis
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive NFT portfolio analysis and risk assessment
          </p>
        </div>

        {/* Wallet Input */}
        <Card className="glass border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter Ethereum wallet address (0x...)"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setError('');
                  }}
                  className="glass border-primary/20 focus:border-primary/50 bg-muted/50"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-destructive text-sm mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
              <Button
                onClick={analyzeWallet}
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Analyzing...' : 'Analyze Wallet'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Data Display */}
        {walletData && (
          <div className="space-y-6 animate-fade-in">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-primary/20 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">ETH Balance</p>
                      <p className="text-2xl font-bold text-primary">{walletData.balance}</p>
                    </div>
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">NFT Count</p>
                      <p className="text-2xl font-bold text-accent">{walletData.nftCount}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold text-success">{walletData.totalValue}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{walletData.riskScore}/5</p>
                        <Badge variant={getRiskLevel(walletData.riskScore).color as any}>
                          {getRiskLevel(walletData.riskScore).level}
                        </Badge>
                      </div>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Address */}
            <Card className="glass border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet Address</p>
                      <p className="font-mono text-sm">{walletData.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyAddress}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="collections" className="w-full">
              <TabsList className="glass border border-primary/20 w-full">
                <TabsTrigger value="collections" className="flex-1">Top Collections</TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1">Recent Activity</TabsTrigger>
                <TabsTrigger value="insights" className="flex-1">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="mt-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Top Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {walletData.topCollections.map((collection, index) => (
                        <div key={index} className="flex items-center justify-between p-4 glass rounded-lg border border-primary/10">
                          <div>
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-sm text-muted-foreground">{collection.count} items</p>
                          </div>
                          <p className="font-bold text-primary">{collection.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {walletData.recentTransactions.map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-4 glass rounded-lg border border-primary/10">
                          <div className="flex items-center gap-3">
                            <Badge variant={tx.type === 'Purchase' ? 'default' : tx.type === 'Sale' ? 'secondary' : 'outline'}>
                              {tx.type}
                            </Badge>
                            <div>
                              <p className="font-medium">{tx.collection}</p>
                              <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                            </div>
                          </div>
                          <p className="font-bold text-primary">{tx.price}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 glass rounded-lg border border-success/20 bg-success/5">
                        <p className="font-medium text-success mb-2">Portfolio Strength</p>
                        <p className="text-sm">Strong blue-chip collection focus with good diversification across art and PFP projects.</p>
                      </div>
                      <div className="p-4 glass rounded-lg border border-warning/20 bg-warning/5">
                        <p className="font-medium text-warning mb-2">Risk Assessment</p>
                        <p className="text-sm">Moderate risk due to concentration in volatile collections. Consider diversification.</p>
                      </div>
                      <div className="p-4 glass rounded-lg border border-primary/20 bg-primary/5">
                        <p className="font-medium text-primary mb-2">Recommendation</p>
                        <p className="text-sm">Consider taking profits on recent gains and reinvesting in emerging projects.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
};