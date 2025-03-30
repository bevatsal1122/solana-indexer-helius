import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Gauge, Lock, ArrowRight, Zap, Server, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Hero section */}
        <div className="text-center mb-20 space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse">
              Now Live!
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse">
              Fastest Indexing Engine
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse">
              Scalable & Reliable
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 min-h-16">
            Solana Indexing Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Index Solana blockchain data directly into your Postgres database.
            No RPC, Geyser, or Validator infrastructure needed.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <Link href="/auth" className="flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
              <Link href="https://x.com/bevatsal1122" target="_blank">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Database className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Easy Database Integration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect your Postgres database and start indexing blockchain data in seconds with zero configuration.
            </p>
          </Card>

          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Gauge className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Real-time Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get live blockchain data through Helius webhooks with automatic syncing and millisecond latency on the Solana.
            </p>
          </Card>

          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Secure & Reliable</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your data is protected with enterprise-grade security and reliability with 99.9% uptime guarantee.
            </p>
          </Card>
          
          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">High Performance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Process thousands of transactions per second with our optimized indexing engine built for scale.
            </p>
          </Card>
          
          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Server className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Cloud Managed</h3>
            <p className="text-muted-foreground leading-relaxed">
              No infrastructure to maintain. We handle scaling, updates, and monitoring so you can focus on building.
            </p>
          </Card>
          
          <Card className="p-8 space-y-5 bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Code className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Infinite Scalability</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatically scale with your application&apos;s growth - handle millions of transactions without performance degradation or added complexity.
            </p>
          </Card>
        </div>

        {/* Tech Stack section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Powered by Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-card/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Helius</span>
              </div>
              <span className="text-sm text-muted-foreground">Blockchain Data</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-card/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">Redis</span>
              </div>
              <span className="text-sm text-muted-foreground">Cache & Queue</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-card/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">BullMQ</span>
              </div>
              <span className="text-sm text-muted-foreground">Job Processing</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-card/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500">Supabase</span>
              </div>
              <span className="text-sm text-muted-foreground">Auth & Storage</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto">
            Our optimized architecture combines Helius blockchain data, Redis caching and BullMQ for job processing, with Supabase authentication 
            to deliver lightning-fast, reliable indexing with minimal complexity.
          </p>
        </div>

        {/* CTA section */}
        <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.8))]" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to supercharge your Solana app?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start indexing Solana blockchain data into your database in minutes, not weeks.
          </p>
          
          <Button asChild size="lg" className="rounded-full px-8 py-6 h-auto text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group">
            <Link href="/auth" className="flex items-center gap-2">
              Get Started Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}