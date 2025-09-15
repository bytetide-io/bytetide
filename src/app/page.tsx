import { type Metadata } from 'next'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { RootLayout } from '@/components/RootLayout'

function ValuePropositions() {
  return (
    <div className="mt-24 rounded-4xl bg-white py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
            Expert precision with powerful tools
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            I&apos;ve developed sophisticated tools and processes that deliver both speed and quality. Expert oversight combined with proven automation ensures reliable results every time.
          </p>
        </FadeIn>
        <FadeInStagger className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3" faster>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-600">
                <div className="h-6 w-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-neutral-950">
                Expert-Guided Automation
              </h3>
              <p className="mt-4 text-neutral-600">
                My powerful tools handle complex data transformations efficiently while I oversee every critical decision. This combination delivers both speed and the precision your projects demand.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-600">
                <div className="h-4 w-4 bg-white rounded-full"></div>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-neutral-950">
                Quality-First Approach
              </h3>
              <p className="mt-4 text-neutral-600">
                My tools are built to handle every edge case, complex product configuration, and data mapping challenge. Years of experience refined into automated systems that ensure reliable data integrity and proper Shopify formatting.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-600">
                <div className="h-3 w-3 bg-white rounded-sm rotate-45"></div>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-neutral-950">
                Agency-Focused Service
              </h3>
              <p className="mt-4 text-neutral-600">
                I work exclusively with agencies to maintain professional service levels. My efficient tools and processes ensure your clients receive fast, expert migration services through your trusted relationship.
              </p>
            </div>
          </FadeIn>
        </FadeInStagger>
      </Container>
    </div>
  )
}


function StreamlinedWorkflow() {
  return (
    <>
      <SectionIntro
        eyebrow="One Workflow for All"
        title="No more migration headaches or missed deadlines"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Every migration follows my proven 5-step process—regardless of source platform. This eliminates the chaos and unpredictability that agencies typically face with complex data migrations.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-5" faster>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                1
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                Data Analysis
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Automated analysis identifies all data types, relationships, and potential issues in minutes
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                2
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                Smart Mapping
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                AI-powered field mapping handles complex product variants and custom fields automatically
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                3
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                Transformation
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Data cleaning, formatting, and optimization happen in parallel for maximum speed
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                4
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                Validation
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Comprehensive testing ensures 100% data integrity before any import
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white font-bold">
                5
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                Go-Live
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Scheduled deployment with full rollback capability and expert monitoring
              </p>
            </div>
          </FadeIn>
        </FadeInStagger>
      </Container>
    </>
  )
}

