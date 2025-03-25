"use client";

import { useState } from "react";
import { RestaurantJSON } from "@/db/models/Restaurant";
import { Link } from "@/i18n/navigation";
import { TextField, InputAdornment, Button, Pagination } from "@mui/material";
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
  const [page, setPage] = useState(1);
  const restaurantsPerPage = 8;

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const text = useTranslations("Search");
  const btnText = useTranslations("Button");

  const startIndex = (page - 1) * restaurantsPerPage;
  const endIndex = startIndex + restaurantsPerPage;

  const restaurantsOnPage = filteredRestaurants.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <div className="mx-auto mb-6 flex w-full max-w-md justify-center">
        <Button variant="contained" href="/restaurants/create">
          {btnText("create-restaurant")}
        </Button>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {restaurantsOnPage.length > 0 ?
          restaurantsOnPage.map((e) => (
            <li key={e.id}>
              <Link href={`/restaurants/${e.id}`}>
                <RestaurantCard {...e}></RestaurantCard>
              </Link>
            </li>
          ))
        : <div className="col-span-full py-8 text-center">
            {text("notfound")} &apos;{searchQuery}&apos;
          </div>
        }
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </div>
      )}
    </>
  );
}
