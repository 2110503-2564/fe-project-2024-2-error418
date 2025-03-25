"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { TextField, InputAdornment, Pagination } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { PopulatedReservationJSON } from "@/db/reservations";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function ReservationSearch({
  reservations,
  defaultValue = "",
  cancelReservation,
  deleteReservation,
}: {
  reservations: PopulatedReservationJSON[];
  defaultValue?: string;
  cancelReservation: (id: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [page, setPage] = useState(1);
  const reservationsPerPage = 10;

  const filteredReservations = reservations.filter((reservation) =>
    reservation.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const text = useTranslations("Search");

  const startIndex = (page - 1) * reservationsPerPage;
  const endIndex = startIndex + reservationsPerPage;

  const reservationsOnPage = filteredReservations.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

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

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(16.5rem,1fr))] justify-items-center gap-8 py-4">
        {reservationsOnPage.length > 0 ?
          reservationsOnPage.map((e) => (
            <li key={e.id}>
              <Card
                {...e}
                cancelReservation={cancelReservation}
                deleteReservation={deleteReservation}
              />
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
            sx={{
              "& .MuiPaginationItem-root": { color: "var(--text-primary)" },
              "& .Mui-selected": { backgroundColor: "var(--accent-color)", color: "white" },
            }}
          />
        </div>
      )}
    </>
  );
}

function Card({
  restaurant,
  reserveDate,
  approvalStatus,
  id,
  cancelReservation,
  deleteReservation,
}: PopulatedReservationJSON & {
  cancelReservation: (id: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}) {
  const statusText = useTranslations("Status");
  const btnText = useTranslations("Button");

  return (
    <div className="h-[22rem] w-[16.5rem] rounded-lg border border-[var(--cardborder)] bg-[var(--cardbg)] p-1 shadow-lg hover:bg-[var(--cardhoverbg)] hover:shadow-2xl hover:shadow-(color:--shadow)">
      <Link href={`/reservations/${id}`}>
        <div className="h-[50%]">
          <Image
            className="pointer-events-none h-full w-full rounded-sm object-cover object-center select-none"
            src="/img/restaurant.jpg"
            alt={restaurant.name}
            width={0}
            height={0}
            sizes="100vw"
            priority
          />
        </div>
      </Link>
      <div className="ml-3 flex h-[35%] flex-col overflow-auto">
        <h2 className="pt-4 pb-2 text-[1rem] font-bold">{restaurant.name}</h2>
        <span>{reserveDate.toLocaleString()}</span>
        {approvalStatus == "approved" ?
          <span className="mt-2 h-[30px] w-[100px] rounded-full bg-green-600 pt-[2px] text-center font-bold">
            {statusText("approved")}
          </span>
        : approvalStatus == "pending" ?
          <span className="mt-2 h-[30px] w-[100px] rounded-full bg-yellow-600 pt-[2px] text-center font-bold">
            {statusText("pending")}
          </span>
        : <span className="mt-2 h-[30px] w-[100px] rounded-full bg-red-600 pt-[2px] text-center font-bold">
            {statusText(approvalStatus)}
          </span>
        }
      </div>
      <div className="z-10 mt-1 ml-3 flex h-[15%] overflow-auto">
        {approvalStatus == "pending" || approvalStatus == "approved" ?
          <form action={() => cancelReservation(id)}>
            <Button variant="contained" type="submit">
              {btnText("cancel")}
            </Button>
          </form>
        : <form action={() => deleteReservation(id)}>
            <Button variant="contained" type="submit">
              {btnText("delete")}
            </Button>
          </form>
        }
      </div>
    </div>
  );
}
