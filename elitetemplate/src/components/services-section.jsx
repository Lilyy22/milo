export default function ServicesSection({
  keysBlock = {},
  missionBlock = {},
  isAbout = false,
}) {
  const { title = "", items = [] } = keysBlock;
  const { title: missionTitle = "", text = "" } = missionBlock;

  return (
    <section className="relative py-20">
      {/* Blue rectangle top-left */}
      <div className="absolute top-12 left-1/12 h-28 w-48 bg-[#B0DAF1] opacity-50 md:w-[30%]"></div>

      <section className="relative z-10 py-16 bg-gray-100/10 backdrop-blur-lg">
        <div className="px-4">
          <div className="max-w-6xl px-4 mx-auto">
            {isAbout ? (
              <>
                <h2 className="mb-8 text-3xl font-bold text-[#031228] md:text-4xl">
                  {missionTitle}
                </h2>

                <p className="mx-auto text-gray-700">{text}</p>
              </>
            ) : (
              <>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-[#0a1a33] md:text-3xl">
                    {title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {items.map((service, index) => (
                    <div key={index} className="pb-4 border-b border-gray-300">
                      <h3 className="font-medium text-[#031228]">{service}</h3>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* Blue rectangle bottom-right */}
      <div className="absolute bottom-12 right-1/12 h-28 w-64 bg-[#B0DAF1] opacity-50 md:w-[30%]"></div>
    </section>
  );
}
