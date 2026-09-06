"use client";

import {
    ChangeEvent,
    DragEvent,
    useRef,
    useState,
    useEffect
} from "react";

import {
    CloudUpload,
    File,
    FileImage,
    FileText,
    Grid2X2,
    List,
    MoreHorizontal,
    Search,
    Trash2,
    Upload,
    Video,
    X,
} from "lucide-react";

type MediaItem = {
    id: string;
    name: string;
    url: string;
    type: "image" | "video" | "document";
    size: string;
    uploadedAt: string;
};

type MediaApiItem = {
    _id: string;
    name: string;
    originalName?: string;
    url: string;
    type: MediaItem["type"];
    size: number;
    createdAt: string;
};

function normalizeMediaItem(item: MediaApiItem): MediaItem {
    return {
        id: item._id,
        name: item.originalName || item.name,
        url: item.url,
        type: item.type,
        size: `${(item.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date(item.createdAt).toLocaleDateString(),
    };
}

export default function MediaManagement() {
    const inputRef =
        useRef<HTMLInputElement>(null);

    const [media, setMedia] =
        useState<MediaItem[]>([]);

    const [search, setSearch] =
        useState("");

    const [view, setView] =
        useState<"grid" | "list">(
            "grid"
        );

    const [dragging, setDragging] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [selected, setSelected] =
        useState<MediaItem | null>(
            null
        );
    async function loadMedia() {
        try {
            const response =
                await fetch(
                    "/api/media",
                    {
                        cache: "no-store",
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to load media."
                );
            }

            const normalized =
                (result.data as MediaApiItem[]).map(
                    normalizeMediaItem
                );

            setMedia(normalized);
        } catch (error) {
            console.error(
                "Failed to load media:",
                error
            );
        }
    }

    useEffect(() => {
        void Promise.resolve().then(loadMedia);
    }, []);
    const filteredMedia =
        media.filter((item) =>
            item.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    function openFilePicker() {
        inputRef.current?.click();
    }

    async function handleFiles(
        files: FileList | File[]
    ) {
        const selectedFiles =
            Array.from(files);

        if (!selectedFiles.length)
            return;

        try {
            setUploading(true);

            const formData =
                new FormData();

            selectedFiles.forEach(
                (file) => {
                    formData.append(
                        "files",
                        file
                    );
                }
            );

            const response =
                await fetch(
                    "/api/media",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Upload failed."
                );
            }

            const uploaded =
                result.data;

            const normalized =
                (uploaded as MediaApiItem[]).map(
                    normalizeMediaItem
                );

            setMedia((current) => [
                ...normalized,
                ...current,
            ]);
        } catch (error) {
            console.error(
                "Media upload error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Upload failed."
            );
        } finally {
            setUploading(false);
        }
    }

    function handleInput(
        event: ChangeEvent<HTMLInputElement>
    ) {
        if (event.target.files) {
            handleFiles(
                event.target.files
            );
        }

        event.target.value = "";
    }

    function handleDragOver(
        event: DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        setDragging(true);
    }

    function handleDragLeave(
        event: DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        setDragging(false);
    }

    function handleDrop(
        event: DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        setDragging(false);

        if (event.dataTransfer.files) {
            handleFiles(
                event.dataTransfer.files
            );
        }
    }

    async function deleteMedia(
        id: string
    ) {
        try {
            const response =
                await fetch(
                    `/api/media/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to delete media."
                );
            }

            setMedia(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !== id
                    )
            );

            if (
                selected?.id === id
            ) {
                setSelected(null);
            }
        } catch (error) {
            console.error(
                "Delete media error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete media."
            );
        }
    }

    function getIcon(
        type: MediaItem["type"]
    ) {
        if (type === "video")
            return Video;

        if (type === "document")
            return FileText;

        return FileImage;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Content
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Media Library
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage images, documents, videos,
                        and other assets used throughout
                        the ADM website.
                    </p>
                </div>

                <button
                    onClick={openFilePicker}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Upload size={18} />
                    Upload Media
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleInput}
                    className="hidden"
                />
            </section>

            {/* Upload area */}

            <section
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={[
                    "rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-12",
                    dragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white",
                ].join(" ")}
            >
                <div className="mx-auto flex max-w-xl flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <CloudUpload
                            size={26}
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-black text-slate-900">
                        {uploading
                            ? "Uploading..."
                            : "Drop your files here"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Drag and drop files here or{" "}
                        <button
                            onClick={
                                openFilePicker
                            }
                            className="font-bold text-blue-600 hover:text-blue-700"
                        >
                            browse from your device
                        </button>
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                        Images, videos, PDF and documents
                    </p>
                </div>
            </section>

            {/* Toolbar */}

            <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search media..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-500">
                            {filteredMedia.length}{" "}
                            files
                        </p>

                        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                            <button
                                onClick={() =>
                                    setView(
                                        "grid"
                                    )
                                }
                                className={[
                                    "rounded-lg p-2",
                                    view ===
                                        "grid"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-400",
                                ].join(
                                    " "
                                )}
                            >
                                <Grid2X2
                                    size={
                                        17
                                    }
                                />
                            </button>

                            <button
                                onClick={() =>
                                    setView(
                                        "list"
                                    )
                                }
                                className={[
                                    "rounded-lg p-2",
                                    view ===
                                        "list"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-400",
                                ].join(
                                    " "
                                )}
                            >
                                <List
                                    size={
                                        17
                                    }
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}

            {view === "grid" && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMedia.map(
                        (item) => {
                            const Icon =
                                getIcon(
                                    item.type
                                );

                            return (
                                <article
                                    key={
                                        item.id
                                    }
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <button
                                        onClick={() =>
                                            setSelected(
                                                item
                                            )
                                        }
                                        className="block w-full text-left"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                            {item.type ===
                                                "image" &&
                                                item.url ? (
                                                <img
                                                    src={
                                                        item.url
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400">
                                                    <Icon
                                                        size={
                                                            42
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/10" />
                                        </div>
                                    </button>

                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-slate-900">
                                                    {
                                                        item.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {
                                                        item.size
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        item.uploadedAt
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    deleteMedia(
                                                        item.id
                                                    )
                                                }
                                                className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                                                aria-label="Delete media"
                                            >
                                                <Trash2
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </section>
            )}

            {/* List */}

            {view === "list" && (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {filteredMedia.map(
                            (item) => {
                                const Icon =
                                    getIcon(
                                        item.type
                                    );

                                return (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="flex items-center gap-4 p-4"
                                    >
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                            {item.type ===
                                                "image" &&
                                                item.url ? (
                                                <img
                                                    src={
                                                        item.url
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400">
                                                    <Icon
                                                        size={
                                                            22
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                setSelected(
                                                    item
                                                )
                                            }
                                            className="min-w-0 flex-1 text-left"
                                        >
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {
                                                    item.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    item.size
                                                }{" "}
                                                ·{" "}
                                                {
                                                    item.uploadedAt
                                                }
                                            </p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteMedia(
                                                    item.id
                                                )
                                            }
                                            className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        <button className="hidden rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 sm:block">
                                            <MoreHorizontal
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </section>
            )}

            {/* Empty */}

            {!filteredMedia.length && (
                <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
                    <File
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-4 font-black text-slate-900">
                        No media found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Try another search or upload a new
                        file.
                    </p>
                </section>
            )}

            {/* Preview modal */}

            {selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelected(null)
                    }
                >
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        <button
                            onClick={() =>
                                setSelected(null)
                            }
                            className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2.5 text-slate-600 shadow-sm backdrop-blur hover:bg-white"
                        >
                            <X size={19} />
                        </button>

                        <div className="flex max-h-[90vh] flex-col lg:flex-row">
                            <div className="flex min-h-[300px] flex-1 items-center justify-center bg-slate-100 p-6">
                                {selected.type ===
                                    "image" &&
                                    selected.url ? (
                                    <img
                                        src={
                                            selected.url
                                        }
                                        alt={
                                            selected.name
                                        }
                                        className="max-h-[65vh] max-w-full rounded-xl object-contain"
                                    />
                                ) : (
                                    <FileText
                                        size={
                                            70
                                        }
                                        className="text-slate-300"
                                    />
                                )}
                            </div>

                            <div className="w-full p-6 lg:max-w-sm">
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Media Details
                                </p>

                                <h3 className="mt-2 break-words text-xl font-black text-slate-900">
                                    {
                                        selected.name
                                    }
                                </h3>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            Type
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {
                                                selected.type
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            Size
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {
                                                selected.size
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            Uploaded
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {
                                                selected.uploadedAt
                                            }
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        deleteMedia(
                                            selected.id
                                        );
                                        setSelected(
                                            null
                                        );
                                    }}
                                    className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100"
                                >
                                    <Trash2
                                        size={
                                            17
                                        }
                                    />
                                    Delete File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
