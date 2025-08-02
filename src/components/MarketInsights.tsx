import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface MarketData {
  totalVolume: string;
  dailyTransactions: number;
  averagePrice: string;
  marketCap: string;
  topGainers: Array<{
    name: string;
    change: string;
    price: string;
    volume: string;
  }>;
  topLosers: Array<{
    name: string;
    change: string;
    price: string;
    volume: string;
  }>;
  volumeData: Array<{
    time: string;
    volume: number;
  }>;
  priceData: Array<{
    time: string;
    price: number;
  }>;
}

export const MarketInsights = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchMarketData = async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.get('http://localhost:3000/api/market/insights');
      setMarketData(response.data);
    } catch (error) {
      // Demo data for when API is not available
      const demoData: MarketData = {
        totalVolume: '1,234.5 ETH',
        dailyTransactions: 15847,
        averagePrice: '0.85 ETH',
        marketCap: '$2.1B',
        topGainers: [
          { name: 'Art Blocks Curated', change: '+24.5%', price: '2.8 ETH', volume: '145 ETH' },
          { name: 'Chromie Squiggle', change: '+18.2%', price: '1.2 ETH', volume: '89 ETH' },
          { name: 'Ringers', change: '+15.7%', price: '0.95 ETH', volume: '67 ETH' }
        ],
        topLosers: [
          { name: 'Cool Cats', change: '-12.3%', price: '0.45 ETH', volume: '23 ETH' },
          { name: 'Lazy Lions', change: '-8.9%', price: '0.32 ETH', volume: '18 ETH' },
          { name: 'Pudgy Penguins', change: '-7.2%', price: '1.8 ETH', volume: '156 ETH' }
        ],
        volumeData: [
          { time: '00:00', volume: 450 },
          { time: '04:00', volume: 320 },
          { time: '08:00', volume: 680 },
          { time: '12:00', volume: 890 },
          { time: '16:00', volume: 1200 },
          { time: '20:00', volume: 980 },
          { time: '24:00', volume: 1150 }
        ],
        priceData: [
          { time: '1h', price: 0.82 },
          { time: '2h', price: 0.84 },
          { time: '3h', price: 0.81 },
          { time: '4h', price: 0.86 },
          { time: '5h', price: 0.89 },
          { time: '6h', price: 0.85 },
          { time: 'Now', price: 0.85 }
        ]
      };

      setMarketData(demoData);
      toast({
        title: "Demo Mode",
        description: "Showing sample market data - API endpoint not available",
      });
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchMarketData();
    toast({
      title: "Data Refreshed",
      description: "Market data has been updated",
    });
  };

  if (isLoading && !marketData) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Market Insights
            </h2>
            <p className="text-muted-foreground text-lg">Loading real-time market data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass border-primary/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted/20 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Market Insights
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="glass border-primary/20 hover:bg-primary/10"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time NFT market analytics and trends
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {marketData && (
          <div className="space-y-8 animate-fade-in">
            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-primary/20 hover-lift glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="text-2xl font-bold text-primary">{marketData.totalVolume}</p>
                      <Badge variant="outline" className="text-success border-success/20 bg-success/10 mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.5%
                      </Badge>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold text-accent">{marketData.dailyTransactions.toLocaleString()}</p>
                      <Badge variant="outline" className="text-success border-success/20 bg-success/10 mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8.2%
                      </Badge>
                    </div>
                    <Activity className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Price</p>
                      <p className="text-2xl font-bold text-warning">{marketData.averagePrice}</p>
                      <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10 mt-2">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -3.1%
                      </Badge>
                    </div>
                    <BarChart3 className="w-8 h-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover-lift glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="text-2xl font-bold text-success">{marketData.marketCap}</p>
                      <Badge variant="outline" className="text-success border-success/20 bg-success/10 mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.7%
                      </Badge>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Data */}
            <Tabs defaultValue="volume" className="w-full">
              <TabsList className="glass border border-primary/20 w-full">
                <TabsTrigger value="volume" className="flex-1">Volume Chart</TabsTrigger>
                <TabsTrigger value="price" className="flex-1">Price Trends</TabsTrigger>
                <TabsTrigger value="gainers" className="flex-1">Top Movers</TabsTrigger>
              </TabsList>

              <TabsContent value="volume" className="mt-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      24h Trading Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={marketData.volumeData}>
                          <defs>
                            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#volumeGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="price" className="mt-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Price Movement (6h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketData.priceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--accent))"
                            strokeWidth={3}
                            dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gainers" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Gainers */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <TrendingUp className="w-5 h-5" />
                        Top Gainers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {marketData.topGainers.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 glass rounded-lg border border-success/10 bg-success/5">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Vol: {item.volume}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-success">{item.change}</p>
                              <p className="text-sm">{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Losers */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <TrendingDown className="w-5 h-5" />
                        Top Losers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {marketData.topLosers.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 glass rounded-lg border border-destructive/10 bg-destructive/5">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Vol: {item.volume}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-destructive">{item.change}</p>
                              <p className="text-sm">{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
};