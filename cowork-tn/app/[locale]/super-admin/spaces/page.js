"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getSupabaseClient } from "@/lib/supabase";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";

export default function SpacesManagementPage({ params }) {
  const { locale } = React.use(params);
  const [spaces, setSpaces] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newSpaceData, setNewSpaceData] = React.useState({
    name: "",
    location: "",
    ownerName: "",
    ownerEmail: "",
    plan: "starter"
  });

  React.useEffect(() => {
    loadSpaces();
  }, []);

  async function loadSpaces() {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("spaces")
        .select(`
          *,
          owner:profiles!spaces_owner_id_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (data) {
        setSpaces(data);
      }
    } catch (err) {
      console.error("Error loading spaces:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSpace() {
    try {
      const supabase = getSupabaseClient();
      
      // First, create or get the owner profile
      const { data: ownerData, error: ownerError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newSpaceData.ownerEmail)
        .single();

      let ownerId;
      
      if (ownerError || !ownerData) {
        // Create new profile for owner
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            full_name: newSpaceData.ownerName,
            email: newSpaceData.ownerEmail,
            role: "admin"
          })
          .select()
          .single();

        if (createError) throw createError;
        ownerId = newProfile.id;
      } else {
        ownerId = ownerData.id;
      }

      // Create the space
      const { data: spaceData, error: spaceError } = await supabase
        .from("spaces")
        .insert({
          name: newSpaceData.name,
          location: newSpaceData.location,
          owner_id: ownerId,
          plan: newSpaceData.plan,
          status: "pending"
        })
        .select()
        .single();

      if (spaceError) throw spaceError;

      // Update owner's space_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ space_id: spaceData.id })
        .eq("id", ownerId);

      if (updateError) throw updateError;

      // Reset form and refresh data
      setNewSpaceData({
        name: "",
        location: "",
        ownerName: "",
        ownerEmail: "",
        plan: "starter"
      });
      setIsDialogOpen(false);
      loadSpaces();
      
      alert("Espace créé avec succès!");
    } catch (error) {
      console.error("Error creating space:", error);
      alert("Erreur lors de la création de l'espace: " + error.message);
    }
  }

  // Mock data for demo
  const mockSpaces = spaces.length > 0 ? spaces : [
    {
      id: 1,
      name: "Hive Tunis",
      city: "Tunis",
      address: "12 Rue de la Liberté",
      status: "active",
      capacity: 100,
      members_count: 142,
      plan: "Pro",
      owner: { full_name: "Karim Ben Ali", email: "karim@hivetunis.tn" },
      created_at: "2024-01-15",
      monthly_revenue: 4500,
    },
    {
      id: 2,
      name: "LaStation Sousse",
      city: "Sousse",
      address: "45 Avenue Bourguiba",
      status: "trial",
      capacity: 60,
      members_count: 58,
      plan: "Starter",
      owner: { full_name: "Sami Trabelsi", email: "sami@lastation.tn" },
      created_at: "2024-02-20",
      monthly_revenue: 1200,
    },
    {
      id: 3,
      name: "Tech Hub Sfax",
      city: "Sfax",
      address: "78 Rue de l'Industrie",
      status: "active",
      capacity: 80,
      members_count: 89,
      plan: "Enterprise",
      owner: { full_name: "Amine Gharbi", email: "amine@techhub.tn" },
      created_at: "2023-11-10",
      monthly_revenue: 8900,
    },
    {
      id: 4,
      name: "CoWork Hammamet",
      city: "Hammamet",
      address: "23 Zone Touristique",
      status: "pending",
      capacity: 40,
      members_count: 0,
      plan: "Starter",
      owner: { full_name: "Leila Mansour", email: "leila@cowork-hammamet.tn" },
      created_at: "2024-03-01",
      monthly_revenue: 0,
    },
    {
      id: 5,
      name: "Digital Lab Bizerte",
      city: "Bizerte",
      address: "56 Rue du Port",
      status: "active",
      capacity: 50,
      members_count: 34,
      plan: "Pro",
      owner: { full_name: "Mohamed Riahi", email: "mohamed@digitallab.tn" },
      created_at: "2024-01-28",
      monthly_revenue: 2800,
    },
    {
      id: 6,
      name: "Startup Factory Monastir",
      city: "Monastir",
      address: "89 Avenue de la République",
      status: "suspended",
      capacity: 70,
      members_count: 12,
      plan: "Pro",
      owner: { full_name: "Fatma Bouzid", email: "fatma@startupfactory.tn" },
      created_at: "2023-09-05",
      monthly_revenue: 0,
    },
  ];

  const getStatusBadge = (status) => {
    const config = {
      active: { label: "Actif", icon: CheckCircle, class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      trial: { label: "Essai", icon: Clock, class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      pending: { label: "En attente", icon: Clock, class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      suspended: { label: "Suspendu", icon: XCircle, class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    const { label, icon: Icon, class: className } = config[status] || config.pending;
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const filteredSpaces = mockSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.owner?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || space.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockSpaces.length,
    active: mockSpaces.filter(s => s.status === "active").length,
    trial: mockSpaces.filter(s => s.status === "trial").length,
    pending: mockSpaces.filter(s => s.status === "pending").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Gestion des Espaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous les espaces de coworking de la plateforme
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un espace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel espace</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel espace de coworking à la plateforme
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de l'espace</Label>
                <Input 
                  id="name" 
                  placeholder="CoWork Hub" 
                  value={newSpaceData.name}
                  onChange={(e) => setNewSpaceData({...newSpaceData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localisation</Label>
                <Input 
                  id="location" 
                  placeholder="Tunis, Centre Ville" 
                  value={newSpaceData.location}
                  onChange={(e) => setNewSpaceData({...newSpaceData, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Nom du propriétaire</Label>
                  <Input 
                    id="ownerName" 
                    placeholder="Ahmed Ben Ali"
                    value={newSpaceData.ownerName}
                    onChange={(e) => setNewSpaceData({...newSpaceData, ownerName: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ownerEmail">Email du propriétaire</Label>
                  <Input 
                    id="ownerEmail" 
                    type="email" 
                    placeholder="owner@example.com"
                    value={newSpaceData.ownerEmail}
                    onChange={(e) => setNewSpaceData({...newSpaceData, ownerEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Plan</Label>
                <select
                  id="plan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newSpaceData.plan}
                  onChange={(e) => setNewSpaceData({...newSpaceData, plan: e.target.value})}
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateSpace}>
                Créer l'espace
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("all")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Espaces</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setFilter("active")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2.5">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setFilter("trial")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.trial}</p>
                <p className="text-sm text-muted-foreground">En Essai</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-amber-500/50 transition-colors" onClick={() => setFilter("pending")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2.5">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">En Attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ville ou propriétaire..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "trial", "pending", "suspended"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" && "Tous"}
                  {f === "active" && "Actifs"}
                  {f === "trial" && "Essai"}
                  {f === "pending" && "En attente"}
                  {f === "suspended" && "Suspendus"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spaces Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Espace</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Membres</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Revenus</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
                        {space.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{space.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {space.city}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{space.owner?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{space.owner?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{space.members_count}</span>
                      <span className="text-muted-foreground">/ {space.capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{space.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{space.monthly_revenue?.toLocaleString()} TND</span>
                    <span className="text-xs text-muted-foreground">/mois</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(space.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSpaces.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">Aucun espace trouvé</p>
              <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
