export const PAID_STATUSES = [
  "paid",
  "medicals",
  "visa",
  "flight_booked",
  "deployed",
];

export const applicantStatuses = [
  { value: "registered", label: "Registered", color: "bg-slate-100 text-slate-700" },
  { value: "documents_complete", label: "Documents in", color: "bg-sky-100 text-sky-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "medicals", label: "Medicals", color: "bg-amber-100 text-amber-800" },
  { value: "visa", label: "Visa", color: "bg-violet-100 text-violet-800" },
  { value: "flight_booked", label: "Flight booked", color: "bg-indigo-100 text-indigo-800" },
  { value: "deployed", label: "Deployed", color: "bg-emerald-100 text-emerald-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export function statusInfo(value: string) {
  return (
    applicantStatuses.find((s) => s.value === value) ?? {
      value,
      label: value,
      color: "bg-slate-100 text-slate-700",
    }
  );
}