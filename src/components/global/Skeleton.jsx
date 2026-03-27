export const TableSkeleton = ({ rows = 5 }) => {
    const rowArray = Array.from({ length: rows });

    return (
        <>
            {rowArray.map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-none animate-pulse">

                    <td className="px-5 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>

                    <td className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>

                    <td className="px-5 py-4 flex gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export const Skeleton = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
    );
};
export const ProfileSkeleton = () => {
    return (
        <div className="w-full min-h-screen bg-[#EAEEF8] p-4">
            {/* Header */}
            <div className="p-8 flex items-start">
                <Skeleton className="w-[100px] h-[100px] rounded-full mr-6" />

                <div className="flex-1">
                    <Skeleton className="h-8 w-48 mb-4" />

                    <div className="flex gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-20" />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 ml-6">
                    <Skeleton className="w-40 h-10 rounded-lg" />
                    <Skeleton className="w-40 h-10 rounded-lg" />
                </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 p-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-8 rounded-full" />
                ))}
            </div>

            {/* Main Content */}
            <div className="flex gap-4">
                {/* Left */}
                <div className="w-[35%] space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                </div>

                {/* Right */}
                <div className="w-[65%] space-y-6">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                </div>
            </div>

            {/* Overview */}
            <div className="mt-10 grid grid-cols-2 gap-6">
                <Skeleton className="h-60 rounded-xl" />
                <Skeleton className="h-60 rounded-xl" />
            </div>

            {/* Bottom Cards */}
            <div className="mt-10 grid grid-cols-2 gap-6">
                <Skeleton className="h-60 rounded-xl" />
                <Skeleton className="h-60 rounded-xl" />
            </div>
        </div>
    );
};