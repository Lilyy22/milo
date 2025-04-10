export default function WelcomeSection({ mainBlock }) {
  const { title = "", text = "" } = mainBlock;
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-bold text-[#031228] md:text-4xl">
            {title}
          </h2>

          <p className="mx-auto text-gray-700">{text}</p>
        </div>
      </div>
    </section>
  );
}
