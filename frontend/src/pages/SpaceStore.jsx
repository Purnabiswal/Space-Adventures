import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Space Juice",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133809/8.png",
    description:
      "Emergency drink that temporarily allows breathing without a spacesuit.",
    price: "2,500 credits",
    weight: "0.3 kg",
    duration: "12 min",
    rarity: "Rare",
    benefits: [
      "Breathe without suit for 12 min",
      "Lightweight and portable",
      "Quick activation",
    ],
    limitations: [
      "No radiation protection",
      "Temporary effect only",
      "Overuse causes dizziness",
    ],
  },
  {
    id: 2,
    name: "XenoPulse-22",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133901/XenoPulse-22_Bio-Frequency_Weapon.png",
    // "https://res.cloudinary.com/duudfsjc6/image/upload/v1794134015/Untitled_Design.png",
    description: "Bio-frequency weapon designed for alien organism defense.",
    price: "8,000 credits",
    weight: "2.1 kg",
    duration: null,
    rarity: "Experimental",
    benefits: [
      "Effective against alien organisms",
      "Safe for human targets",
      "Multiple operating modes",
    ],
    limitations: [
      "Not effective against all species",
      "Limited energy capacity",
      "Overload drains battery",
    ],
  },
  {
    id: 3,
    name: "Gravity Flip Boots",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133438/4.png",
    description: "Boots that manipulate gravity to walk on walls or ceilings.",
    price: "4,500 credits",
    weight: "1.8 kg",
    duration: null,
    rarity: "Rare",
    benefits: [
      "Walk on walls and ceilings",
      "Useful in zero-gravity",
      "Ideal for spacecraft interiors",
    ],
    limitations: [
      "Easy to accidentally activate",
      "Can invert suddenly",
      "Requires practice to control",
    ],
  },
  {
    id: 4,
    name: "Anti-Gravity Cup",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133438/1.png",
    description: "Drinking cup that keeps liquids contained in zero gravity.",
    price: "800 credits",
    weight: "0.15 kg",
    duration: null,
    rarity: "Common",
    benefits: [
      "Keeps liquids contained",
      "Ideal for spacecraft use",
      "Prevents floating spills",
    ],
    limitations: ["Can float away if dropped", "Sensitive to magnetic fields"],
  },
  {
    id: 5,
    name: "Alien Translator Earbud",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133438/3.png",
    description:
      "AI-powered earbud that translates unknown alien languages in real time.",
    price: "6,000 credits",
    weight: "0.05 kg",
    duration: null,
    rarity: "Advanced",
    benefits: [
      "Real-time alien language translation",
      "Analyzes unknown languages",
      "Essential for diplomacy",
    ],
    limitations: [
      "Translations can be inaccurate",
      "May misinterpret innocent phrases",
    ],
  },
  {
    id: 6,
    name: "Moonwalk Sneakers",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133438/2.png",
    description:
      "Smart shoes that adapt walking mechanics to low-gravity environments.",
    price: "3,200 credits",
    weight: "1.2 kg",
    duration: null,
    rarity: "Advanced",
    benefits: [
      "Easier low-gravity walking",
      "Improves balance",
      "Reduces fall risk",
    ],
    limitations: [
      "Poor performance in Earth gravity",
      "Requires calibration",
      "Adaptation delay between planets",
    ],
  },
  {
    id: 7,
    name: "Echo Helmet",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133438/5.png",
    description:
      "Helmet with an advanced voice processor for intimidating vocal effects.",
    price: "1,500 credits",
    weight: "1.5 kg",
    duration: null,
    rarity: "Common",
    benefits: [
      "Creates intimidating voice effects",
      "Can mimic alien vocal patterns",
      "Useful for communication",
    ],
    limitations: [
      "May get stuck in echo mode",
      "Confuses normal conversation",
      "Limited survival value",
    ],
  },
  {
    id: 8,
    name: "Foldable Space Sofa",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133439/6.png",
    description: "Compact cube that transforms into a full-sized sofa.",
    price: "5,000 credits",
    weight: "4.5 kg",
    duration: null,
    rarity: "Advanced",
    benefits: [
      "Compact when stored",
      "Comfortable seating",
      "Perfect for space habitats",
    ],
    limitations: [
      "Slow deployment time",
      "May deploy in wrong orientation",
      "Needs clearance to expand",
    ],
  },
  {
    id: 9,
    name: "3D Pizza Printer",
    image:
      "https://res.cloudinary.com/duudfsjc6/image/upload/v1794133439/7.png",
    description:
      "Food printer that produces pizza from stored ingredient cartridges.",
    price: "3,800 credits",
    weight: "6.0 kg",
    duration: null,
    rarity: "Common",
    benefits: [
      "Fresh pizza anywhere",
      "No cooking equipment needed",
      "Multiple recipe storage",
    ],
    limitations: [
      "Limited ingredient cartridges",
      "Some recipes unavailable",
      "Experimental mode may misfire",
    ],
  },
];

const rarityColors = {
  Common: "text-white",
  Advanced: "text-[#ff5f00]",
  Rare: "text-[#ff5f00]",
  Experimental: "text-[#ff5f00]"
};

function DetailView({ product, onBack }) {
  const p = product;
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-[#8492A6] hover:text-[#ff5f00] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to store
        </button>

        <div className="rounded-2xl border border-[#ff5f00]/20 bg-black overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-64 object-cover border-b border-[#ff5f00]/20"
          />
          <div className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{p.name}</h1>
                <p className="mt-2 text-[#B3BECE]">{p.description}</p>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${rarityColors[p.rarity] || 'text-white'}`}>
                {p.rarity}
              </span>
            </div>

            <div className="mb-6 flex gap-6 text-sm text-[#8492A6]">
              <span>{p.price}</span>
              <span>{p.weight}</span>
              {p.duration && <span>{p.duration}</span>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#ff5f00]">Benefits</p>
                <ul className="space-y-1">
                  {p.benefits.map((b, i) => (
                    <li key={i} className="text-sm text-[#B3BECE]">+ {b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8492A6]">Limitations</p>
                <ul className="space-y-1">
                  {p.limitations.map((l, i) => (
                    <li key={i} className="text-sm text-[#8492A6]">- {l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GridView({ products, onSelect }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">SPACE STORE</h1>
          <p className="mt-3 text-[#B3BECE]">22nd century equipment for astronauts, explorers, and space tourists</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className="group rounded-2xl border border-[#ff5f00]/20 bg-black overflow-hidden text-left transition-all duration-300 hover:border-[#ff5f00]/60 hover:shadow-[0_0_30px_rgba(255,95,0,0.15)]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover border-b border-[#ff5f00]/20"
              />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-base font-bold text-white">{product.name}</h2>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${rarityColors[product.rarity] || 'text-white'}`}>
                    {product.rarity}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpaceStore() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <DetailView product={selected} onBack={() => setSelected(null)} />;
  }

  return <GridView products={products} onSelect={setSelected} />;
}
