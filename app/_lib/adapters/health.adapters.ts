export async function pingDatabaseAdapter(): Promise<void> {
  const { getInjection } = await import('@/di/container');
  await getInjection('IDatabaseHealthService').ping();
}
