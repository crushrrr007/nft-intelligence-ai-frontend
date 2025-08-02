import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Image, TrendingUp, Users, Activity, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface CollectionData {
  name: string;
  description: string;
  floorPrice: string;
  totalVolume: string;
  holders: number;
  items: number;
  marketRank: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  volumeHistory: Array<{
    date: string;
    volume: number;
  }>;
  rarity: Array<{
    trait: string;
    percentage: number;
    floor: string;
  }>;
  socialMetrics: {
    twitter: number;
    discord: number;
    website: boolean;
  };
}

export const CollectionAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const popularCollections = [
    'Bored Ape Yacht Club',
    'CryptoPunks',
    'Azuki',
    'Doodles',
    'Art Blocks Curated',
    'Pudgy Penguins'
  ];

  const searchCollection = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/analyze/collection', {
        name: searchQuery
      });

      setCollectionData(response.data);
    } catch (error) {
      // Demo data for when API is not available
      const demoData: CollectionData = {
        name: searchQuery,
        description: "A premium NFT collection featuring unique digital art with strong community focus and utility.",
        floorPrice: "2.8 ETH",
        totalVolume: "45,234 ETH",
        holders: 8642,
        items: 10000,
        marketRank: 15,
        priceHistory: [
          { date: '7d ago', price: 2.2 },
          { date: '6d ago', price: 2.4 },
          { date: '5d ago', price: 2.1 },
          { date: '4d ago', price: 2.6 },
          { date: '3d ago', price: 2.9 },
          { date: '2d ago', price: 2.7 },
          { date: '1d ago', price: 2.8 }
        ],
        volumeHistory: [
          { date: '7d ago', volume: 120 },
          { date: '6d ago', volume: 85 },
          { date: '5d ago', volume: 95 },
          { date: '4d ago', volume: 160 },
          { date: '3d ago', volume: 200 },
          { date: '2d ago', volume: 145 },
          { date: '1d ago', volume: 180 }
        ],
        rarity: [
          { trait: 'Background: Rare', percentage: 2.5, floor: '15.2 ETH' },
          { trait: 'Eyes: Laser', percentage: 1.8, floor: '12.8 ETH' },
          { trait: 'Mouth: Gold', percentage: 5.2, floor: '8.4 ETH' },
          { trait: 'Hat: Crown', percentage: 3.1, floor: '11.2 ETH' }
        ],
        socialMetrics: {
          twitter: 125000,
          discord: 45000,
          website: true
        }
      };

      setCollectionData(demoData);
      toast({
        title: "Demo Mode",
        description: "Showing sample collection data - API endpoint not available",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Show suggestions based on input
    if (value.length > 0) {
      const filtered = popularCollections.filter(collection =>
        collection.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <section className="py-20 px-4 bg-muted/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Collection Analysis
          </h2>
          <p className="text-muted-foreground text-lg">
            Deep dive into NFT collection metrics and performance
          </p>
        </div>

        {/* Search Interface */}
        <Card className="glass border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search for NFT collections (e.g., Bored Ape Yacht Club)"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="glass border-primary/20 focus:border-primary/50 bg-muted/50"
                    disabled={isLoading}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <div className="glass border border-primary/20 rounded-lg overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectSuggestion(suggestion)}
                            className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={searchCollection}
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
              
              {/* Popular Collections */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Popular collections:</p>
                <div className="flex flex-wrap gap-2">
                  {popularCollections.slice(0, 4).map((collection, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(collection)}
                      className="glass border-primary/20 hover:bg-primary/10 text-xs"
                    >
                      {collection}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Data Display */}
        {collectionData && (
          <div className="space-y-8 animate-fade-in">
            {/* Collection Overview */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-primary">{collectionData.name}</CardTitle>
                    <p className="text-muted-foreground mt-2">{collectionData.description}</p>
                  </div>
                  <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">
                    Rank #{collectionData.marketRank}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{collectionData.floorPrice}</p>
                    <p className="text-sm text-muted-foreground">Floor Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{collectionData.totalVolume}</p>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{collectionData.holders.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Holders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">{collectionData.items.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price History */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Floor Price (7 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={collectionData.priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
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
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Volume History */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Volume (7 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={collectionData.volumeHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Bar
                          dataKey="volume"
                          fill="hsl(var(--accent))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rarity and Social Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rarity Analysis */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning" />
                    Top Rare Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collectionData.rarity.map((trait, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{trait.trait}</span>
                          <span className="text-sm text-primary font-bold">{trait.floor}</span>
                        </div>
                        <Progress value={trait.percentage * 20} className="h-2" />
                        <p className="text-xs text-muted-foreground">{trait.percentage}% rarity</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Metrics */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-success" />
                    Community & Social
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">X</span>
                        </div>
                        <span>Twitter Followers</span>
                      </div>
                      <span className="font-bold text-primary">{collectionData.socialMetrics.twitter.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">D</span>
                        </div>
                        <span>Discord Members</span>
                      </div>
                      <span className="font-bold text-primary">{collectionData.socialMetrics.discord.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">W</span>
                        </div>
                        <span>Official Website</span>
                      </div>
                      <Badge variant={collectionData.socialMetrics.website ? "default" : "destructive"}>
                        {collectionData.socialMetrics.website ? "Active" : "None"}
                      </Badge>
                    </div>

                    {/* Community Score */}
                    <div className="mt-6 p-4 glass rounded-lg border border-success/20 bg-success/5">
                      <p className="font-medium text-success mb-2">Community Score: A+</p>
                      <p className="text-sm">Strong community engagement with active social presence across all platforms.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};