import Image from "next/image";

export default function ServicesLayout() {
  return (
    <div>
      <h1 className="mt-[50px] text-center font-bold text-[var(--foreground)] underline underline-offset-8">
        SERVICES
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
            <div className="pt-4 pl-4 text-2xl">Seamless Booking Experience</div>
            <span className="pt-4 pl-4">
              Users can browse restaurants&apos; names, locations, and telephone numbers.
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
            <div className="pt-4 pl-4 text-2xl">Real-Time Management</div>
            <span className="pt-4 pl-4">
              Virtual waitlist system to reduce physical waiting times.
            </span>
            <span className="pt-4 pl-4">Users can check live queue status and join remotely.</span>
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
            <div className="pt-4 pl-4 text-2xl">Optimized Restaurant Management</div>
            <span className="pt-4 pl-4">
              A restaurant owner can create, update, and edit customers&apos; reservation statuses.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
