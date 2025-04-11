export default function ServicesSection({ keysBlock = {} }) {
  const { title = "", items = [] } = keysBlock;

  return (
    <section className="relative my-12">
      {/* Blue rectangle top-left */}
      <div className="absolute -top-8 left-1/12 h-28 w-48 bg-[#B0DAF1] opacity-50 md:w-[30%]"></div>

      <section className="relative bg-gray-100/40 py-16 z-10 backdrop-blur-xl">
        <div className="px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0a1a33] md:text-3xl">
                {title}
              </h2>
            </div>

            <div className="space-y-6">
              {items.map((service, index) => (
                <div key={index} className="border-b border-gray-300 pb-4">
                  <h3 className="font-medium text-[#031228]">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Blue rectangle bottom-right */}
      <div className="absolute -bottom-12 right-1/12 h-28 w-64 bg-[#B0DAF1] opacity-50 md:w-[30%]"></div>
    </section>
  );
}
