'use client'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

import Image from 'next/image'

function Circle({
  size,
  delay,
  opacity,
}: {
  size: number
  delay: number
  opacity: string
}) {
  return (
    <motion.div
      variants={{
        idle: { width: `${size}px`, height: `${size}px` },
        active: {
          width: [`${size}px`, `${size + 10}px`, `${size}px`],
          height: [`${size}px`, `${size + 10}px`, `${size}px`],
          transition: {
            duration: 0.75,
            repeat: Infinity,
            repeatDelay: 1.25,
            ease: 'easeInOut',
            delay,
          },
        },
      }}
      style={{ '--opacity': opacity } as React.CSSProperties}
      className={clsx(
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
        'bg-[radial-gradient(circle,transparent_25%,color-mix(in_srgb,_theme(colors.blue.500)_var(--opacity),transparent)_100%)]',
        'ring-1 ring-inset ring-blue-500/[8%]',
      )}
    />
  )
}

function Circles() {
  return (
    <div className="absolute inset-0">
      <Circle size={528} opacity="3%" delay={0.45} />
      <Circle size={400} opacity="5%" delay={0.3} />
      <Circle size={272} opacity="5%" delay={0.15} />
      <Circle size={144} opacity="10%" delay={0} />
      <div className="absolute inset-0 bg-gradient-to-t" />
    </div>
  )
}

function MainLogo() {
  return (
    <div className="absolute left-44 top-32 flex size-16 items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5">
      {/* <Mark className="h-9 fill-black" /> */}
    </div>
  )
}

function Logo({
  src,
  left,
  top,
  hover,
}: {
  src: string
  left: number
  top: number
  hover: { x: number; y: number; rotate: number; delay: number }
}) {
  return (
    <motion.img
      variants={{
        idle: { x: 0, y: 0, rotate: 0 },
        active: {
          x: [0, hover.x, 0],
          y: [0, hover.y, 0],
          rotate: [0, hover.rotate, 0],
          transition: {
            duration: 0.75,
            repeat: Infinity,
            repeatDelay: 1.25,
            ease: 'easeInOut',
            delay: hover.delay,
          },
        },
      }}
      alt=""
      src={src}
      style={{ left, top } as React.CSSProperties}
      className="absolute size-16 rounded-full bg-white shadow ring-1 ring-black/5"
    />
  )
}

