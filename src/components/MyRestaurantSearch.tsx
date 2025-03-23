"use client";

import { useState } from "react";
import { RestaurantJSON } from "@/db/models/Restaurant";
import { Link } from "@/i18n/navigation";
import { TextField, InputAdornment } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface RestaurantSearchProps {
  restaurants: RestaurantJSON[];
  defaultValue?: string;
}

function Card({ name, address, region }: RestaurantJSON) {
  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg bg-white p-1 shadow-lg hover:bg-neutral-200 hover:shadow-2xl">
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
        <h2 className="pt-4 pb-2 text-[1rem] font-bold">{name}</h2>
        <span>{address}</span>
        <span>{region}</span>
      </div>
    </div>
  );
}

export default function RestaurantSearch({
  restaurants,
  defaultValue = "",
}: RestaurantSearchProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mx-auto mb-6 w-full max-w-md">
        <TextField
          fullWidth
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlassIcon width={20} height={20} />
              </InputAdornment>
            ),
            className: "bg-white",
          }}
        />
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {filteredRestaurants.length > 0 ?
          filteredRestaurants.map((e) => (
            <li key={e.id}>
              <Link href={`/dashboard/restaurants/${e.id}`}>
                <Card {...e}></Card>
              </Link>
            </li>
          ))
        : <div className="col-span-full py-8 text-center">
            No restaurants found matching &apos;{searchQuery}&apos;
          </div>
        }
      </ul>
    </>
  );
}
