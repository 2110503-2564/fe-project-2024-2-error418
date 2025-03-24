"use client";

import { useState } from "react";
import { RestaurantJSON } from "@/db/models/Restaurant";
import { Link } from "@/i18n/navigation";
import { TextField, InputAdornment } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RestaurantCard from "./RestaurantCard";
import { useTranslations } from "next-intl";

interface RestaurantSearchProps {
  restaurants: RestaurantJSON[];
  defaultValue?: string;
}

export default function RestaurantSearch({
  restaurants,
  defaultValue = "",
}: RestaurantSearchProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const text = useTranslations("Search");

  return (
    <>
      <div className="mx-auto mb-6 w-full max-w-md">
        <TextField
          fullWidth
          placeholder={text("placeholder")}
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
                <RestaurantCard {...e}></RestaurantCard>
              </Link>
            </li>
          ))
        : <div className="col-span-full py-8 text-center">
            {text("notfound")} &apos;{searchQuery}&apos;
          </div>
        }
      </ul>
    </>
  );
}
