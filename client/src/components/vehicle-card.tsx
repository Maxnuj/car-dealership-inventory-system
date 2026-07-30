import type { Vehicle } from '../types/api';

type Props = { vehicle: Vehicle; isAdmin: boolean; onPurchase(id: string): void; onEdit(vehicle: Vehicle): void; onDelete(id: string): void; onRestock(id: string): void };
export function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }: Props) {
  return <article className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200">
    <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-indigo-600">{vehicle.category}</p><h2 className="text-xl font-bold text-slate-900">{vehicle.make} {vehicle.model}</h2></div><span className={vehicle.quantity ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700'}>{vehicle.quantity} in stock</span></div>
    <p className="mt-4 text-2xl font-bold text-slate-900">
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(vehicle.price))}
    </p>
    {vehicle.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{vehicle.description}</p>}
    <div className="mt-5 flex flex-wrap gap-2"><button disabled={!vehicle.quantity} onClick={() => onPurchase(vehicle.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Purchase</button>{isAdmin && <><button onClick={() => onEdit(vehicle)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Edit</button><button onClick={() => onRestock(vehicle.id)} className="rounded-lg border border-indigo-300 px-3 py-2 text-sm font-semibold text-indigo-700">Restock</button><button onClick={() => onDelete(vehicle.id)} className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Delete</button></>}</div>
  </article>;
}
