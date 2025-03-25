import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Gauge, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Blockchain Indexing Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Index Solana blockchain data directly into your Postgres database.
            No RPC, Geyser, or Validator infrastructure needed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Database Integration</h3>
            <p className="text-muted-foreground">
              Connect your Postgres database and start indexing blockchain data in minutes.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Real-time Data</h3>
            <p className="text-muted-foreground">
              Get live blockchain data through Helius webhooks with automatic syncing.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Your data is protected with enterprise-grade security and reliability.
            </p>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg">
            <Link href="/auth">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}