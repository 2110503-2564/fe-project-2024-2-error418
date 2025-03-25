"use client";

import { useRef, useState } from "react";
import { Session } from "next-auth";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  PencilSquareIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import { logoutUser } from "@/db/auth";
import AvatarIcon from "./AvatarIcon";

export default function AccountMenu({ session }: { session: Session | null }) {
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Tooltip title="Account settings">
        <IconButton
          ref={anchorEl}
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
        >
          <AvatarIcon width={32} height={32} name={session?.user.name} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl.current}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {session ?
          [
            <li onClick={handleClose} key="proflie">
              <Link
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100"
                href="/profile"
              >
                <UserCircleIcon width={16} height={16} />
                Profile
              </Link>
            </li>,
            <li onClick={handleClose} key="myRestaurants">
              <Link
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100"
                href="/dashboard/restaurants"
              >
                <BuildingStorefrontIcon width={16} height={16} />
                My Restaurants
              </Link>
            </li>,
            <li onClick={handleClose} key="myReservations">
              <Link
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100"
                href="/dashboard/reservations"
              >
                <CalendarDaysIcon width={16} height={16} />
                My Reservations
              </Link>
            </li>,
            <li onClick={handleClose} key="logout">
              <form action={logoutUser}>
                <button
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 hover:bg-gray-100"
                  type="submit"
                  title="Logout"
                >
                  <ArrowRightStartOnRectangleIcon width={16} height={16} />
                  Logout
                </button>
              </form>
            </li>,
          ]
        : [
            <li onClick={handleClose} key="register">
              <Link
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100"
                href="/register"
              >
                <PencilSquareIcon width={16} height={16} />
                Register
              </Link>
            </li>,
            <li onClick={handleClose} key="login">
              <Link className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100" href="/login">
                <KeyIcon width={16} height={16} />
                Login
              </Link>
            </li>,
          ]
        }
      </Menu>
    </div>
  );
}
