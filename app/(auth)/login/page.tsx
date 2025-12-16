import LoginForm from "@/app/components/login/LoginForm";
import { getUser } from "@/app/services/roles";
import Image from "next/image";
export default async function LoginPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden relative ">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.15]">
          <Image
            src="/topscattered.jpg"
            alt="Scattered background pattern"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
      {/* Left Side - Image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[50%] relative h-screen items-center justify-center">
        <img
          src="/aldward-castillo-bPqMD7uSrJg-unsplash.jpg"
          alt="Baker moulding dough"
          className="object-cover w-[95%] h-[95%] rounded-lg"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center relative h-screen">
        <div className="w-full max-w-md px-8 z-10">
          <LoginForm user={user} />
        </div>
      </div>
    </div>
  );
}
