import { Container } from "../Container";
import { BentoCard } from "./BentoCard";
import { LogoCluster } from "./logo-cluster";
import { LogoTimeline } from "./logo-timeline";
import { Heading, Subheading } from "./text";

export function BentoSection() {
    return (
        <Container className="mt-10 py-20">
            <div className="text-center">
                <Subheading>ETL specialist for Shopify migrations</Subheading>
                <Heading as="h3" className="mt-4 max-w-4xl mx-auto text-4xl font-bold tracking-tight text-gray-800">
                    I handle the entire data migration

                </Heading>
                <p className="mt-6 text-lg text-gray-600">
                    From extraction to transformation to loading, I manage every step of your data migration to ensure a smooth transition to Shopify.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-6 lg:grid-rows-1">
                {/* Step 1 */}
                <BentoCard
                    eyebrow="Connection"
                    title="Extracts Data from Any Source"
                    description="I have built effecient extractors for any source system, whether it's a legacy platform, a custom database, or a popular CMS."
                    graphic={<LogoCluster />}
                    fade={['bottom']}
                    className="lg:col-span-2 lg:rounded-tl-4xl lg:rounded-bl-4xl shadow-lg hover:shadow-xl transition"
                />

                {/* Step 2 */}
                <BentoCard
                    eyebrow="Mapping"
                    title="I Will Do Any Data Transformation"
                    description="Whether it is standard data or you got custom attributes. I can handle complex data transformations to fit your requirements."
                    graphic={<LogoTimeline />}
                    className="z-10 !overflow-visible lg:col-span-2 shadow-lg hover:shadow-xl transition"
                />

                {/* Step 3 */}
                <BentoCard
                    eyebrow="Migration"
                    title="Pushing The Data To Shopify Safely"
                    description="No need for additional apps or manual work, I will load the data into the shopify store, and do any incremental updates as needed."
                    graphic={
                        <div className="flex size-full">
                            <img
                                src="/screenshots/shopify.gif"
                                alt="Shopify store migration process illustration"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    }
                    fade={['bottom']}
                    className="lg:col-span-2 lg:rounded-tr-4xl lg:rounded-br-4xl shadow-lg hover:shadow-xl transition"
                />
            </div>
        </Container>
    );
}