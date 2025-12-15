'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin, User, Trash2, Edit } from 'lucide-react';
import { format, addHours, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function BookingDialog({
  booking,
  resources,
  members,
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  mode = 'create',
  userRole = 'coworker',
  locale = 'en'
}) {
  const [formData, setFormData] = useState({
    resource_id: '',
    member_id: '',
    start_time: '',
    end_time: '',
    status: 'confirmed'
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return startOfDay(now);
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      const startDate = new Date(booking.start_time);
      const endDate = new Date(booking.end_time);

      setFormData({
        resource_id: booking.resource_id ? String(booking.resource_id) : '',
        member_id: booking.member_id ? String(booking.member_id) : '',
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status || 'confirmed'
      });
      setSelectedDate(startOfDay(startDate));
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(endDate, 'HH:mm'));
    } else {
      // Reset for new booking
      const now = new Date();
      const defaultStart = addHours(now, 1);
      defaultStart.setMinutes(0, 0, 0);

      setFormData({
        resource_id: '',
        member_id: '',
        start_time: '',
        end_time: '',
        status: 'confirmed'
      });
      setSelectedDate(startOfDay(now));
      setStartTime(format(defaultStart, 'HH:mm'));
      setEndTime(format(addHours(defaultStart, 1), 'HH:mm'));
    }
  }, [booking]);

  // Update form data when date/time changes
  useEffect(() => {
    const startDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}:00`);
    const endDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}:00`);

    setFormData(prev => ({
      ...prev,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString()
    }));
  }, [selectedDate, startTime, endTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!booking || !onDelete) return;

    setIsSubmitting(true);
    try {
      await onDelete(booking.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const selectedResource = resources?.find(r => String(r.id) === formData.resource_id);
  const selectedMember = members?.find(m => String(m.id) === formData.member_id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <CalendarIcon className="h-5 w-5" />
                Nouvelle réservation
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Modifier la réservation
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 w-80">
              <Label className="text-sm font-medium">Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < startOfDay(new Date())}
                className="w-full"
                locale={locale}
                plain
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Heure de début</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Heure de fin</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resource Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ressource</Label>
                <Select
                  value={formData.resource_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resource_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ressource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources?.map((resource) => (
                      <SelectItem key={resource.id} value={String(resource.id)}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {resource.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Member Selection (for admins) */}
              {userRole !== 'coworker' && (
                <div className="space-y-2 w-72">
                  <Label className="text-sm font-medium">Membre</Label>
                  <Select
                    value={formData.member_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, member_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                        {members && members.length > 0 ? (
                          members.map((member) => (
                            <SelectItem key={member.id} value={String(member.id)}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {member.full_name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="no_members" value="no_members" disabled>
                            Aucun membre trouvé
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Status Selection (for admins) */}
              {userRole !== 'coworker' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                      <SelectItem value="checked_in">Présent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {(selectedResource || selectedMember) && (
            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
              <h4 className="text-sm font-medium mb-3">Aperçu de la réservation</h4>
              <div className="space-y-2 text-sm">
                {selectedResource && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedResource.name}</span>
                  </div>
                )}
                {selectedMember && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMember.full_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDate && selectedDate instanceof Date ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : 'Date non sélectionnée'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{startTime} - {endTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {mode === 'edit' && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.resource_id || (!formData.member_id && userRole !== 'coworker')}
              >
                {isSubmitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}