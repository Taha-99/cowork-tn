"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export function AddMemberDialog({ spaceId, onMemberAdded, labels = {} }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "member",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          space_id: spaceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add member");
      }

      // Success
      setFormData({ email: "", full_name: "", phone: "", role: "member" });
      setOpen(false);
      
      // Refresh members list
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Default labels for when not provided
  const defaultLabels = {
    addMember: "Add Member",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone (Optional)",
    role: "Role",
    member: "Member",
    admin: "Admin",
    cancel: "Cancel",
    add: "Add",
    adding: "Adding...",
  };

  const l = { ...defaultLabels, ...labels };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl px-4">
          <UserPlus className="mr-2 h-4 w-4" />
          {l.addMember}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{l.addMember}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{l.fullName}</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{l.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{l.phone}</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+216 XX XXX XXXX"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{l.role}</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="h-10 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="member">{l.member}</option>
              <option value="admin">{l.admin}</option>
            </select>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {l.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? l.adding : l.add}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
