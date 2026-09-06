"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Image from "next/image";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    Loader2,
    RefreshCw,
    Search,
    Upload,
    X,
} from "lucide-react";

type MediaItem = {
    _id: string;
    title?: string;
    url?: string;
    path?: string;
    mimeType?: string;
    alt?: string;
    filename?: string;
    originalName?: string;
    width?: number;
    height?: number;
    size?: number;
};

interface MediaPickerProps {
    value?: string | null;
    onChange: (mediaId: string | null) => void;

    label: string;

    description?: string;

    accept?: "image" | "all";

    disabled?: boolean;

    /**
     * Optional callback used by the parent to open
     * its Media Management upload UI.
     */
    onUpload?: () => void;

    /**
     * Number of media items requested per page.
     */
    pageSize?: number;
}

type MediaApiResponse = {
    success?: boolean;
    data?: MediaItem[] | {
        media?: MediaItem[];
        items?: MediaItem[];
        pagination?: {
            page?: number;
            limit?: number;
            total?: number;
            totalPages?: number;
        };
    };
    message?: string;
};

function getMediaItems(result: MediaApiResponse) {
    if (Array.isArray(result.data)) {
        return result.data;
    }

    return result.data?.media ?? result.data?.items ?? [];
}

function getPagination(result: MediaApiResponse) {
    return Array.isArray(result.data)
        ? undefined
        : result.data?.pagination;
}

function getRecord(value: unknown) {
    return value && typeof value === "object"
        ? value as Record<string, unknown>
        : {};
}

function getString(...values: unknown[]) {
    return values.find(
        (value): value is string => typeof value === "string"
    ) ?? "";
}

function normalizeMediaItem(item: unknown): MediaItem {
    const value = getRecord(item);
    const nestedMedia = getRecord(value.media);
    const nestedFile = getRecord(value.file);

    return {
        _id: String(value._id ?? value.id ?? ""),
        title: getString(
            value.title,
            value.name,
            value.filename,
            value.originalName
        ),
        url: getString(
            value.url,
            value.secureUrl,
            value.publicUrl,
            nestedMedia.url,
            nestedFile.url
        ),
        path: getString(
            value.path,
            value.filePath,
            nestedMedia.path,
            nestedFile.path
        ),
        mimeType: getString(
            value.mimeType,
            value.type,
            nestedMedia.mimeType
        ),
        alt: getString(value.alt, value.altText),
        filename: getString(value.filename),
        originalName: getString(value.originalName),
        width:
            typeof value.width === "number"
                ? value.width
                : undefined,
        height:
            typeof value.height === "number"
                ? value.height
                : undefined,
        size:
            typeof value.size === "number"
                ? value.size
                : undefined,
    };
}

function getMediaSrc(
    item?: MediaItem | null
) {
    if (!item) return "";

    return (
        item.url ??
        item.path ??
        ""
    );
}

function isImage(item: MediaItem) {
    return Boolean(
        item.mimeType?.toLowerCase().startsWith(
            "image/"
        )
    );
}

