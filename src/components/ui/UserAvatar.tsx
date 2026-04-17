import React from "react";

export const UserAvatar = ({ src, alt, size = 40 }: { src?: string; alt?: string; size?: number }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState(false);
    const defaultAvatar = "https://i.pravatar.cc/150?img=3"; // random placeholder
    const avatarSize = `${size}px`;

    return (
        <div
            className="relative rounded-full overflow-hidden border-2 border-gray-300 shadow bg-gray-100 flex items-center justify-center"
            style={{ width: avatarSize, height: avatarSize }}
        >
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-200">
                    <span className="text-gray-400 text-xs">Loading...</span>
                </div>
            )}
            <img
                src={error || !src ? defaultAvatar : src}
                alt={alt || "avatar"}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </div>
    );
};
