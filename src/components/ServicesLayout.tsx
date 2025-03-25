import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ServicesLayout() {

  const text = useTranslations("Service");

  return (
    <div>
      <h1 className="mt-[50px] text-center font-bold text-[var(--foreground)] underline underline-offset-8">
        {text("title")}
      </h1>
      <div className="flex-warp mt-[100px] flex flex-row justify-around p-[10px]">
        <div className="h-[30rem] w-[20rem] rounded bg-[var(--cardbg)] p-1 shadow-lg">
          <div className="h-[50%]">
            <Image
              className="pointer-events-none mr-auto ml-auto h-full w-auto rounded-sm object-cover object-center select-none"
              src="/img/booking.png"
              alt="booking"
              width={0}
              height={0}
              sizes="100vw"
              priority
            />
          </div>
          <div className="flex h-[50%] flex-col overflow-auto">
            <div className="pt-4 pl-4 text-2xl">{text("booking-title")}</div>
            <span className="pt-4 pl-4">
              {text("booking-detail")}
            </span>
          </div>
        </div>
        <div className="h-[30rem] w-[20rem] rounded bg-[var(--cardbg)] p-1 shadow-lg">
          <div className="h-[50%] content-center">
            <Image
              className="pointer-events-none mr-auto ml-auto h-full w-auto rounded-sm object-cover object-center select-none"
              src="/img/clock.png"
              alt="clock"
              width={0}
              height={0}
              sizes="100vw"
              priority
            />
          </div>
          <div className="flex h-[50%] flex-col overflow-auto">
            <div className="pt-4 pl-4 text-2xl">{text("time-title")}</div>
            <span className="pt-4 pl-4">{text("time-detail-1")}</span>
            <span className="pt-4 pl-4">{text("time-detail-2")}</span>
          </div>
        </div>
        <div className="h-[30rem] w-[20rem] rounded bg-[var(--cardbg)] p-1 shadow-lg">
          <div className="h-[50%] content-center">
            <Image
              className="pointer-events-none mr-auto ml-auto h-full w-auto rounded-sm object-cover object-center select-none"
              src="/img/management.png"
              alt="manage"
              width={0}
              height={0}
              sizes="100vw"
              priority
            />
          </div>
          <div className="flex h-[50%] flex-col overflow-auto">
            <div className="pt-4 pl-4 text-2xl">{text("management-title")}</div>
            <span className="pt-4 pl-4">
              {text("management-detail")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
