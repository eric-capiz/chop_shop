/** True when this mutation is in flight for a specific appointment. */
export function isMutationPendingForAppointment(
  mutation: {
    isPending: boolean;
    variables?: { appointmentId?: string } | null;
  },
  appointmentId: string,
): boolean {
  return (
    mutation.isPending && mutation.variables?.appointmentId === appointmentId
  );
}

/** True when any of these mutations is in flight for a specific appointment. */
export function isAnyMutationPendingForAppointment(
  mutations: Array<{
    isPending: boolean;
    variables?: { appointmentId?: string } | null;
  }>,
  appointmentId: string,
): boolean {
  return mutations.some((m) => isMutationPendingForAppointment(m, appointmentId));
}
