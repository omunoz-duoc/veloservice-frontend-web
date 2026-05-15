export interface IFinanzasService {
  getMetricas(): Promise<FinanzasMetricas>
}

export type FinanzasMetricas = { cobrosDelDia: number }
