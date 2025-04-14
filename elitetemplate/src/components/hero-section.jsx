import Image from "next/image";

export default function HeroSection({ heroBlock = {}, isAbout = false }) {
  const { title = "", subtitle = "" } = heroBlock;
  return (
    <section className="relative bg-gray-100">
      <div className="px-4 py-12 mx-auto max-w-7xl md:py-16">
        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left side with image */}
          <div className="relative h-[80vh]">
            <div className="absolute -top-8 -left-8 h-24 w-48 bg-[#B0DAF1] opacity-50 md:h-32 md:w-[80%]"></div>
            {/* Image */}
            <div className="relative z-10 w-full h-full">
              <Image
                src={
                  isAbout
                    ? "https://s3-alpha-sig.figma.com/img/eb1a/0843/5b4c9fe57bf244a767f5aa0187fb6ba6?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=a6EkXKCa1ByRrcT-07Z0iKzGC3rFTiectx4xPNdMzHWhTsgl9Dpkf6epxu-BbF9jRdeY7j464m5EH6tLHeLqwMddIePM--giW5d2f5FVOlCx3OA94KLO-Hes~gsXebTJtFEgHurjtxar4lR3VRarZheJQRDext5~nUeP3Zqp6JeYG5vwzTOGqJpDBp4bD4JYl2lXe75LDsT1ZKbXJ8sSxICln2M8f0o6OoOhgY3lMSRB-emZAsQCj5ol-SSL~fBDsgtSPLosWJnDlybeS6jJacmMSkcL4n-Deh13aXlXcpg9P~IU0jzzYrY~kMaff3LbzZFXPSb4w15XXF2o8KBG7A__"
                    : "https://s3-alpha-sig.figma.com/img/a2b1/d10a/276ce51dfe97a94ce7947f4ba3c3aa2e?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gCNYTP6duzXm~~fltIbpxbT2UPUAvcks3gw7TbidUpThge3WSmV3JCoG7REejM~Noj53vb7zkdpR2mrrm3aM~6h3PkLclEi9hSN3j4uTgsyTgVnMlQSXw50xTV2wiAZuK0Db4FW-ub~7vLSwgptC53tOH-6LX3zzWSgFkHWTcFWggC3wiKkKcLvq2CFC7mH2i-6xxHAb7jxtkNUpp9KMSugDfQT4kov1MpkRikyQeWIAgIHyF68Yzk4B72lzcjGKRwGXRDjnbnAVLBO2AZS1NSkaPooVxB7mI-CKISASZJm5G0tGNa44gp5xENTqginE3PhpQLXLO5yuD~Ip5g5g~g__"
                }
                alt="Dr. Jonathan Thomson"
                //  width={500}
                // height={400}
                layout="fill" // Fills the parent container
                objectFit="cover" // Ensures proper scaling
              />
            </div>
            <div className="absolute bottom-6 -right-10 h-24 w-48 bg-[#B0DAF1] opacity-50 md:h-32 md:w-[80%]"></div>
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
      <div className="w-full bg-[#2d3e50]/90 bg-blur py-12 text-center md:-mt-48 z-20 relative">
        <h2 className="text-2xl font-medium text-white md:text-3xl">
          Your Health, My Priority
        </h2>
      </div>
    </section>
  );
}
