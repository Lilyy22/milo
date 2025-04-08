import Image from "next/image";

export default function HeroSection({ heroBlock = {} }) {
  const { title = "", subtitle = "" } = heroBlock;
  return (
    <section className="relative bg-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 h-24 w-48 bg-[#a8d0e6] opacity-50 md:h-32 md:w-64"></div>
            <div className="relative z-10">
              <Image
                src="https://drgalen.org/wp-content/doctorspic/Dr_Hailemichael_Desalegn_Mekonnen58Screenshot_20241028_084436_Telegram.jpg"
                alt="Dr. Jonathan Thomson"
                width={500}
                height={400}
                className="rounded-md object-cover shadow-lg"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-48 bg-[#a8d0e6] opacity-50 md:h-32 md:w-64"></div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1a33] md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="text-lg text-gray-700">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Your Health, My Priority Banner */}
      <div className="w-full bg-[#2d3e50] py-6 text-center">
        <h2 className="text-2xl font-medium text-white md:text-3xl">
          Your Health, My Priority
        </h2>
      </div>
    </section>
  );
}
