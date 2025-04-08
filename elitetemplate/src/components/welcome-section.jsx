export default function WelcomeSection({ mainBlock }) {
    const { title = "", text = "" } = mainBlock;
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-[#0a1a33] md:text-4xl">
            {title}
          </h2>

          <p className="mx-auto text-lg text-gray-700">{text}</p>
        </div>
      </div>
    </section>
  );
}
