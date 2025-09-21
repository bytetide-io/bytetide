"use client"

// export default function LogoCloud({ className }: { className?: string }) {
//   return (
//     <div className={`bg-white py-8 ${className}`}>
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <h2 className="text-center text-lg font-medium text-gray-600">
//           We handle migrations for the leading Shopify agencies
//         </h2>
//         <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8 max-w-lg items-center gap-x-6 gap-y-6 sm:gap-x-12 sm:gap-y-12 lg:mx-0 lg:max-w-none">
//           {[
//             {
//               src: "https://cdn.brandfetch.io/bearplex.com/w/512/h/157/theme/light/logo?c=1idpCXkgelXfNE59s5h",
//               alt: "Bearplex",
//             },
//             {
//               src: "https://cdn.brandfetch.io/digitaleggheads.com/w/512/h/134/theme/light/logo?c=1idpCXkgelXfNE59s5h",
//               alt: "Isadisa Logo",
//             },
//             {
//               src: "https://cdn.brandfetch.io/edition.dk/w/512/h/143/theme/light/logo?c=1idpCXkgelXfNE59s5h",
//               alt: "Edition.dk Logo",
//             },
//             {
//               src: "https://cdn.brandfetch.io/unico-inc.com/w/216/h/95/logo?c=1idpCXkgelXfNE59s5h",
//               alt: "Unico Inc.",
//             },
//             {
//               src: "https://cdn.brandfetch.io/nollayks.com/w/414/h/100/logo?c=1idpCXkgelXfNE59s5h",
//               alt: "Nollayks Logo",
//             },
//           ].map((logo) => (
//             <img
//               key={logo.alt}
//               src={logo.src}
//               alt={logo.alt}
//               className="max-h-10 w-full object-contain"
//               style={{ filter: "brightness(0)" }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function LogoCloud({ className }: { className?: string }) {
  const logos = [
    {
      src: "https://cdn.brandfetch.io/bearplex.com/w/512/h/157/theme/light/logo?c=1idpCXkgelXfNE59s5h",
      alt: "Bearplex",
    },
    {
      src: "https://cdn.brandfetch.io/digitaleggheads.com/w/512/h/134/theme/light/logo?c=1idpCXkgelXfNE59s5h",
      alt: "Isadisa Logo",
    },
    {
      src: "https://cdn.brandfetch.io/edition.dk/w/512/h/143/theme/light/logo?c=1idpCXkgelXfNE59s5h",
      alt: "Edition.dk Logo",
    },
    {
      src: "https://cdn.brandfetch.io/unico-inc.com/w/216/h/95/logo?c=1idpCXkgelXfNE59s5h",
      alt: "Unico Inc.",
    },
    {
      src: "https://cdn.brandfetch.io/nollayks.com/w/414/h/100/logo?c=1idpCXkgelXfNE59s5h",
      alt: "Nollayks Logo",
    },
  ];

  return (
    <div className={`bg-white py-8 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-medium text-gray-600">
          Trusted migration partner for top Shopify agencies worldwide.
        </h2>

        {/* Mobile marquee */}
        <div className="block sm:hidden overflow-hidden w-full mt-8 relative">
          <div
            className="flex whitespace-nowrap gap-8"
            style={{ animation: "marquee 15s linear infinite" }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <img
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="max-h-7 w-auto object-contain"
                style={{ filter: "brightness(0)" }}
              />
            ))}
          </div>

          {/* Custom inline <style> block for the marquee */}
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8 max-w-lg items-center gap-x-6 gap-y-6 sm:gap-x-12 sm:gap-y-12 lg:mx-0 lg:max-w-none">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="max-h-10 w-full object-contain"
              style={{ filter: "brightness(0)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