export default function MediaPicker({
    value,
    onChange,
    label,
    description,
    accept = "image",
    disabled = false,
    onUpload,
    pageSize = 40,
}: MediaPickerProps) {
    const [open, setOpen] =
        useState(false);

    const [media, setMedia] =
        useState<MediaItem[]>([]);

    const [selectedMedia, setSelectedMedia] =
        useState<MediaItem | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [loadingSelected, setLoadingSelected] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    /*
     * ----------------------------------------------------
     * Load media
     * ----------------------------------------------------
     */

    const loadMedia = useCallback(
        async (
            requestedPage = 1,
            replace = true
        ) => {
            try {
                setLoading(true);
                setError(null);

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(requestedPage)
                );

                params.set(
                    "limit",
                    String(pageSize)
                );

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (accept === "image") {
                    params.set(
                        "type",
                        "image"
                    );
                }

                const response =
                    await fetch(
                        `/api/media?${params.toString()}`,
                        {
                            method: "GET",
                            cache: "no-store",
                        }
                    );

                const result: MediaApiResponse =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message ??
                        "Unable to load media."
                    );
                }

                const rawItems =
                    getMediaItems(result);

                const normalized =
                    rawItems
                        .map(
                            normalizeMediaItem
                        )
                        .filter(
                            (item) =>
                                Boolean(
                                    item._id
                                )
                        );

                setMedia((previous) => {
                    if (replace) {
                        return normalized;
                    }

                    const map =
                        new Map(
                            previous.map(
                                (item) => [
                                    item._id,
                                    item,
                                ]
                            )
                        );

                    normalized.forEach(
                        (item) => {
                            map.set(
                                item._id,
                                item
                            );
                        }
                    );

                    return Array.from(
                        map.values()
                    );
                });

                const pagination =
                    getPagination(result);

                const resolvedTotalPages =
                    Number(
                        pagination?.totalPages ??
                        1
                    );

                setPage(
                    Number(
                        pagination?.page ??
                        requestedPage
                    )
                );

                setTotalPages(
                    Math.max(
                        1,
                        resolvedTotalPages
                    )
                );

                setTotal(
                    Number(
                        pagination?.total ??
                        normalized.length
                    )
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load media."
                );

                if (replace) {
                    setMedia([]);
                }
            } finally {
                setLoading(false);
            }
        },
        [
            accept,
            pageSize,
            search,
        ]
    );

    /*
     * ----------------------------------------------------
     * Load selected media
     *
     * Important:
     * The selected ID may not exist on the current
     * paginated media list.
     * ----------------------------------------------------
     */

    const loadSelectedMedia =
        useCallback(
            async (
                mediaId: string
            ) => {
                if (!mediaId) {
                    setSelectedMedia(
                        null
                    );
                    return;
                }

                const existing =
                    media.find(
                        (item) =>
                            item._id ===
                            mediaId
                    );

                if (existing) {
                    setSelectedMedia(
                        existing
                    );
                    return;
                }

                try {
                    setLoadingSelected(
                        true
                    );

                    /*
                     * Try the individual media endpoint first.
                     */
                    const response =
                        await fetch(
                            `/api/media/${mediaId}`,
                            {
                                method: "GET",
                                cache: "no-store",
                            }
                        );

                    if (
                        response.ok
                    ) {
                        const result =
                            await response.json();

                        const raw =
                            result?.data ??
                            result?.media ??
                            result?.data?.media;

                        if (raw) {
                            const normalized =
                                normalizeMediaItem(
                                    raw
                                );

                            setSelectedMedia(
                                normalized
                            );

                            return;
                        }
                    }

                    /*
                     * Fallback:
                     * Search the media endpoint.
                     */
                    const fallback =
                        await fetch(
                            `/api/media?limit=100&search=${encodeURIComponent(
                                mediaId
                            )}`,
                            {
                                cache: "no-store",
                            }
                        );

                    if (
                        fallback.ok
                    ) {
                        const result =
                            await fallback.json();

                        const rawItems =
                            getMediaItems(result);

                        const found =
                            rawItems
                                .map(
                                    normalizeMediaItem
                                )
                                .find(
                                    (
                                        item: MediaItem
                                    ) =>
                                        item._id ===
                                        mediaId
                                );

                        if (found) {
                            setSelectedMedia(
                                found
                            );

                            return;
                        }
                    }

                    setSelectedMedia(
                        null
                    );
                } catch {
                    setSelectedMedia(
                        null
                    );
                } finally {
                    setLoadingSelected(
                        false
                    );
                }
            },
            [media]
        );

    /*
     * ----------------------------------------------------
     * Sync selected media
     * ----------------------------------------------------
     */

    useEffect(() => {
        void Promise.resolve().then(() => {
            if (value) {
                return loadSelectedMedia(value);
            }

            setSelectedMedia(null);
        });
    }, [
        value,
        loadSelectedMedia,
    ]);

    /*
     * ----------------------------------------------------
     * Load whenever picker opens
     * ----------------------------------------------------
     */

    useEffect(() => {
        if (!open) return;

        void Promise.resolve().then(() => {
            setPage(1);
            return loadMedia(1, true);
        });
    }, [
        open,
        loadMedia,
    ]);

    /*
     * ----------------------------------------------------
     * Search debounce
     * ----------------------------------------------------
     */

    useEffect(() => {
        if (!open) return;

        const timer =
            window.setTimeout(() => {
                setPage(1);
                loadMedia(1, true);
            }, 350);

        return () =>
            window.clearTimeout(
                timer
            );
    }, [
        search,
        open,
        loadMedia,
    ]);

    /*
     * ----------------------------------------------------
     * Filter
     * ----------------------------------------------------
     */

    const filteredMedia =
        useMemo(() => {
            return media.filter(
                (item) => {
                    if (
                        accept ===
                        "image" &&
                        !isImage(item)
                    ) {
                        return false;
                    }

                    if (
                        !search.trim()
                    ) {
                        return true;
                    }

                    const query =
                        search
                            .trim()
                            .toLowerCase();

                    return [
                        item.title,
                        item.alt,
                        item.filename,
                        item.originalName,
                    ]
                        .filter(Boolean)
                        .some(
                            (value) =>
                                value!
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )
                        );
                }
            );
        }, [
            media,
            search,
            accept,
        ]);

    /*
     * ----------------------------------------------------
     * Select
     * ----------------------------------------------------
     */

    function selectMedia(
        item: MediaItem
    ) {
        setSelectedMedia(
            item
        );

        onChange(
            item._id
        );

        setOpen(false);
    }

    /*
     * ----------------------------------------------------
     * Clear
     * ----------------------------------------------------
     */

    function clearSelection() {
        setSelectedMedia(
            null
        );

        onChange(null);
    }

    /*
     * ----------------------------------------------------
     * Pagination
     * ----------------------------------------------------
     */

    function previousPage() {
        if (
            page <= 1 ||
            loading
        ) {
            return;
        }

        loadMedia(
            page - 1,
            true
        );
    }

    function nextPage() {
        if (
            page >=
            totalPages ||
            loading
        ) {
            return;
        }

        loadMedia(
            page + 1,
            true
        );
    }

    const imageUrl =
        getMediaSrc(
            selectedMedia
        );

    return (
        <>
            {/* ------------------------------------------------ */}
            {/* FIELD */}
            {/* ------------------------------------------------ */}

            <div className="space-y-3">
                <div>
                    <label className="text-sm font-bold text-slate-800">
                        {label}
                    </label>

                    {description && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {selectedMedia ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="relative aspect-[3/1] bg-slate-50">
                            {imageUrl ? (
                                <Image
                                    src={
                                        imageUrl
                                    }
                                    alt={
                                        selectedMedia.alt ||
                                        selectedMedia.title ||
                                        label
                                    }
                                    fill
                                    unoptimized
                                    className="object-contain p-5"
                                    sizes="700px"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-300">
                                    <ImageIcon
                                        size={
                                            40
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                    {selectedMedia.title ||
                                        selectedMedia.originalName ||
                                        "Selected media"}
                                </p>

                                <p className="mt-1 truncate text-xs text-slate-400">
                                    ID:{" "}
                                    {
                                        selectedMedia._id
                                    }
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    disabled={
                                        disabled
                                    }
                                    onClick={() =>
                                        setOpen(
                                            true
                                        )
                                    }
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Change
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        disabled
                                    }
                                    onClick={
                                        clearSelection
                                    }
                                    className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={`Remove ${label}`}
                                >
                                    <X
                                        size={
                                            16
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                {loadingSelected ? (
                                    <Loader2
                                        size={
                                            20
                                        }
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ImageIcon
                                        size={
                                            21
                                        }
                                    />
                                )}
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-700">
                                No media selected
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Choose an existing image from the media library.
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={
                                        disabled
                                    }
                                    onClick={() =>
                                        setOpen(
                                            true
                                        )
                                    }
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <ImageIcon
                                            size={
                                                15
                                            }
                                        />
                                        Select Media
                                    </span>
                                </button>

                                {onUpload && (
                                    <button
                                        type="button"
                                        disabled={
                                            disabled
                                        }
                                        onClick={
                                            onUpload
                                        }
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Upload
                                                size={
                                                    15
                                                }
                                            />
                                            Upload
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ------------------------------------------------ */}
            {/* MODAL */}
            {/* ------------------------------------------------ */}

            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setOpen(
                                false
                            );
                        }
                    }}
                >
                    <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Header */}

                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
                            <div className="min-w-0">
                                <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                                    Select Media
                                </h2>

                                <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                                    Choose media from your permanent media library.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setOpen(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close media picker"
                            >
                                <X
                                    size={
                                        20
                                    }
                                />
                            </button>
                        </div>

                        {/* Toolbar */}

                        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search
                                    size={
                                        17
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search by filename, title or alt text..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                                />
                            </div>

                            <div className="flex gap-2">
                                {onUpload && (
                                    <button
                                        type="button"
                                        onClick={
                                            onUpload
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
                                    >
                                        <Upload
                                            size={
                                                15
                                            }
                                        />
                                        Upload
                                    </button>
                                )}

                                <button
                                    type="button"
                                    disabled={
                                        loading
                                    }
                                    onClick={() =>
                                        loadMedia(
                                            page,
                                            true
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                                    aria-label="Refresh media"
                                >
                                    <RefreshCw
                                        size={
                                            16
                                        }
                                        className={
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Error */}

                        {error && (
                            <div className="mx-4 mt-4 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-6">
                                {error}
                            </div>
                        )}

                        {/* Content */}

                        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                            {loading ? (
                                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                                    <Loader2
                                        size={
                                            30
                                        }
                                        className="animate-spin text-blue-600"
                                    />

                                    <p className="mt-4 text-sm font-bold text-slate-600">
                                        Loading media library...
                                    </p>
                                </div>
                            ) : filteredMedia.length ===
                                0 ? (
                                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                                        <ImageIcon
                                            size={
                                                28
                                            }
                                        />
                                    </div>

                                    <p className="mt-4 font-bold text-slate-700">
                                        No media found
                                    </p>

                                    <p className="mt-1 max-w-sm text-sm text-slate-400">
                                        {search
                                            ? "Try another search term."
                                            : "Upload an image from Media Management first."}
                                    </p>

                                    {onUpload && (
                                        <button
                                            type="button"
                                            onClick={
                                                onUpload
                                            }
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white"
                                        >
                                            <Upload
                                                size={
                                                    15
                                                }
                                            />
                                            Upload Media
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                                    {filteredMedia.map(
                                        (
                                            item
                                        ) => {
                                            const src =
                                                getMediaSrc(
                                                    item
                                                );

                                            const isSelected =
                                                item._id ===
                                                value;

                                            return (
                                                <button
                                                    key={
                                                        item._id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        selectMedia(
                                                            item
                                                        )
                                                    }
                                                    className={`group relative overflow-hidden rounded-2xl border-2 bg-slate-50 text-left transition ${isSelected
                                                        ? "border-blue-600 ring-4 ring-blue-100"
                                                        : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                                                        }`}
                                                >
                                                    <div className="relative aspect-square overflow-hidden">
                                                        {src ? (
                                                            <Image
                                                                src={
                                                                    src
                                                                }
                                                                alt={
                                                                    item.alt ||
                                                                    item.title ||
                                                                    ""
                                                                }
                                                                fill
                                                                unoptimized
                                                                className="object-cover transition duration-300 group-hover:scale-105"
                                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-slate-300">
                                                                <ImageIcon
                                                                    size={
                                                                        30
                                                                    }
                                                                />
                                                            </div>
                                                        )}

                                                        {isSelected && (
                                                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                                                                <Check
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-3">
                                                        <p className="truncate text-xs font-bold text-slate-700">
                                                            {item.title ||
                                                                item.originalName ||
                                                                item.filename ||
                                                                "Untitled"}
                                                        </p>

                                                        {item.mimeType && (
                                                            <p className="mt-1 truncate text-[10px] text-slate-400">
                                                                {
                                                                    item.mimeType
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}

                        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-xs text-slate-500">
                                {total > 0
                                    ? `${total} media item${total ===
                                        1
                                        ? ""
                                        : "s"
                                    }`
                                    : "Media library"}
                            </p>

                            <div className="flex items-center justify-between gap-2 sm:justify-end">
                                <button
                                    type="button"
                                    disabled={
                                        page <=
                                        1 ||
                                        loading
                                    }
                                    onClick={
                                        previousPage
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        size={
                                            14
                                        }
                                    />
                                    Previous
                                </button>

                                <span className="px-2 text-xs font-bold text-slate-500">
                                    {page} /{" "}
                                    {
                                        totalPages
                                    }
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        totalPages ||
                                        loading
                                    }
                                    onClick={
                                        nextPage
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight
                                        size={
                                            14
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
