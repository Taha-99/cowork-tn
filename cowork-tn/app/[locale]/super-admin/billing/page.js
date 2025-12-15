"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSupabaseClient } from "@/lib/supabase";

export default function BillingPage({ params }) {
  const { locale } = React.use(params);
  const [invoices, setInvoices] = React.useState([]);
  const [stats, setStats] = React.useState({
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    pendingInvoices: 0,
    collectionRate: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    loadBillingData();
  }, []);

  async function loadBillingData() {
    try {
      setIsLoading(true);
      const supabase = getSupabaseClient();
      
      // Fetch invoices with space information
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select(`
          *,
          spaces!inner (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (invoicesError) {
        console.error("Error loading invoices:", invoicesError);
        // Fallback to static data
        setInvoices([
          { id: "INV-2024-001", space: "Hive Tunis", amount: 890, status: "paid", date: "2024-03-15", plan: "Pro" },
          { id: "INV-2024-002", space: "Tech Hub Sfax", amount: 1450, status: "paid", date: "2024-03-14", plan: "Enterprise" },
          { id: "INV-2024-003", space: "LaStation Sousse", amount: 450, status: "pending", date: "2024-03-12", plan: "Starter" },
          { id: "INV-2024-004", space: "Digital Lab Bizerte", amount: 890, status: "paid", date: "2024-03-10", plan: "Pro" },
          { id: "INV-2024-005", space: "CoWork Hammamet", amount: 450, status: "overdue", date: "2024-03-01", plan: "Starter" },
          { id: "INV-2024-006", space: "Startup Factory", amount: 890, status: "paid", date: "2024-02-28", plan: "Pro" },
        ]);
      } else {
        // Transform the data
        const transformedInvoices = invoicesData.map(invoice => ({
          id: invoice.invoice_number || `INV-${invoice.id}`,
          space: invoice.spaces?.name || "Espace inconnu",
          amount: invoice.amount || 0,
          status: invoice.status || "pending",
          date: invoice.created_at?.split('T')[0] || "Date inconnue",
          plan: invoice.plan || "Starter"
        }));
        setInvoices(transformedInvoices);
      }

      // Calculate stats
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: spacesData } = await supabase
        .from("spaces")
        .select("status, plan, monthly_fee")
        .eq("status", "active");

      const { data: monthlyInvoices } = await supabase
        .from("invoices")
        .select("amount, status, created_at")
        .gte("created_at", `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lte("created_at", `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`);

      // Calculate statistics
      const monthlyRevenue = monthlyInvoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
      const activeSubscriptions = spacesData?.length || 0;
      const pendingInvoices = invoicesData?.filter(inv => inv.status === "pending").length || 0;
      const paidInvoices = invoicesData?.filter(inv => inv.status === "paid").length || 0;
      const totalInvoices = invoicesData?.length || 0;
      const collectionRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

      setStats({
        monthlyRevenue,
        activeSubscriptions,
        pendingInvoices,
        collectionRate
      });

    } catch (err) {
      console.error("Error loading billing data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const statsData = [
    { 
      title: "Revenus ce mois", 
      value: `${stats.monthlyRevenue.toLocaleString('fr-FR')} TND`, 
      change: "+12.5%", 
      trend: "up", 
      icon: DollarSign, 
      color: "bg-green-500" 
    },
    { 
      title: "Abonnements actifs", 
      value: stats.activeSubscriptions.toString(), 
      change: "+3", 
      trend: "up", 
      icon: CreditCard, 
      color: "bg-blue-500" 
    },
    { 
      title: "Factures en attente", 
      value: stats.pendingInvoices.toString(), 
      change: "-2", 
      trend: "down", 
      icon: Clock, 
      color: "bg-amber-500" 
    },
    { 
      title: "Taux de recouvrement", 
      value: `${stats.collectionRate}%`, 
      change: "+1.8%", 
      trend: "up", 
      icon: Receipt, 
      color: "bg-purple-500" 
    },
  ];

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === "" || 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.space.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      paid: { label: "Payée", icon: CheckCircle, class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      pending: { label: "En attente", icon: Clock, class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      overdue: { label: "En retard", icon: XCircle, class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    const { label, icon: Icon, class: className } = config[status];
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Facturation
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les revenus et factures de la plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Receipt className="mr-2 h-4 w-4" />
            Créer une facture
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`h-4 w-4 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                      <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-2xl ${stat.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Factures Récentes</CardTitle>
              <CardDescription>Historique des factures de la plateforme</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Espace</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-foreground">{invoice.id}</TableCell>
                  <TableCell>{invoice.space}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{invoice.amount} TND</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {invoice.date}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
