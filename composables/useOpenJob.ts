/** Índice da vaga expandida na Home, compartilhado com a ativação da busca (Req 9.4, 9.6). */
export function useOpenJob() {
  return useState<number | null>('openJob', () => 0);
}
