export default function ServicesSection({ keysBlock }) {
  const { title, items } = keysBlock;

  return (
    <section className="relative bg-gray-50 py-16">
      {/* Blue rectangle top-left */}
      <div className="absolute left-0 top-0 h-24 w-64 bg-[#a8d0e6] opacity-50"></div>

      {/* Blue rectangle bottom-right */}
      <div className="absolute bottom-0 right-0 h-24 w-64 bg-[#a8d0e6] opacity-50"></div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a1a33] md:text-3xl">
              {title}
            </h2>
          </div>

          <div className="space-y-6">
            {items.map((service, index) => (
              <div key={index} className="border-b border-gray-300 pb-4">
                <h3 className="text-lg font-medium text-[#0a1a33]">
                  {service}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
