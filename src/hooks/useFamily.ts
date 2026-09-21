import { useQuery } from '@tanstack/react-query';
import { familyService } from '../services/familyService';

export const useFamily = (familyId?: string) =>
  useQuery({
    queryKey: ['family', familyId],
    queryFn: () => familyService.get(familyId!),
    enabled: !!familyId,
  });

export const useFamilyMembers = (familyId?: string) =>
  useQuery({
    queryKey: ['family', familyId, 'members'],
    queryFn: () => familyService.members(familyId!),
    enabled: !!familyId,
  });