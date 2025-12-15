'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { addDays, startOfWeek, getISOWeek, isSameDay, isSameMonth, format } from "date-fns";
import { BookingDialog } from "@/components/booking-dialog";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const HOURS = Array.from({ length: 10 }, (_, index) => 9 + index); // 9h -> 18h
const HOUR_HEIGHT = 56;

export function InteractiveBookingsCalendar({ initialResources, initialBookings, initialMembers, spaceId, locale, loadError }) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources || []);
  const [bookings, setBookings] = useState(initialBookings || []);
  const [members, setMembers] = useState(initialMembers || []);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(null);

  // Create Supabase client for client-side operations
  const [supabase] = useState(() => getSupabaseClient());

  // Load members for admin
  useEffect(() => {
    // Always load members for admin bookings page
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, email')
        .eq('space_id', spaceId);

      if (error) throw error;
      setMembers(data || []);
      if (!data || data.length === 0) {
        console.warn('No members returned for space:', spaceId);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadBookings = async (weekStart) => {
    try {
      const weekEnd = addDays(weekStart, 7);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          status,
          resource_id,
          resource:resource_id(name),
          member:member_id(full_name)
        `)
        .eq('space_id', spaceId)
        .gte('start_time', weekStart.toISOString())
        .lt('start_time', weekEnd.toISOString());

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          space_id: spaceId
        })
        .select()
        .single();

      if (error) throw error;

      // Reload bookings
      await loadBookings(currentWeek);
      router.refresh();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', selectedBooking.id);

      if (error) throw error;

      // Reload bookings
      await loadBookings(currentWeek);
      router.refresh();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // Reload bookings
      await loadBookings(currentWeek);
      router.refresh();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  const handleSaveBooking = async (bookingData) => {
    if (dialogMode === 'create') {
      await handleCreateBooking(bookingData);
    } else {
      await handleUpdateBooking(bookingData);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleTimeSlotClick = (resourceId, hour) => {
    // Create a new booking at the clicked time slot
    const startTime = new Date(currentWeek);
    startTime.setHours(hour, 0, 0, 0);

    const newBooking = {
      resource_id: resourceId,
      start_time: startTime.toISOString(),
      end_time: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      status: 'confirmed'
    };

    setSelectedBooking(newBooking);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const navigateWeek = (direction) => {
    const newWeek = addDays(currentWeek, direction * 7);
    setCurrentWeek(newWeek);
    loadBookings(newWeek);
  };

  // Group bookings by resource
  const bookingsByResource = resources.map(resource => ({
    resource,
    bookings: bookings.filter(booking => booking.resource_id === resource.id)
  }));

  // Calculate booking position
  const bookingPosition = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startHours = start.getHours() + start.getMinutes() / 60;
    const endHours = end.getHours() + end.getMinutes() / 60;
    const top = Math.max(0, (startHours - HOURS[0]) * HOUR_HEIGHT);
    const height = Math.max(48, (endHours - startHours) * HOUR_HEIGHT);
    return { top, height };
  };

  // Resource status (simplified)
  const resourceStatus = (resourceId) => {
    const now = new Date();
    const resourceBookings = bookings.filter(b => b.resource_id === resourceId);
    return resourceBookings.some(booking => {
      const start = new Date(booking.start_time);
      const end = new Date(booking.end_time);
      return now >= start && now <= end;
    });
  };

  const today = new Date();
  const weekLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(currentWeek);
  const weekNumber = getISOWeek(currentWeek);
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeek, i);
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  });

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const startOfCalendar = new Date(currentWeek);
    startOfCalendar.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    return addDays(startOfCalendar, i);
  });

  const upcoming = bookings
    .filter(booking => new Date(booking.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 5);

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    checked_in: 'Présent',
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">Réservations</h1>
            <p className="text-muted-foreground">Glisser-déposer pour postes et salles. Stripe bloque les no-show.</p>
          </div>
          <Button
            className="w-fit rounded-xl"
            onClick={() => {
              setSelectedBooking(null);
              setDialogMode('create');
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réservation
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[400px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Mini Calendar */}
            <Card className="p-4">
              <div className="flex items-center justify-between text-sm font-medium mb-3">
                <span>{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(today)}</span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                {weekdayLabels.map((label, idx) => (
                  <span key={`${label}-${idx}`} className="font-semibold">
                    {label}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDays.slice(0, 35).map((day) => {
                  const isToday = isSameDay(day, today);
                  const inMonth = isSameMonth(day, today);
                  return (
                    <span
                      key={day.toISOString()}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : inMonth
                            ? "text-foreground hover:bg-muted"
                            : "text-muted-foreground"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  );
                })}
              </div>
            </Card>

            {/* Resources Status */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Mes ressources
              </h3>
              <div className="space-y-2">
                {resources?.length > 0 ? (
                  resources.map((resource) => {
                    const busy = resourceStatus(resource.id);
                    return (
                      <div key={resource.id} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                        <span className="text-sm font-medium">{resource.name}</span>
                        <Badge variant={busy ? "default" : "secondary"} className={busy ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : ""}>
                          {busy ? 'Occupé' : 'Libre'}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune ressource créée.</p>
                )}
              </div>
            </Card>

            {/* Upcoming Bookings */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Prochaines réservations
              </h3>
              <div className="space-y-2">
                {upcoming.length > 0 ? (
                  upcoming.map((booking) => (
                    <div key={booking.id} className="rounded-lg border border-border/50 p-3">
                      <p className="text-sm font-medium">{booking.member?.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{booking.resource?.name || 'Ressource'}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {timeFormatter.format(new Date(booking.start_time))} – {timeFormatter.format(new Date(booking.end_time))}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune réservation à venir.</p>
                )}
              </div>
            </Card>
          </aside>

          {/* Main Calendar */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">
                  {weekLabel} • Semaine {weekNumber}
                </p>
                <h2 className="text-xl font-display font-semibold">Planification hebdomadaire</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => navigateWeek(-1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => navigateWeek(1)}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid min-w-[720px] gap-4"
                style={{ gridTemplateColumns: `80px repeat(${Math.max(resources?.length || 1, 1)}, minmax(180px, 1fr))` }}
              >
                {/* Time Column */}
                <div className="space-y-1 pr-2 text-xs text-muted-foreground">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-14 flex items-start pt-1">
                      {hour}:00
                    </div>
                  ))}
                </div>

                {/* Resource Columns */}
                {(resources && resources.length > 0 ? resources : [{ id: "placeholder", name: "Aucune ressource" }]).map((resource) => (
                  <div key={resource.id} className="relative rounded-xl border border-border/50 bg-muted/20" style={{ height: HOURS.length * HOUR_HEIGHT + 8 }}>
                    <div className="sticky top-0 border-b border-border/50 bg-card/80 backdrop-blur-sm p-3 text-center text-sm font-medium rounded-t-xl">
                      {resource.name}
                    </div>
                    <div className="absolute inset-x-0 top-12 bottom-0 p-2">
                      {/* Hour lines */}
                      {HOURS.map((hour, index) => (
                        <div
                          key={`${resource.id}-${hour}`}
                          className="border-b border-dashed border-border/30 cursor-pointer hover:bg-primary/5 transition-colors"
                          style={{ height: HOUR_HEIGHT }}
                          onClick={() => resource.id !== "placeholder" && handleTimeSlotClick(resource.id, hour)}
                        />
                      ))}

                      {/* Bookings */}
                      {(bookingsByResource.find((entry) => entry.resource.id === resource.id)?.bookings || []).map((booking) => {
                        const { top, height } = bookingPosition(booking.start_time, booking.end_time);
                        return (
                          <div
                            key={booking.id}
                            className="absolute left-1 right-1 rounded-lg border border-primary/30 bg-primary/10 p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            style={{ top: top + 4, height: Math.max(40, height - 8) }}
                            onClick={() => handleBookingClick(booking)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{booking.member?.full_name || 'Membre'}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {timeFormatter.format(new Date(booking.start_time))} – {timeFormatter.format(new Date(booking.end_time))}
                                </p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBookingClick(booking);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <Badge variant="outline" className="mt-1 text-[9px] uppercase w-fit">
                              {statusLabels[booking.status] || booking.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BookingDialog
        booking={selectedBooking}
        resources={resources}
        members={members}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
        mode={dialogMode}
        userRole="admin"
        locale={locale}
      />
    </>
  );
}