function WorkflowDemo() {
  return (
    <>
      <SectionIntro
        eyebrow="How It Works"
        title="Simple 4-step process from start to finish"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          No complicated dashboards or confusing interfaces. Just a straightforward process that gets your migration done fast and reliably.
        </p>
      </SectionIntro>
      
      <Container className="mt-16">
        <div className="space-y-12">
          {/* Step 1: You Submit */}
          <FadeIn>
            <div className="relative">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">You submit your project</h3>
                  <p className="text-lg text-slate-600 mb-4">
                    Tell me your source platform (WooCommerce, Magento, Dandomain, etc.), destination Shopify store, and provide access credentials. That&apos;s it.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">What I need from you:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">Source store admin access</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">Shopify store details</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">Any special requirements</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">Expected timeline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 2: I Migrate */}
          <FadeIn>
            <div className="relative">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">I handle the migration</h3>
                  <p className="text-lg text-slate-600 mb-4">
                    My automated tools extract your data, handle complex transformations, and prepare everything for Shopify. You get regular updates but don&apos;t need to do anything.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">What happens behind the scenes:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-sm text-slate-700">Data extraction and analysis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-sm text-slate-700">Product variants and custom fields mapping</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-sm text-slate-700 font-medium">Customer data and order history</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center"></div>
                        <span className="text-sm text-slate-500">SEO redirects and URL structure</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center"></div>
                        <span className="text-sm text-slate-500">Final validation and testing</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">✉️ You&apos;ll get daily progress updates via email</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 3: You Review */}
          <FadeIn>
            <div className="relative">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">You review and approve</h3>
                  <p className="text-lg text-slate-600 mb-4">
                    I send you a detailed preview of your migrated data. Check product variants, customer details, whatever matters to you. Request changes if needed.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">What you&apos;ll see in the preview:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-xl font-bold text-slate-900">8,420</div>
                        <div className="text-xs text-slate-600">Products ready</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-xl font-bold text-slate-900">12,450</div>
                        <div className="text-xs text-slate-600">Customers migrated</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-xl font-bold text-slate-900">100%</div>
                        <div className="text-xs text-slate-600">Data integrity</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div>• Sample of migrated products with all variants</div>
                      <div>• Customer data with order history</div>
                      <div>• SEO redirect mapping</div>
                      <div>• Any custom field transformations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Step 4: We Go Live */}
          <FadeIn>
            <div className="relative">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-white font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">We go live (with incremental sync)</h3>
                  <p className="text-lg text-slate-600 mb-4">
                    Schedule your launch. Right before going live, I sync any new orders or customers that came in since the original migration. Zero data loss, zero downtime.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Your original migration:</h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div>✓ All products and variants</div>
                          <div>✓ Complete customer database</div>
                          <div>✓ Historical order data</div>
                          <div>✓ SEO redirects active</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Pre-launch incremental sync:</h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div>+ New orders since migration</div>
                          <div>+ New customer registrations</div>
                          <div>+ Product updates or inventory changes</div>
                          <div>+ Any other changes made</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                      <p className="text-sm text-slate-700">
                        <strong>Result:</strong> Perfect data continuity with zero manual work on your end
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </>
  )
}

function ServicesFocus() {
  return (
    <>
      <SectionIntro
        eyebrow="My Expertise"
        title="Powerful tools with expert oversight"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          I&apos;ve developed sophisticated automation tools that handle complex migrations efficiently. Combined with expert oversight and quality control, this ensures reliable results with faster delivery times.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-2" faster>
          <FadeIn>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-neutral-950/5">
              <h3 className="font-display text-xl font-semibold text-neutral-950">
                Expert Data Transformation
              </h3>
              <p className="mt-4 text-neutral-600">
                My advanced tools analyze your source data and design optimal mapping strategies automatically. From WooCommerce to Magento, BigCommerce to custom databases—I&apos;ve built specialized tools for them all.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Automated data analysis and planning
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Smart mapping for complex data structures
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Proven solutions for unique challenges
                </li>
              </ul>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-neutral-950/5">
              <h3 className="font-display text-xl font-semibold text-neutral-950">
                Automated Quality Assurance
              </h3>
              <p className="mt-4 text-neutral-600">
                My tools validate every data point automatically with comprehensive testing suites. Advanced algorithms verify complex product variants, validate custom field mappings, and test every redirect. Expert oversight ensures nothing goes live without approval.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Automated validation of every data transformation
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Comprehensive testing of complex configurations
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Expert sign-off before go-live
                </li>
              </ul>
            </div>
          </FadeIn>
        </FadeInStagger>
      </Container>
    </>
  )
}

function WhyChooseMe() {
  return (
    <>
      <SectionIntro
        eyebrow="Partnership Benefits"
        title="Why agencies choose me as their migration partner"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          I don&apos;t just migrate data—I protect your agency&apos;s reputation and strengthen your client relationships through reliable, predictable results.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <FadeIn>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 font-display text-xl font-semibold text-neutral-950">
                  Predictable Timelines
                </h3>
              </div>
              <p className="text-neutral-700">
                <strong>No more deadline anxiety.</strong> My automated tools complete migrations 3-5x faster than traditional methods. Most projects finish in 5-10 days, not weeks.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Accurate time estimates upfront
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Daily progress updates
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  99% on-time completion rate
                </li>
              </ul>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 font-display text-xl font-semibold text-neutral-950">
                  Zero Data Loss
                </h3>
              </div>
              <p className="text-neutral-700">
                <strong>Your reputation is safe.</strong> Advanced validation algorithms and comprehensive testing mean zero critical data loss in 500+ completed migrations.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Pre-flight data validation
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Automated integrity checks
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Full rollback capability
                </li>
              </ul>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="ml-4 font-display text-xl font-semibold text-neutral-950">
                  Handle Any Complexity
                </h3>
              </div>
              <p className="text-neutral-700">
                <strong>No project too complex.</strong> 100,000+ products? Custom fields? Multi-language? B2B pricing? My tools handle it all automatically.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Unlimited product variants
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Custom field preservation
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  SEO & URL redirects
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </Container>
    </>
  )
}

