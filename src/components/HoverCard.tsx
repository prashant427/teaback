import React from "react";

interface HoverCardProps {
  title: string;
  image: string;
  description: string;
  hoverContent?: string;
}

const HoverCard: React.FC<HoverCardProps> = ({
  title,
  image,
  description,
  hoverContent,
}) => {
  return (
    <div className="group relative h-96 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-none transition-all duration-300 hover:border-foreground/30">
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover grayscale"
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/90 p-6 text-center text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <p className="eyebrow text-background/50">More info</p>
          <p className="mt-3 text-sm leading-relaxed">
            {hoverContent || "Hover content here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;
