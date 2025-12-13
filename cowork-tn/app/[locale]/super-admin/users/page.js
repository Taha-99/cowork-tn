"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getSupabaseClient } from "@/lib/supabase";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  Building2,
  User,
  Mail,
  Calendar,
  Filter,
  UserPlus,
  Crown,
} from "lucide-react";

export default function UsersManagementPage({ params }) {
  const { locale } = React.use(params);
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  React.useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Mock data for demo
  const mockUsers = users.length > 0 ? users : [
    {
      id: "1",
      full_name: "Admin Principal",
      email: "super@cowork.tn",
      role: "super_admin",
      phone: "+216 XX XXX XXX",
      avatar_url: null,
      created_at: "2023-06-01",
      last_sign_in: "2024-03-15 10:30",
      space_name: null,
    },
    {
      id: "2",
      full_name: "Karim Ben Ali",
      email: "admin@cowork.tn",
      role: "admin",
      phone: "+216 55 123 456",
      avatar_url: null,
      created_at: "2024-01-15",
      last_sign_in: "2024-03-14 15:22",
      space_name: "Hive Tunis",
    },
    {
      id: "3",
      full_name: "Sami Trabelsi",
      email: "user@cowork.tn",
      role: "coworker",
      phone: "+216 55 789 012",
      avatar_url: null,
      created_at: "2024-02-20",
      last_sign_in: "2024-03-15 09:45",
      space_name: "Hive Tunis",
    },
    {
      id: "4",
      full_name: "Amine Gharbi",
      email: "amine@techhub.tn",
      role: "admin",
      phone: "+216 55 345 678",
      avatar_url: null,
      created_at: "2023-11-10",
      last_sign_in: "2024-03-13 11:00",
      space_name: "Tech Hub Sfax",
    },
    {
      id: "5",
      full_name: "Leila Mansour",
      email: "leila@example.com",
      role: "coworker",
      phone: "+216 55 901 234",
      avatar_url: null,
      created_at: "2024-03-01",
      last_sign_in: "2024-03-15 08:15",
      space_name: "Tech Hub Sfax",
    },
    {
      id: "6",
      full_name: "Mohamed Riahi",
      email: "mohamed@digitallab.tn",
      role: "admin",
      phone: "+216 55 567 890",
      avatar_url: null,
      created_at: "2024-01-28",
      last_sign_in: "2024-03-12 16:30",
      space_name: "Digital Lab Bizerte",
    },
    {
      id: "7",
      full_name: "Fatma Bouzid",
      email: "fatma@example.com",
      role: "coworker",
      phone: "+216 55 234 567",
      avatar_url: null,
      created_at: "2023-09-05",
      last_sign_in: "2024-03-10 14:00",
      space_name: "LaStation Sousse",
    },
  ];

  const getRoleBadge = (role) => {
    const config = {
      super_admin: { label: "Super Admin", icon: Crown, class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      admin: { label: "Admin", icon: Shield, class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      coworker: { label: "Coworker", icon: User, class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    };
    const { label, icon: Icon, class: className } = config[role] || config.coworker;
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.space_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockUsers.length,
    super_admins: mockUsers.filter(u => u.role === "super_admin").length,
    admins: mockUsers.filter(u => u.role === "admin").length,
    coworkers: mockUsers.filter(u => u.role === "coworker").length,
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setRoleFilter("all")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-500/50 transition-colors" onClick={() => setRoleFilter("super_admin")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-2.5">
                <Crown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.super_admins}</p>
                <p className="text-sm text-muted-foreground">Super Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setRoleFilter("admin")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2.5">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setRoleFilter("coworker")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2.5">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.coworkers}</p>
                <p className="text-sm text-muted-foreground">Coworkers</p>
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
                placeholder="Rechercher par nom, email ou espace..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "all", label: "Tous" },
                { key: "super_admin", label: "Super Admins" },
                { key: "admin", label: "Admins" },
                { key: "coworker", label: "Coworkers" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={roleFilter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Espace</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className={
                          user.role === "super_admin" ? "bg-red-500 text-white" :
                          user.role === "admin" ? "bg-blue-500 text-white" :
                          "bg-green-500 text-white"
                        }>
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {user.space_name ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.space_name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.phone || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {user.last_sign_in || "Jamais"}
                    </div>
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
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Changer le rôle
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">Aucun utilisateur trouvé</p>
              <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
