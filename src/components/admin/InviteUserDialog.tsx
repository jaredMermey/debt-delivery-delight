import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEntities } from '@/hooks/useEntities';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreateInvitation } from '@/hooks/useInvitations';
import { UserPlus, Loader2 } from 'lucide-react';

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [entityId, setEntityId] = useState('');
  const [roleId, setRoleId] = useState('');

  const { data: entities } = useEntities();
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const createInvitation = useCreateInvitation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvitation.mutateAsync({ email, entity_id: entityId, role_id: roleId });
    setOpen(false);
    setEmail('');
    setEntityId('');
    setRoleId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new user to the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity">Entity</Label>
            <Select value={entityId} onValueChange={setEntityId} required>
              <SelectTrigger id="entity">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={roleId} onValueChange={setRoleId} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createInvitation.isPending}>
              {createInvitation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
