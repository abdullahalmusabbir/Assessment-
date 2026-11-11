
interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    description?: string;
}

export default function SectionHeading({
    eyebrow,
    title,
    description,
}: SectionHeadingProps) {
    return (
        <div className="section-heading">
            <span className="section-eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5b85c]" />
                {eyebrow}
            </span>

            <h2 className="section-title">{title}</h2>

            {description && (
                <p className="section-description">
                    {description}
                </p>
            )}
        </div>
    );
}
