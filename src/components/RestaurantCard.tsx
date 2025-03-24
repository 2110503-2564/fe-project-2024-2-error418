import { RestaurantJSON } from "@/db/models/Restaurant";
import Image from "next/image";

export default function RestaurantCard({ name, address, region }: RestaurantJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg border border-[var(--cardborder)] bg-[var(--cardbg)] p-1 shadow-lg hover:bg-[var(--cardhoverbg)] hover:shadow-2xl hover:shadow-(color:--shadow)">
      <div className="h-[67%]">
        <Image
          className="pointer-events-none h-full w-auto rounded-sm object-cover object-center select-none"
          src="/img/restaurant.jpg"
          alt={name}
          width={0}
          height={0}
          sizes="100vw"
          priority
        />
      </div>
      <div className="flex h-[33%] flex-col overflow-auto">
        <div className="ml-3">
          <h2 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h2>
          <span>{address}</span>
          <span>{region}</span>
        </div>
      </div>
    </div>
  );
}
