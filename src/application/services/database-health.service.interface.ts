export interface IDatabaseHealthService {
  ping(): Promise<void>;
}
