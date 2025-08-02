import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, TrendingDown, Activity, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface RiskMetrics {
  overallScore: number;
  marketRisk: number;
  liquidityRisk: number;
  volatilityRisk: number;
  projectRisk: number;
  recommendations: string[];
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
  }>;
  riskFactors: Array<{
    factor: string;
    score: number;
    impact: 'high' | 'medium' | 'low';
  }>;
}

const COLORS = {
  low: '#22c55e',
  medium: '#f59e0b', 
  high: '#ef4444'
};

export const RiskAssessment = () => {
  const [riskData, setRiskData] = useState<RiskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const generateRiskData = (): RiskMetrics => {
    return {
      overallScore: 6.8,
      marketRisk: 7.2,
      liquidityRisk: 5.4,
      volatilityRisk: 8.1,
      projectRisk: 4.9,
      recommendations: [
        "Consider diversifying across multiple blue-chip collections",
        "Monitor floor price movements for exit opportunities",
        "Reduce exposure to high-volatility collections",
        "Set stop-loss orders for protection"
      ],
      alerts: [
        { type: 'warning', message: 'High volatility detected in Art Blocks collection' },
        { type: 'error', message: 'Liquidity concerns for emerging projects' },
        { type: 'info', message: 'Market sentiment trending bearish this week' }
      ],
      riskFactors: [
        { factor: 'Market Correlation', score: 8.5, impact: 'high' },
        { factor: 'Collection Age', score: 3.2, impact: 'low' },
        { factor: 'Holder Concentration', score: 6.8, impact: 'medium' },
        { factor: 'Trading Volume', score: 7.1, impact: 'high' },
        { factor: 'Social Sentiment', score: 4.5, impact: 'medium' }
      ]
    };
  };

  useEffect(() => {
    // Simulate loading and data fetch
    const timer = setTimeout(() => {
      setRiskData(generateRiskData());
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRiskData(generateRiskData());
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const getRiskLevel = (score: number) => {
    if (score < 4) return { level: 'Low', color: 'success', bgColor: 'bg-success/10' };
    if (score < 7) return { level: 'Medium', color: 'warning', bgColor: 'bg-warning/10' };
    return { level: 'High', color: 'destructive', bgColor: 'bg-destructive/10' };
  };

  const pieData = riskData ? [
    { name: 'Market Risk', value: riskData.marketRisk, color: COLORS.high },
    { name: 'Liquidity Risk', value: riskData.liquidityRisk, color: COLORS.medium },
    { name: 'Volatility Risk', value: riskData.volatilityRisk, color: COLORS.high },
    { name: 'Project Risk', value: riskData.projectRisk, color: COLORS.low }
  ] : [];

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Risk Assessment
            </h2>
            <p className="text-muted-foreground text-lg">Analyzing portfolio risk factors...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass border-primary/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted/20 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-muted/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Risk Assessment
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
            AI-powered portfolio risk analysis and recommendations
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {riskData && (
          <div className="space-y-8 animate-fade-in">
            {/* Overall Risk Score */}
            <Card className="glass border-primary/20 glow">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative">
                        <div 
                          className="absolute inset-0 rounded-full border-8 border-transparent"
                          style={{
                            borderTopColor: riskData.overallScore < 4 ? COLORS.low : 
                                          riskData.overallScore < 7 ? COLORS.medium : COLORS.high,
                            transform: `rotate(${(riskData.overallScore / 10) * 360}deg)`,
                            transition: 'all 1s ease-out'
                          }}
                        />
                        <div className="text-center">
                          <p className="text-3xl font-bold">{riskData.overallScore}</p>
                          <p className="text-sm text-muted-foreground">/ 10</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-2">Overall Risk Score</h3>
                      <Badge 
                        variant={getRiskLevel(riskData.overallScore).color as any}
                        className="text-lg px-4 py-2"
                      >
                        {getRiskLevel(riskData.overallScore).level} Risk
                      </Badge>
                      <p className="text-muted-foreground mt-2">
                        Based on market analysis and portfolio composition
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Categories */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Risk Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Market Risk</span>
                        <span className="text-sm text-destructive font-bold">{riskData.marketRisk}/10</span>
                      </div>
                      <Progress value={riskData.marketRisk * 10} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Liquidity Risk</span>
                        <span className="text-sm text-warning font-bold">{riskData.liquidityRisk}/10</span>
                      </div>
                      <Progress value={riskData.liquidityRisk * 10} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Volatility Risk</span>
                        <span className="text-sm text-destructive font-bold">{riskData.volatilityRisk}/10</span>
                      </div>
                      <Progress value={riskData.volatilityRisk * 10} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Project Risk</span>
                        <span className="text-sm text-success font-bold">{riskData.projectRisk}/10</span>
                      </div>
                      <Progress value={riskData.projectRisk * 10} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution Chart */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts and Warnings */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        alert.type === 'error' ? 'border-destructive/20 bg-destructive/5' :
                        alert.type === 'warning' ? 'border-warning/20 bg-warning/5' :
                        'border-primary/20 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {alert.type === 'error' ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : alert.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                        <p className="font-medium">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Key Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData.riskFactors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="factor" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Bar
                        dataKey="score"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 glass rounded-lg border border-success/10 bg-success/5">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};