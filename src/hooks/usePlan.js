import { useEffect, useState } from 'react';
import { supabase } from '../core/supabaseClient.js';
import { fetchIsCreator } from '../core/subscriptionService.js';

export function usePlan(user) {
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setIsCreator(false);
      return;
    }
    fetchIsCreator(user.id).then(setIsCreator);

    const channel = supabase
      .channel(`plan-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` }, () => {
        fetchIsCreator(user.id).then(setIsCreator);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  return { isCreator };
}