export function LogoCluster() {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden">
      <Circles />
      <div className="absolute left-1/2 h-full w-[26rem] -translate-x-1/2">
        <div className="absolute left-44 top-44 flex size-16 items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5">
          <img
            className='rounded-full'
            src="https://cdn.brandfetch.io/shopify.com/w/512/h/305/icon?c=1idpCXkgelXfNE59s5h"
            alt=''
          />
        </div>
        <Logo
          src="https://cdn.brandfetch.io/woocommerce.com/w/512/h/305/icon?c=1idpCXkgelXfNE59s5h"
          left={330}
          top={144}
          hover={{ x: 6, y: 1, rotate: 5, delay: 0.38 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/bigcommerce.com/w/512/h/322/icon?c=1idpCXkgelXfNE59s5h"
          left={285}
          top={20}
          hover={{ x: 4, y: -5, rotate: 6, delay: 0.3 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/dandomain.dk/w/512/h/147/icon?c=1idpCXkgelXfNE59s5h"
          left={255}
          top={210}
          hover={{ x: 3, y: 5, rotate: 7, delay: 0.2 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/magento.com/w/512/h/172/icon?c=1idpCXkgelXfNE59s5h"
          left={144}
          top={40}
          hover={{ x: -2, y: -5, rotate: -6, delay: 0.15 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/squarespace.com/w/512/h/121/icon?c=1idpCXkgelXfNE59s5h"
          left={36}
          top={56}
          hover={{ x: -4, y: -5, rotate: -6, delay: 0.35 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/wix.com/w/512/h/206/icon?c=1idpCXkgelXfNE59s5h"
          left={76}
          top={176}
          hover={{ x: -3, y: 5, rotate: 3, delay: 0.15 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/ecwid.com/w/400/h/400?c=1idpCXkgelXfNE59s5h"
          left={166}
          top={346}
          hover={{ x: -3, y: 5, rotate: 3, delay: 0.15 }}
        />
        <Logo
          src="https://cdn.brandfetch.io/prestashop.com/w/400/h/400?c=1idpCXkgelXfNE59s5h"
          left={30}
          top={246}
          hover={{ x: -3, y: 5, rotate: 3, delay: 0.15 }}
        />
      </div>
    </div>
  )
}



function LogoNext({ src, alt, left, top, hover }: any) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, rotate: 0 }}
      whileHover={{
        x: hover?.x || 0,
        y: hover?.y || 0,
        rotate: hover?.rotate || 0,
        transition: { delay: hover?.delay || 0, duration: 0.3 },
      }}
      style={{ left, top }}
      className="absolute w-16 h-16 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5"
    >
      <img src={src} alt={alt} className="rounded-full object-contain" />
    </motion.div>
  );
}



export function LogoClusterGraphic() {
  const logos = [
    {
      src: "https://cdn.brandfetch.io/shopify.com/w/512/h/305/icon?c=1idpCXkgelXfNE59s5h",
      alt: "Shopify",
      left: "40%",
      top: "40%",
    },
    {
      src: "https://cdn.brandfetch.io/woocommerce.com/w/512/h/305/icon?c=1idpCXkgelXfNE59s5h",
      alt: "WooCommerce",
      left: "70%",
      top: "30%",
    },
    {
      src: "https://cdn.brandfetch.io/bigcommerce.com/w/512/h/322/icon?c=1idpCXkgelXfNE59s5h",
      alt: "BigCommerce",
      left: "50%",
      top: "10%",
    },
    {
      src: "https://cdn.brandfetch.io/dandomain.dk/w/512/h/147/icon?c=1idpCXkgelXfNE59s5h",
      alt: "DanDomain",
      left: "55%",
      top: "65%",
    },
    {
      src: "https://cdn.brandfetch.io/magento.com/w/512/h/172/icon?c=1idpCXkgelXfNE59s5h",
      alt: "Magento",
      left: "30%",
      top: "20%",
    },
    {
      src: "https://cdn.brandfetch.io/squarespace.com/w/512/h/121/icon?c=1idpCXkgelXfNE59s5h",
      alt: "Squarespace",
      left: "20%",
      top: "50%",
    },
    {
      src: "https://cdn.brandfetch.io/wix.com/w/512/h/206/icon?c=1idpCXkgelXfNE59s5h",
      alt: "Wix",
      left: "30%",
      top: "70%",
    },
    {
      src: "https://cdn.brandfetch.io/ecwid.com/w/400/h/400?c=1idpCXkgelXfNE59s5h",
      alt: "Ecwid",
      left: "70%",
      top: "70%",
    },
    {
      src: "https://cdn.brandfetch.io/prestashop.com/w/400/h/400?c=1idpCXkgelXfNE59s5h",
      alt: "PrestaShop",
      left: "15%",
      top: "30%",
    },
  ];

  // Generate random animation values for each logo
  const generateRandomAnimation = () => ({
    x: Array(5)
      .fill(0)
      .map(() => Math.random() * 20 - 10), // Random -10 to +10
    y: Array(5)
      .fill(0)
      .map(() => Math.random() * 20 - 10), // Random -10 to +10
    rotate: Array(5)
      .fill(0)
      .map(() => Math.random() * 10 - 5), // Random -5 to +5 degrees
    duration: Math.random() * 4 + 3, // Random duration between 3s to 7s
  });

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "500px" }}
    >
      {logos.map((logo, index) => {
        const animation = generateRandomAnimation();

        // Center the Shopify logo without animation
        if (logo.alt === "Shopify") {
          return (
            <motion.div
              key={index}
              style={{
                position: "absolute",
                left: logo.left,
                top: logo.top,
                transform: "translate(-50%, -50%)",
              }}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5"
              whileHover={{ scale: 1.2 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="rounded-full w-20 h-20 object-contain"
              />
            </motion.div>
          );
        }

        // Floating logos with randomized animations
        return (
          <motion.div
            key={index}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{
              x: animation.x,
              y: animation.y,
              rotate: animation.rotate,
            }}
            transition={{
              duration: animation.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: logo.left,
              top: logo.top,
              transform: "translate(-50%, -50%)",
            }}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5"
            whileHover={{ scale: 1.2 }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="rounded-full w-12 h-12 object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
