
import Container from "./Container";

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
}

export default function PageHeader({
    eyebrow,
    title,
    description,
}: PageHeaderProps) {
    return (
        <section className="page-hero">
            <Container>
                <div className="max-w-3xl">
                    <span className="section-eyebrow">
                        {eyebrow}
                    </span>

                    <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
                        {title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-[#a7b7c9] md:text-lg">
                        {description}
                    </p>
                </div>
            </Container>
        </section>
    );
}
