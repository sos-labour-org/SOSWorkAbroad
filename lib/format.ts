export function formatPrice(amount: number, currency: string) {
  const symbol = currency === "GHS" ? "GH₵" : "$";
  return `${symbol}${amount.toLocaleString("en-US")}`;
}