function PlatformExpertise() {
  return (
    <div className="mt-24 sm:mt-32 lg:mt-40 bg-neutral-50 py-20 sm:py-32">
      <Container>
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
            I can migrate from ANY platform
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Modern platforms, legacy systems, custom databases—my tools handle them all. Even Danish legacy platforms like Dandomain, or that custom system from 2008.
          </p>
        </FadeIn>
        
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { name: 'WooCommerce', color: 'bg-purple-100 text-purple-700' },
            { name: 'Magento 1 & 2', color: 'bg-orange-100 text-orange-700' },
            { name: 'BigCommerce', color: 'bg-blue-100 text-blue-700' },
            { name: 'PrestaShop', color: 'bg-pink-100 text-pink-700' },
            { name: 'OpenCart', color: 'bg-green-100 text-green-700' },
            { name: 'Dandomain', color: 'bg-red-100 text-red-700' },
            { name: 'Drupal Commerce', color: 'bg-blue-100 text-blue-700' },
            { name: 'VirtueMart', color: 'bg-purple-100 text-purple-700' },
            { name: 'osCommerce', color: 'bg-orange-100 text-orange-700' },
            { name: 'Zen Cart', color: 'bg-green-100 text-green-700' },
            { name: 'Custom DB', color: 'bg-gray-100 text-gray-700' },
            { name: 'Legacy Systems', color: 'bg-yellow-100 text-yellow-700' },
          ].map((platform) => (
            <FadeIn key={platform.name}>
              <div className={`rounded-2xl px-4 py-3 text-center ${platform.color}`}>
                <div className="font-medium text-sm">{platform.name}</div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-6 py-2 text-blue-700">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">If it stores products and customers, I can migrate it</span>
          </div>
        </FadeIn>
        
        <FadeIn className="mt-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-neutral-950/5">
              <h3 className="font-display text-2xl font-semibold text-neutral-950 mb-4">
                The migration headaches I eliminate:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Data corruption</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Missed deadlines</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Broken product variants</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Lost SEO rankings</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Unexpected cost overruns</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Angry client calls</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Manual data cleanup</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Platform-specific surprises</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

function BookingCTA() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-medium text-balance text-white sm:text-4xl">
              Ready for expert migration service?
            </h2>
            <p className="mt-6 text-xl text-neutral-300">
              Let&apos;s discuss how my powerful tools and expert oversight can deliver fast, reliable Shopify migrations with the quality your agency clients deserve.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Button href="https://calendar.app.google/81eDvC64C8hBduyr9" variant="secondary">
                Book a meeting
              </Button>
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
  )
}

export const metadata: Metadata = {
  description:
    'ByteTide - Premium Data Migration Dashboard. Seamless data migration to Shopify exclusively for agencies.',
}

export default function Home() {
  return (
    <RootLayout>
      <Container className="mt-24  sm:mt-32 md:mt-56">
        <FadeIn className="max-w-4xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
            Expert Shopify migrations for agencies
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            Hi, I&apos;m Hans-Christian Pedersen, an ecommerce ETL specialist with years of experience migrating complex data to Shopify. 
            I&apos;ve developed powerful tools and automated processes that deliver both speed and precision, ensuring your clients&apos; data migrates perfectly every time.
          </p>
          <div className="mt-10 flex gap-x-6">
            <Button href="https://calendar.app.google/81eDvC64C8hBduyr9">
              Book a meeting
            </Button>
          </div>
        </FadeIn>
      </Container>

      <ValuePropositions />

      <StreamlinedWorkflow />

      <WhyChooseMe />

      <PlatformExpertise />

      <WorkflowDemo />

      <ServicesFocus />

      <BookingCTA />
    </RootLayout>
  )
}