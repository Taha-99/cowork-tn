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

export default function BillingPage({ params }) {
  const { locale } = React.use(params);

  const stats = [
    { title: "Revenus ce mois", value: "45,230 TND", change: "+12.5%", trend: "up", icon: DollarSign, color: "bg-green-500" },
    { title: "Abonnements actifs", value: "24", change: "+3", trend: "up", icon: CreditCard, color: "bg-blue-500" },
    { title: "Factures en attente", value: "5", change: "-2", trend: "down", icon: Clock, color: "bg-amber-500" },
    { title: "Taux de recouvrement", value: "94.2%", change: "+1.8%", trend: "up", icon: Receipt, color: "bg-purple-500" },
  ];

  const invoices = [
    { id: "INV-2024-001", space: "Hive Tunis", amount: 890, status: "paid", date: "2024-03-15", plan: "Pro" },
    { id: "INV-2024-002", space: "Tech Hub Sfax", amount: 1450, status: "paid", date: "2024-03-14", plan: "Enterprise" },
    { id: "INV-2024-003", space: "LaStation Sousse", amount: 450, status: "pending", date: "2024-03-12", plan: "Starter" },
    { id: "INV-2024-004", space: "Digital Lab Bizerte", amount: 890, status: "paid", date: "2024-03-10", plan: "Pro" },
    { id: "INV-2024-005", space: "CoWork Hammamet", amount: 450, status: "overdue", date: "2024-03-01", plan: "Starter" },
    { id: "INV-2024-006", space: "Startup Factory", amount: 890, status: "paid", date: "2024-02-28", plan: "Pro" },
  ];

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
        {stats.map((stat) => {
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
              {invoices.map((invoice) => (
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
