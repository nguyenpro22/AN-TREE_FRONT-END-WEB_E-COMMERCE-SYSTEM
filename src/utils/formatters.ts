export function formatCurrency(amount: number): string {
  return amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
