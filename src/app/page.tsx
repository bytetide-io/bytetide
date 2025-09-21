import { type Metadata } from 'next'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { RootLayout } from '@/components/RootLayout'
import Image from 'next/image'
import { BentoSection } from '@/components/home/BentoSection'
export const metadata: Metadata = {
  description:
    'Expert ecommerce ETL specialist handling any Shopify migration case - from simple to complex data transformations.',
}

export default function Home() {
  return (
    <RootLayout>
      <Container className="mt-16 sm:mt-20 md:mt-38">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content Column */}
            <div className="max-w-5xl">
              <h1 className="font-display text-4xl font-medium tracking-tight text-balance text-neutral-950 sm:text-5xl lg:text-6xl">
                The data Shopify migration specialist agencies rely on
              </h1>
              <p className="mt-6 text-xl text-neutral-600">
                Every migration carries the same risks: blown timelines, resource drain, and the possibility of corrupted data that could damage client trust. I&#39;ve built systems to eliminate these risks entirely - delivering faster, cleaner results while your team stays focused on billable work
              </p>
              <div className="mt-10 flex gap-x-6">
                <button
                  id="hero-calendar-btn"
                  className="inline-flex items-center justify-center px-8 py-4 bg-neutral-950 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:scale-105 transform transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Get in touch
                </button>
              </div>
            </div>

            {/* Profile Image Column */}
            <div className="relative lg:order-last">
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96 mb-20">
                <Image
                  width={400}
                  height={400}
                  src="/images/profile_image.png"
                  alt="Hans-Christian Pedersen - ETL Migration Specialist"
                  className="w-full h-full object-cover rounded-2xl shadow-xl"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-lg px-3 py-2 shadow-lg border border-neutral-200">
                  <div className="text-xs font-semibold text-neutral-950">Hans-Christian Pedersen</div>
                  <div className="text-xs text-neutral-500">Copenhagen, Denmark</div>
                  <div className="text-xs text-neutral-500">ETL Migration Expert</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>

      <div className="mt-24 sm:mt-32 lg:mt-40 bg-slate-50 py-16">
        <Container>
          <FadeIn>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-neutral-950">3</div>
                <div className="text-sm font-medium text-neutral-600 mt-2">DAYS</div>
                <div className="text-sm text-neutral-500 mt-1">Average Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-neutral-950">100%</div>
                <div className="text-sm font-medium text-neutral-600 mt-2">SUCCESS</div>
                <div className="text-sm text-neutral-500 mt-1">Successful Migrations</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-neutral-950">+5 mio</div>
                <div className="text-sm font-medium text-neutral-600 mt-2">OBJECTS</div>
                <div className="text-sm text-neutral-500 mt-1">Objects Migrated</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-neutral-950">43</div>
                <div className="text-sm font-medium text-neutral-600 mt-2">PROJECT MANAGERS</div>
                <div className="text-sm text-neutral-500 mt-1">Asses Saved</div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>

      <BentoSection />
      <FadeIn className="mt-12 text-center">
        <div className="bg-neutral-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-200 rounded-full mb-3">
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Data Migration</h4>
              <p className="text-sm text-neutral-600">From legacy CSV files to modern APIs - I move it all into Shopify</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-200 rounded-full mb-3">
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">301 Redirects</h4>
              <p className="text-sm text-neutral-600">Preserve SEO rankings with proper URL redirects from old to new store</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-200 rounded-full mb-3">
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Translations</h4>
              <p className="text-sm text-neutral-600">Handle multilingual stores with proper translation mapping and structure</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <Container className="mt-16 sm:mt-20">
        <FadeIn className="text-center">
          <p className="text-2xl text-neutral-600 font-medium max-w-4xl mx-auto">
            Think of me as your dedicated Shopify migration engineer from Copenhagen who does nothing but moving data into Shopify for agencies worldwide.
            <span className="text-neutral-950"> That&apos;s all I do, all day, every day.</span>
          </p>
        </FadeIn>
      </Container>

      {/* Agency Fit Section */}
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl mb-8">
              Is ByteTide right for your agency?
            </h2>
            <p className="text-xl text-neutral-600 mb-12">
              You&apos;ll benefit from my expertise if any of these apply to your agency:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neutral-950" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-950 mb-2">You spend +3 hours on a migration</h3>
                    <p className="text-neutral-600 text-sm">
                      If migrations are taking your team more than a few hours, you&apos;re losing money on manual work that should be automated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neutral-950" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-950 mb-2">You deliver high quality for your clients</h3>
                    <p className="text-neutral-600 text-sm">
                      Your reputation depends on flawless deliveries. You can&apos;t afford data corruption or migration failures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neutral-950" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-950 mb-2">You don&apos;t have a fulltime data engineer</h3>
                    <p className="text-neutral-600 text-sm">
                      Hiring a data engineer for occasional migrations doesn&apos;t make financial sense. You need expertise on-demand.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neutral-950" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-950 mb-2">You value an expert who picks up the phone</h3>
                    <p className="text-neutral-600 text-sm">
                      You need responsive communication and direct access to the person doing the work, not a support ticket system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-neutral-50 rounded-2xl">
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-4">
                Ready to work with a migration specialist?
              </h3>
              <p className="text-neutral-600 mb-6">
                Stop wrestling with complex migrations and focus on what you do best. Let me handle the data engineering while you deliver exceptional results to your clients.
              </p>
              <button
                id="agency-fit-calendar-btn"
                className="inline-flex items-center justify-center px-8 py-4 bg-neutral-950 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:scale-105 transform transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer"
              >
                Get in touch
              </button>
            </div>
          </div>
        </FadeIn>
      </Container>

      {/* Agency Partners Section */}
      {/* <div className="mt-24 sm:mt-32 bg-gradient-to-b from-neutral-50 to-white py-12 sm:py-16">
        <Container>
          <FadeIn className="text-center">
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-medium text-neutral-500 mb-6">
                Are you a shop owner looking to migrate? These agencies will handle your entire Shopify migration project:
              </p>

              <div className="flex items-center justify-center gap-8 flex-wrap">
                <a
                  href="https://edition.dk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-40 h-20 bg-white rounded-lg shadow-sm border border-neutral-200 px-6 hover:shadow-md hover:scale-105 transition-all duration-300 group text-neutral-500 hover:text-neutral-700"
                >
                  <Image
                    width={256}
                    height={256}
                    src="/images/clients/edition.svg"
                    alt="Edition"
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                  />
                </a>
                <a
                  href="https://grafikr.dk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-40 h-20 bg-white rounded-lg shadow-sm border border-neutral-200 px-6 hover:shadow-md hover:scale-105 transition-all duration-300 group text-neutral-500 hover:text-neutral-700"
                >
                  <Image
                    width={256}
                    height={256}
                    src="/images/clients/grafikr.svg"
                    alt="Grafikr"
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                  />
                </a>
                <a
                  href="https://zago.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-40 h-20 bg-white rounded-lg shadow-sm border border-neutral-200 px-6 hover:shadow-md hover:scale-105 transition-all duration-300 group"
                >
                  <Image
                    width={256}
                    height={256}
                    src="/images/clients/zago.webp"
                    alt="Zago Agency"
                    className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:opacity-100 transition-all duration-300"
                  />
                </a>
                <div className="flex items-center justify-center w-40 h-20 bg-neutral-50 rounded-lg border border-neutral-200 px-6">
                  <span className="text-sm font-medium text-neutral-500">+ More agencies</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div> */}

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
            I solve your <b>headaches</b>
          </h2>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <FadeIn>
            <div className="text-center p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-3">
                No under-budgeting the migration task
              </h3>
              <p className="text-neutral-600">
                Fixed pricing means no surprise costs. You know exactly what you&apos;ll pay upfront, no matter what complexity we discover.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="text-center p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-3">
                No risk of unseen migration complexity
              </h3>
              <p className="text-neutral-600">
                I&apos;ve seen every edge case. Complex variants, custom fields, legacy data structures - I handle it all without surprises.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="text-center p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-3">
                No stress over missing mad clients
              </h3>
              <p className="text-neutral-600">
                100% success rate means your clients stay happy. No data loss, no broken features, no angry phone calls to ruin your day.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="text-center p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-3">
                No exceeded deadlines
              </h3>
              <p className="text-neutral-600">
                Reach your deadlines. I know what I am doing. No more explaining to clients why their migration is taking weeks longer than promised.
              </p>
            </div>
          </FadeIn>
        </div>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
            Self-serve Shopify migration tools vs. Expert service
          </h2>
          <p className="mt-6 text-xl text-neutral-600 max-w-3xl mx-auto">
            Why spend weeks wrestling with generic Shopify migration tools when you could have it done right in 3 days?
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-3xl bg-red-50 p-8 ring-1 ring-red-100">
              <h3 className="font-display text-xl font-semibold text-red-900 mb-6">
                Self-Serve Shopify Migration Tools
              </h3>
              <div className="space-y-4 text-red-800">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Weeks of your time wasted</div>
                    <div className="text-sm text-red-700">Learning complex interfaces, reading docs, troubleshooting failures</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Your expensive developers debugging</div>
                    <div className="text-sm text-red-700">Paying $100+/hour to figure out why products have broken variants</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Client data experiments</div>
                    <div className="text-sm text-red-700">Testing on live Shopify stores because tools don&apos;t have staging environments</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">No accountability when it fails</div>
                    <div className="text-sm text-red-700">&quot;Sorry, that&apos;s a known limitation&quot; - while your client is furious</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Hidden costs pile up</div>
                    <div className="text-sm text-red-700">Monthly subscriptions + your time + fixing mistakes = $$$$</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-3xl bg-green-50 p-8 ring-1 ring-green-100">
              <h3 className="font-display text-xl font-semibold text-green-900 mb-6">
                My Expert Shopify Migration Service
              </h3>
              <div className="space-y-4 text-green-800">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Done in 3 days, hands-off</div>
                    <div className="text-sm text-green-700">You submit the project, I handle everything, you get perfect results</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Your team stays on billable work</div>
                    <div className="text-sm text-green-700">No developers pulled away from profitable client projects</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Safe staging environment testing</div>
                    <div className="text-sm text-green-700">Every Shopify migration tested thoroughly before touching live data</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">I guarantee the results</div>
                    <div className="text-sm text-green-700">100% success rate - if something breaks, I fix it immediately</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <div className="font-medium">Fixed price, no surprises</div>
                    <div className="text-sm text-green-700">One price covers everything - no hourly charges or hidden fees</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-8 py-4 text-blue-700">
            <span className="font-medium text-xl">
              Stop wasting weeks on Shopify migration tools. Get expert results in 3 days.
            </span>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-2 text-center">
                <Image
                  width={400}
                  height={400}
                  src="/images/profile_image.png"
                  alt="Hans-Christian Pedersen"
                  className="w-80 h-80 lg:w-96 lg:h-96 mx-auto rounded-lg object-cover shadow-xl"
                />
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-neutral-950 mb-4">
                    About Hans-Christian
                  </h2>
                  <p className="text-lg text-neutral-600 mb-6">
                    Software and data engineer specializing in ecommerce migrations
                  </p>
                </div>

                <div className="space-y-4 text-neutral-600">
                  <p>
                    I&apos;m Hans-Christian, a passionate software and data engineer based in Copenhagen who has been in the ecommerce space for years.
                    I&apos;ve been the lead developer of complex systems like <strong>Trendbook</strong> that migrates
                    millions of products from hundreds of data sources every day.
                  </p>
                  <p>
                    From generating large ML datasets to designing complex CNN models for Image retrieval tasks,
                    I&apos;ve tackled some of the most challenging data problems in the industry working with clients across Europe, North America, and beyond.
                  </p>
                  <p>
                    My passion lies in building structured and efficient systems for data handling. From my Copenhagen office, I work exclusively with agencies worldwide,
                    solving the most complex Shopify migration challenges no matter what timezone you&apos;re in.
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500">
                    ETL expert with years of experience building systems that handle millions of products daily from Copenhagen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>





      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-medium text-balance text-white sm:text-4xl">
                Ready to discuss your Shopify migration?
              </h2>
              <p className="mt-6 text-xl text-neutral-300">
                Let&apos;s talk about your Shopify migration challenges and how I can solve them for your agency.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="inline-block">
                  <button
                    id="open-calendar-modal"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-neutral-950 font-semibold rounded-lg hover:bg-neutral-100 hover:scale-105 transform transition-all duration-300 ease-out shadow-lg hover:shadow-xl min-w-48 cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Book a meeting
                  </button>
                </div>

                <div className="text-neutral-300">
                  <p className="text-sm">
                    <strong>Hans-Christian Pedersen</strong><br />
                    Email: <a href="mailto:hc@bytetide.io" className="text-white hover:underline">hc@bytetide.io</a><br />
                    Phone: <a href="tel:+4552677691" className="text-white hover:underline">+45 52677691</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>

      {/* Calendar Modal - Outside of any containers */}
      <div
        id="calendar-modal"
        className="fixed inset-0 hidden items-center justify-center p-4 backdrop-blur-sm"
        style={{
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden relative transform transition-all duration-300 ease-out"
        >
          <div className="flex items-center justify-between p-8 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950 mb-2">
                Schedule Your Shopify Migration Consultation
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-neutral-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:hc@bytetide.io" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">hc@bytetide.io</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href="tel:+4552677691" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">+45 52677691</a>
                </div>
              </div>
            </div>
            <button
              id="close-calendar-modal"
              className="p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <svg className="w-6 h-6 text-neutral-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-white">
            <iframe
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0uUGzk7zgKvnl1DBbfb4ZEq39LtC8jgQoyqhFUT6UIjCPsfYgUyGT1GNRReT2-B8KXDAwo-Q4q?gv=true"
              style={{ border: 0, display: 'block' }}
              width="100%"
              height="650"
              frameBorder="0"
              title="Schedule Appointment"
            />
          </div>
        </div>
      </div>


      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `
      }} />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function initCalendarModal() {
                const openBtn = document.getElementById('open-calendar-modal');
                const heroBtn = document.getElementById('hero-calendar-btn');
                const agencyFitBtn = document.getElementById('agency-fit-calendar-btn');
                const closeBtn = document.getElementById('close-calendar-modal');
                const modal = document.getElementById('calendar-modal');
                
                function openModal() {
                  modal.classList.remove('hidden');
                  modal.classList.add('flex');
                  document.body.style.overflow = 'hidden';
                  
                  // Add smooth entrance animation
                  const modalContent = modal.querySelector('div');
                  if (modalContent) {
                    modalContent.style.transform = 'translateY(-20px) scale(0.95)';
                    modalContent.style.opacity = '0';
                    
                    requestAnimationFrame(() => {
                      modalContent.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                      modalContent.style.transform = 'translateY(0) scale(1)';
                      modalContent.style.opacity = '1';
                    });
                  }
                  
                  // Animate backdrop
                  modal.style.opacity = '0';
                  requestAnimationFrame(() => {
                    modal.style.transition = 'opacity 0.3s ease-out';
                    modal.style.opacity = '1';
                  });
                }
                
                function closeModal() {
                  const modalContent = modal.querySelector('div');
                  
                  // Animate out
                  if (modalContent) {
                    modalContent.style.transition = 'all 0.3s ease-in';
                    modalContent.style.transform = 'translateY(-20px) scale(0.95)';
                    modalContent.style.opacity = '0';
                  }
                  
                  modal.style.transition = 'opacity 0.3s ease-in';
                  modal.style.opacity = '0';
                  
                  setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = 'auto';
                    
                    // Reset styles for next open
                    if (modalContent) {
                      modalContent.style.transform = '';
                      modalContent.style.opacity = '';
                      modalContent.style.transition = '';
                    }
                    modal.style.opacity = '';
                    modal.style.transition = '';
                  }, 300);
                }
                
                if (openBtn && closeBtn && modal) {
                  openBtn.addEventListener('click', openModal);
                  
                  if (heroBtn) {
                    heroBtn.addEventListener('click', openModal);
                  }
                  
                  if (agencyFitBtn) {
                    agencyFitBtn.addEventListener('click', openModal);
                  }
                  
                  closeBtn.addEventListener('click', closeModal);
                  
                  // Close on background click
                  modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                      closeModal();
                    }
                  });
                  
                  // Close on Escape key
                  document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                      closeModal();
                    }
                  });
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initCalendarModal);
              } else {
                initCalendarModal();
              }
            })();
          `
        }}
      />
    </RootLayout>
  )
}