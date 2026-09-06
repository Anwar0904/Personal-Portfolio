"use client";

import {
    FormEvent,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Check,
    Edit3,
    Image as ImageIcon,
    Loader2,
    Mail,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Upload,
    UserRound,
    X,
} from "lucide-react";

/* ==========================================================================
   TYPES
   ========================================================================== */

type EmploymentStatus = "active" | "inactive";

type ContentStatus = "draft" | "published" | "archived";

type Skill = {
    name: string;
    level: number;
};

type MediaItem = {
    _id: string;
    name: string;
    originalName: string;
    url: string;
    type: "image" | "video" | "document";
    mimeType: string;
    size: number;
};

type SocialLinks = {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    website?: string;
};

type SeoData = {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;

    /*
     * Backend expects an OBJECT here.
     * We intentionally don't submit ogImage from this UI.
     */
    ogImage?: unknown;

    robots?: string;
};

type TeamMember = {
    _id: string;

    name: string;
    slug?: string;

    designation: string;

    shortBio?: string;
    biography?: string;

    avatar?: MediaItem | null;
    gallery?: MediaItem[];

    email?: string;
    phone?: string;

    experience?: number;

    skills?: Skill[];

    socialLinks?: SocialLinks;

    seo?: SeoData;

    status: ContentStatus;

    employmentStatus?: EmploymentStatus | null;

    featured: boolean;

    sortOrder?: number;

    createdAt?: string;
    updatedAt?: string;
};

type TeamListResponse = {
    teamMembers: TeamMember[];

    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

type FormState = {
    name: string;
    designation: string;
    shortBio: string;
    biography: string;

    email: string;
    phone: string;

    experience: number;

    avatar: MediaItem | null;

    skills: Skill[];

    socialLinks: SocialLinks;

    status: ContentStatus;

    employmentStatus: EmploymentStatus;

    featured: boolean;

    sortOrder: number;
};

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const EMPTY_FORM: FormState = {
    name: "",
    designation: "",
    shortBio: "",
    biography: "",

    email: "",
    phone: "",

    experience: 0,

    avatar: null,

    skills: [],

    socialLinks: {},

    status: "draft",

    employmentStatus: "active",

    featured: false,

    sortOrder: 0,
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

/**
 * Only returns a social URL when it is actually present.
 *
 * IMPORTANT:
 * We do NOT send:
 *
 * facebook: ""
 *
 * because z.url().optional() rejects an empty string.
 */
function cleanSocialLinks(
    links: SocialLinks
): SocialLinks {
    const result: SocialLinks = {};

    const fields: (keyof SocialLinks)[] = [
        "facebook",
        "linkedin",
        "twitter",
        "instagram",
        "github",
        "website",
    ];

    for (const field of fields) {
        const value = links[field]?.trim();

        if (value) {
            result[field] = value;
        }
    }

    return result;
}

/**
 * Basic URL validation on the client.
 */
function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}

/**
 * Build the exact payload that should go to the backend.
 *
 * Notice:
 *
 * - avatar = media ID
 * - gallery = array of media IDs
 * - socialLinks = only populated URLs
 * - seo is NOT manually sent
 *
 * This prevents the ogImage string/object mismatch.
 */
function buildPayload(form: FormState) {
    const socialLinks =
        cleanSocialLinks(form.socialLinks);

    const payload: Record<string, unknown> = {
        name: form.name.trim(),

        designation:
            form.designation.trim(),

        shortBio:
            form.shortBio.trim(),

        biography:
            form.biography.trim(),

        email:
            form.email.trim(),

        phone:
            form.phone.trim(),

        experience:
            Math.max(
                0,
                Number(form.experience) || 0
            ),

        avatar:
            form.avatar?._id ?? null,

        gallery: [],

        skills:
            form.skills
                .filter(
                    (skill) =>
                        skill.name.trim()
                )
                .map((skill) => ({
                    name:
                        skill.name.trim(),

                    level: Math.min(
                        100,
                        Math.max(
                            1,
                            Number(
                                skill.level
                            ) || 1
                        )
                    ),
                })),

        socialLinks,

        status: form.status,

        employmentStatus:
            form.employmentStatus,

        featured:
            Boolean(form.featured),

        sortOrder:
            Math.max(
                0,
                Number(form.sortOrder) || 0
            ),
    };

    return payload;
}

function formatFileSize(
    bytes: number
): string {
    if (!bytes) {
        return "0 KB";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.min(
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        ),
        units.length - 1
    );

    return `${(
        bytes /
        Math.pow(1024, index)
    ).toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
}

/* ==========================================================================
   API
   ========================================================================== */

async function parseApiResponse<T>(
    response: Response
): Promise<T> {
    let json: ApiResponse<T>;

    try {
        json =
            (await response.json()) as ApiResponse<T>;
    } catch {
        throw new Error(
            `Request failed with status ${response.status}.`
        );
    }

    if (
        !response.ok ||
        json.success === false
    ) {
        throw new Error(
            json.message ||
            "Request failed."
        );
    }

    return json.data;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function TeamManagement() {
    const [members, setMembers] =
        useState<TeamMember[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [
        employmentFilter,
        setEmploymentFilter,
    ] = useState<
        "All" | EmploymentStatus
    >("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<TeamMember | null>(null);

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState<TeamMember | null>(
        null
    );

    const [
        showMediaPicker,
        setShowMediaPicker,
    ] = useState(false);

    const [media, setMedia] =
        useState<MediaItem[]>([]);

    const [mediaLoading, setMediaLoading] =
        useState(false);

    const [mediaSearch, setMediaSearch] =
        useState("");

    const [form, setForm] =
        useState<FormState>({
            ...EMPTY_FORM,
            socialLinks: {},
            skills: [],
        });

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    /* ----------------------------------------------------------------------
       Notifications
       ---------------------------------------------------------------------- */

    const showSuccess = useCallback(
        (message: string) => {
            setSuccess(message);

            window.setTimeout(() => {
                setSuccess(null);
            }, 3000);
        },
        []
    );

    /* ----------------------------------------------------------------------
       Load Members
       ---------------------------------------------------------------------- */

    const loadMembers =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const params =
                    new URLSearchParams();

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (
                    employmentFilter !==
                    "All"
                ) {
                    params.set(
                        "employmentStatus",
                        employmentFilter
                    );
                }

                const response =
                    await fetch(
                        `/api/team-members?${params.toString()}`,
                        {
                            method: "GET",
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                const data =
                    await parseApiResponse<
                        | TeamMember[]
                        | TeamListResponse
                    >(response);

                if (
                    Array.isArray(data)
                ) {
                    setMembers(data);
                } else {
                    setMembers(
                        data.teamMembers ??
                        []
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load team members."
                );
            } finally {
                setLoading(false);
            }
        }, [
            search,
            employmentFilter,
        ]);

    useEffect(() => {
        const timer =
            window.setTimeout(() => {
                void loadMembers();
            }, 300);

        return () =>
            window.clearTimeout(
                timer
            );
    }, [loadMembers]);

    /* ----------------------------------------------------------------------
       Load Media
       ---------------------------------------------------------------------- */

    const loadMedia =
        useCallback(async () => {
            try {
                setMediaLoading(true);

                const params =
                    new URLSearchParams();

                params.set(
                    "type",
                    "image"
                );

                if (
                    mediaSearch.trim()
                ) {
                    params.set(
                        "search",
                        mediaSearch.trim()
                    );
                }

                const response =
                    await fetch(
                        `/api/media?${params.toString()}`,
                        {
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                const data =
                    await parseApiResponse<
                        | MediaItem[]
                        | {
                            media?: MediaItem[];
                        }
                    >(response);

                if (
                    Array.isArray(data)
                ) {
                    setMedia(data);
                } else {
                    setMedia(
                        data.media ?? []
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load media."
                );
            } finally {
                setMediaLoading(false);
            }
        }, [mediaSearch]);

    useEffect(() => {
        if (!showMediaPicker) {
            return;
        }

        const timer =
            window.setTimeout(() => {
                void loadMedia();
            }, 250);

        return () =>
            window.clearTimeout(
                timer
            );
    }, [
        showMediaPicker,
        loadMedia,
    ]);

    /* ----------------------------------------------------------------------
       Form
       ---------------------------------------------------------------------- */

    function resetForm() {
        setForm({
            ...EMPTY_FORM,
            socialLinks: {},
            skills: [],
        });

        setEditing(null);
    }

    function openCreate() {
        resetForm();
        setError(null);
        setShowForm(true);
    }

    function openEdit(
        member: TeamMember
    ) {
        setEditing(member);

        setForm({
            name: member.name ?? "",

            designation:
                member.designation ??
                "",

            shortBio:
                member.shortBio ?? "",

            biography:
                member.biography ?? "",

            email:
                member.email ?? "",

            phone:
                member.phone ?? "",

            experience:
                Number(
                    member.experience ?? 0
                ),

            avatar:
                member.avatar ?? null,

            skills:
                member.skills?.map(
                    (skill) => ({
                        name:
                            skill.name ??
                            "",
                        level:
                            Number(
                                skill.level ??
                                1
                            ),
                    })
                ) ?? [],

            socialLinks: {
                facebook:
                    member
                        .socialLinks
                        ?.facebook,

                linkedin:
                    member
                        .socialLinks
                        ?.linkedin,

                twitter:
                    member
                        .socialLinks
                        ?.twitter,

                instagram:
                    member
                        .socialLinks
                        ?.instagram,

                github:
                    member
                        .socialLinks
                        ?.github,

                website:
                    member
                        .socialLinks
                        ?.website,
            },

            status:
                member.status ??
                "draft",

            employmentStatus:
                member.employmentStatus ??
                "active",

            featured:
                Boolean(
                    member.featured
                ),

            sortOrder:
                Number(
                    member.sortOrder ?? 0
                ),
        });

        setError(null);
        setShowForm(true);
    }

    function closeForm() {
        if (
            saving ||
            uploading
        ) {
            return;
        }

        setShowForm(false);
        setShowMediaPicker(false);
        resetForm();
    }

    function updateForm<K extends keyof FormState>(
        key: K,
        value: FormState[K]
    ) {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function updateSocialLink(
        key: keyof SocialLinks,
        value: string
    ) {
        setForm((current) => ({
            ...current,

            socialLinks: {
                ...current.socialLinks,
                [key]: value,
            },
        }));
    }

    /* ----------------------------------------------------------------------
       Skills
       ---------------------------------------------------------------------- */

    function addSkill() {
        setForm((current) => ({
            ...current,

            skills: [
                ...current.skills,
                {
                    name: "",
                    level: 50,
                },
            ],
        }));
    }

    function updateSkill(
        index: number,
        key: keyof Skill,
        value: string | number
    ) {
        setForm((current) => ({
            ...current,

            skills:
                current.skills.map(
                    (
                        skill,
                        skillIndex
                    ) =>
                        skillIndex ===
                            index
                            ? {
                                ...skill,
                                [key]:
                                    value,
                            }
                            : skill
                ),
        }));
    }

    function removeSkill(
        index: number
    ) {
        setForm((current) => ({
            ...current,

            skills:
                current.skills.filter(
                    (_, i) =>
                        i !== index
                ),
        }));
    }

    /* ----------------------------------------------------------------------
       Upload
       ---------------------------------------------------------------------- */

    async function uploadImage(
        file: File
    ) {
        try {
            setUploading(true);
            setError(null);

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {
                throw new Error(
                    "Please select an image file."
                );
            }

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            const response =
                await fetch(
                    "/api/media",
                    {
                        method: "POST",
                        credentials:
                            "include",
                        body: formData,
                    }
                );

            const data =
                await parseApiResponse<
                    MediaItem | {
                        media?: MediaItem;
                    }
                >(response);

            let uploaded:
                | MediaItem
                | undefined;

            if (
                "media" in data
            ) {
                uploaded =
                    data.media;
            } else {
                uploaded =
                    data as MediaItem;
            }

            if (!uploaded?._id) {
                throw new Error(
                    "Image upload did not return a valid media item."
                );
            }

            setForm((current) => ({
                ...current,
                avatar: uploaded!,
            }));

            setShowMediaPicker(false);

            showSuccess(
                "Image uploaded successfully."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Image upload failed."
            );
        } finally {
            setUploading(false);
        }
    }

    /* ----------------------------------------------------------------------
       Submit
       ---------------------------------------------------------------------- */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (saving) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const name =
                form.name.trim();

            const designation =
                form.designation.trim();

            const shortBio =
                form.shortBio.trim();

            const biography =
                form.biography.trim();

            const email =
                form.email.trim();

            if (name.length < 2) {
                throw new Error(
                    "Full name must contain at least 2 characters."
                );
            }

            if (
                designation.length < 2
            ) {
                throw new Error(
                    "Designation must contain at least 2 characters."
                );
            }

            if (
                shortBio.length > 500
            ) {
                throw new Error(
                    "Short biography cannot exceed 500 characters."
                );
            }

            if (email) {
                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !emailPattern.test(
                        email
                    )
                ) {
                    throw new Error(
                        "Please enter a valid email address."
                    );
                }
            }

            /*
             * Validate social URLs BEFORE sending them.
             *
             * Empty fields are ignored.
             */
            const socialFields: Array<
                keyof SocialLinks
            > = [
                    "facebook",
                    "linkedin",
                    "twitter",
                    "instagram",
                    "github",
                    "website",
                ];

            for (const field of socialFields) {
                const value =
                    form.socialLinks[
                        field
                    ]?.trim();

                if (
                    value &&
                    !isValidUrl(value)
                ) {
                    throw new Error(
                        `${field} must be a valid URL beginning with http:// or https://.`
                    );
                }
            }

            /*
             * Build backend-compatible payload.
             *
             * CRITICAL:
             *
             * There is NO seo.ogImage here.
             *
             * Your backend said:
             *
             * seo.ogImage -> expected object
             *
             * while the old UI sent:
             *
             * seo.ogImage -> media ID string
             *
             * Therefore we don't send it.
             */
            const payload =
                buildPayload(form);

            const endpoint =
                editing
                    ? `/api/team-members/${editing._id}`
                    : "/api/team-members";

            const method =
                editing
                    ? "PATCH"
                    : "POST";

            const response =
                await fetch(
                    endpoint,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

            await parseApiResponse<TeamMember>(
                response
            );

            showSuccess(
                editing
                    ? "Team member updated successfully."
                    : "Team member created successfully."
            );

            setShowForm(false);
            setShowMediaPicker(false);

            resetForm();

            await loadMembers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save team member."
            );
        } finally {
            setSaving(false);
        }
    }

    /* ----------------------------------------------------------------------
       Delete
       ---------------------------------------------------------------------- */

    async function deleteMember() {
        if (!deleteTarget) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const response =
                await fetch(
                    `/api/team-members/${deleteTarget._id}`,
                    {
                        method: "DELETE",
                        credentials:
                            "include",
                    }
                );

            await parseApiResponse(
                response
            );

            setDeleteTarget(null);

            showSuccess(
                "Team member deleted successfully."
            );

            await loadMembers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete team member."
            );
        } finally {
            setSaving(false);
        }
    }

    /* ----------------------------------------------------------------------
       Featured
       ---------------------------------------------------------------------- */

    async function toggleFeatured(
        member: TeamMember
    ) {
        try {
            setError(null);

            const response =
                await fetch(
                    `/api/team-members/${member._id}/featured`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify({
                            featured:
                                !member.featured,
                        }),
                    }
                );

            await parseApiResponse<TeamMember>(
                response
            );

            setMembers((current) =>
                current.map((item) =>
                    item._id ===
                        member._id
                        ? {
                            ...item,
                            featured:
                                !item.featured,
                        }
                        : item
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update featured status."
            );
        }
    }

    /* ----------------------------------------------------------------------
       Stats
       ---------------------------------------------------------------------- */

    const total =
        members.length;

    const active =
        members.filter(
            (member) =>
                (member.employmentStatus ??
                    "active") ===
                "active"
        ).length;

    const inactive =
        members.filter(
            (member) =>
                member.employmentStatus ===
                "inactive"
        ).length;

    const featured =
        members.filter(
            (member) =>
                member.featured
        ).length;

    /* ----------------------------------------------------------------------
       UI
       ---------------------------------------------------------------------- */

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
            {/* HEADER */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        Organization
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Team
                        </h1>

                        <button
                            type="button"
                            onClick={() =>
                                void loadMembers()
                            }
                            disabled={
                                loading
                            }
                            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Manage the people who
                        represent ADM across
                        the website.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        openCreate
                    }
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Member
                </button>
            </section>

            {/* ALERTS */}

            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError(null)
                    }
                />
            )}

            {success && (
                <Alert
                    type="success"
                    message={success}
                    onClose={() =>
                        setSuccess(null)
                    }
                />
            )}

            {/* STATS */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    label="Total Members"
                    value={total}
                />

                <Stat
                    label="Active"
                    value={active}
                    className="text-emerald-600"
                />

                <Stat
                    label="Inactive"
                    value={inactive}
                    className="text-amber-600"
                />

                <Stat
                    label="Featured"
                    value={featured}
                    className="text-blue-600"
                />
            </section>

            {/* FILTERS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                            placeholder="Search team members..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="flex gap-2">
                        {[
                            {
                                value: "All",
                                label: "All",
                            },
                            {
                                value: "active",
                                label: "Active",
                            },
                            {
                                value: "inactive",
                                label: "Inactive",
                            },
                        ].map(
                            (item) => (
                                <button
                                    key={
                                        item.value
                                    }
                                    type="button"
                                    onClick={() =>
                                        setEmploymentFilter(
                                            item.value as
                                            | "All"
                                            | EmploymentStatus
                                        )
                                    }
                                    className={`rounded-xl px-4 py-2.5 text-sm font-bold ${employmentFilter ===
                                            item.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {
                                        item.label
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* CONTENT */}

            {loading ? (
                <LoadingState />
            ) : members.length ? (
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {members.map(
                        (member) => (
                            <TeamCard
                                key={
                                    member._id
                                }
                                member={
                                    member
                                }
                                onEdit={
                                    openEdit
                                }
                                onDelete={() =>
                                    setDeleteTarget(
                                        member
                                    )
                                }
                                onToggleFeatured={
                                    toggleFeatured
                                }
                            />
                        )
                    )}
                </section>
            ) : (
                <EmptyState
                    onAdd={
                        openCreate
                    }
                />
            )}

            {/* FORM MODAL */}

            {showForm && (
                <TeamFormModal
                    form={form}
                    editing={editing}
                    saving={saving}
                    uploading={
                        uploading
                    }
                    onClose={
                        closeForm
                    }
                    onSubmit={
                        handleSubmit
                    }
                    updateForm={
                        updateForm
                    }
                    updateSocialLink={
                        updateSocialLink
                    }
                    addSkill={
                        addSkill
                    }
                    updateSkill={
                        updateSkill
                    }
                    removeSkill={
                        removeSkill
                    }
                    openMedia={() =>
                        setShowMediaPicker(
                            true
                        )
                    }
                    uploadImage={
                        uploadImage
                    }
                />
            )}

            {/* MEDIA */}

            {showMediaPicker && (
                <MediaPicker
                    media={media}
                    loading={
                        mediaLoading
                    }
                    search={
                        mediaSearch
                    }
                    selectedId={
                        form.avatar?._id ??
                        null
                    }
                    onSearch={
                        setMediaSearch
                    }
                    onClose={() =>
                        setShowMediaPicker(
                            false
                        )
                    }
                    onSelect={(item) => {
                        updateForm(
                            "avatar",
                            item
                        );

                        setShowMediaPicker(
                            false
                        );
                    }}
                />
            )}

            {/* DELETE */}

            {deleteTarget && (
                <DeleteModal
                    member={
                        deleteTarget
                    }
                    loading={
                        saving
                    }
                    onCancel={() =>
                        setDeleteTarget(
                            null
                        )
                    }
                    onConfirm={
                        deleteMember
                    }
                />
            )}
        </div>
    );
}

/* ==========================================================================
   FORM MODAL
   ========================================================================== */

function TeamFormModal({
    form,
    editing,
    saving,
    uploading,
    onClose,
    onSubmit,
    updateForm,
    updateSocialLink,
    addSkill,
    updateSkill,
    removeSkill,
    openMedia,
    uploadImage,
}: {
    form: FormState;
    editing: TeamMember | null;
    saving: boolean;
    uploading: boolean;

    onClose: () => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    updateForm: <
        K extends keyof FormState
    >(
        key: K,
        value: FormState[K]
    ) => void;

    updateSocialLink: (
        key: keyof SocialLinks,
        value: string
    ) => void;

    addSkill: () => void;

    updateSkill: (
        index: number,
        key: keyof Skill,
        value: string | number
    ) => void;

    removeSkill: (
        index: number
    ) => void;

    openMedia: () => void;

    uploadImage: (
        file: File
    ) => Promise<void>;
}) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Team
                        </p>

                        <h2 className="mt-1 text-xl font-black text-slate-900">
                            {editing
                                ? "Edit Team Member"
                                : "Add Team Member"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form
                    onSubmit={
                        onSubmit
                    }
                    className="max-h-[80vh] overflow-y-auto p-6"
                >
                    {/* BASIC */}

                    <FormSection title="Basic Information">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Full Name">
                                <input
                                    value={
                                        form.name
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "name",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                    minLength={
                                        2
                                    }
                                    maxLength={
                                        120
                                    }
                                    placeholder="e.g. Anwar Ul Haq"
                                    className="input"
                                />
                            </Field>

                            <Field label="Designation">
                                <input
                                    value={
                                        form.designation
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "designation",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                    minLength={
                                        2
                                    }
                                    maxLength={
                                        120
                                    }
                                    placeholder="e.g. Senior Developer"
                                    className="input"
                                />
                            </Field>

                            <Field label="Email">
                                <input
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "email",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="member@example.com"
                                    className="input"
                                />
                            </Field>

                            <Field label="Phone">
                                <input
                                    type="tel"
                                    value={
                                        form.phone
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "phone",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="+92 300 0000000"
                                    className="input"
                                />
                            </Field>

                            <Field label="Experience (Years)">
                                <input
                                    type="number"
                                    min={
                                        0
                                    }
                                    value={
                                        form.experience
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "experience",
                                            Math.max(
                                                0,
                                                Number(
                                                    e
                                                        .target
                                                        .value
                                                ) ||
                                                0
                                            )
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <Field label="Sort Order">
                                <input
                                    type="number"
                                    min={
                                        0
                                    }
                                    value={
                                        form.sortOrder
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "sortOrder",
                                            Math.max(
                                                0,
                                                Number(
                                                    e
                                                        .target
                                                        .value
                                                ) ||
                                                0
                                            )
                                        )
                                    }
                                    className="input"
                                />
                            </Field>
                        </div>
                    </FormSection>

                    {/* IMAGE */}

                    <FormSection title="Profile Image">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    {form.avatar?.url ? (
                                        <img
                                            src={
                                                form.avatar.url
                                            }
                                            alt={
                                                form
                                                    .avatar
                                                    .originalName ||
                                                "Profile image"
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserRound
                                            size={
                                                38
                                            }
                                            className="text-slate-300"
                                        />
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {form.avatar
                                            ?.originalName ||
                                            "No image selected"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Select an existing
                                        image or upload a new
                                        one.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={
                                                openMedia
                                            }
                                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
                                        >
                                            <ImageIcon
                                                size={
                                                    15
                                                }
                                            />
                                            Select Image
                                        </button>

                                        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50">
                                            {uploading ? (
                                                <Loader2
                                                    size={
                                                        15
                                                    }
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Upload
                                                    size={
                                                        15
                                                    }
                                                />
                                            )}

                                            Upload

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={
                                                    uploading
                                                }
                                                onChange={(
                                                    e
                                                ) => {
                                                    const file =
                                                        e
                                                            .target
                                                            .files?.[0];

                                                    if (
                                                        file
                                                    ) {
                                                        void uploadImage(
                                                            file
                                                        );
                                                    }

                                                    e.currentTarget.value =
                                                        "";
                                                }}
                                            />
                                        </label>

                                        {form.avatar && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateForm(
                                                        "avatar",
                                                        null
                                                    )
                                                }
                                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-xs font-bold text-red-600 hover:bg-red-50"
                                            >
                                                <X
                                                    size={
                                                        15
                                                    }
                                                />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* BIO */}

                    <FormSection title="Biography">
                        <div className="space-y-5">
                            <Field label="Short Bio">
                                <textarea
                                    value={
                                        form.shortBio
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "shortBio",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    maxLength={
                                        500
                                    }
                                    rows={3}
                                    placeholder="A concise professional introduction..."
                                    className="input min-h-24 resize-none py-3"
                                />

                                <p className="mt-1 text-right text-[11px] text-slate-400">
                                    {
                                        form
                                            .shortBio
                                            .length
                                    }
                                    /500
                                </p>
                            </Field>

                            <Field label="Biography">
                                <textarea
                                    value={
                                        form.biography
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "biography",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    rows={6}
                                    placeholder="Write the complete professional biography..."
                                    className="input min-h-36 resize-none py-3"
                                />
                            </Field>
                        </div>
                    </FormSection>

                    {/* SKILLS */}

                    <FormSection title="Skills">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Add professional skills and
                                proficiency levels.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    addSkill
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                            >
                                <Plus
                                    size={
                                        14
                                    }
                                />
                                Add Skill
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {form.skills.map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row"
                                    >
                                        <input
                                            value={
                                                skill.name
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateSkill(
                                                    index,
                                                    "name",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Skill name"
                                            className="input flex-1"
                                        />

                                        <div className="flex items-center gap-2 sm:w-52">
                                            <input
                                                type="number"
                                                min={
                                                    1
                                                }
                                                max={
                                                    100
                                                }
                                                value={
                                                    skill.level
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateSkill(
                                                        index,
                                                        "level",
                                                        Math.min(
                                                            100,
                                                            Math.max(
                                                                1,
                                                                Number(
                                                                    e
                                                                        .target
                                                                        .value
                                                                ) ||
                                                                1
                                                            )
                                                        )
                                                    )
                                                }
                                                className="input"
                                            />

                                            <span className="text-xs font-bold text-slate-400">
                                                %
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSkill(
                                                        index
                                                    )
                                                }
                                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}

                            {!form.skills
                                .length && (
                                    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                                        <p className="text-sm font-semibold text-slate-500">
                                            No skills added.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </FormSection>

                    {/* SOCIAL */}

                    <FormSection title="Social Links">
                        <p className="mb-4 text-xs text-slate-400">
                            Leave fields empty if the member
                            does not have that social profile.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <SocialInput
                                label="LinkedIn"
                                value={
                                    form
                                        .socialLinks
                                        .linkedin ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "linkedin",
                                        value
                                    )
                                }
                                placeholder="https://linkedin.com/in/..."
                            />

                            <SocialInput
                                label="GitHub"
                                value={
                                    form
                                        .socialLinks
                                        .github ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "github",
                                        value
                                    )
                                }
                                placeholder="https://github.com/..."
                            />

                            <SocialInput
                                label="Facebook"
                                value={
                                    form
                                        .socialLinks
                                        .facebook ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "facebook",
                                        value
                                    )
                                }
                                placeholder="https://facebook.com/..."
                            />

                            <SocialInput
                                label="Instagram"
                                value={
                                    form
                                        .socialLinks
                                        .instagram ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "instagram",
                                        value
                                    )
                                }
                                placeholder="https://instagram.com/..."
                            />

                            <SocialInput
                                label="Twitter / X"
                                value={
                                    form
                                        .socialLinks
                                        .twitter ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "twitter",
                                        value
                                    )
                                }
                                placeholder="https://x.com/..."
                            />

                            <SocialInput
                                label="Website"
                                value={
                                    form
                                        .socialLinks
                                        .website ??
                                    ""
                                }
                                onChange={(value) =>
                                    updateSocialLink(
                                        "website",
                                        value
                                    )
                                }
                                placeholder="https://example.com"
                            />
                        </div>
                    </FormSection>

                    {/* STATUS */}

                    <FormSection title="Publishing & Employment">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Publishing Status">
                                <select
                                    value={
                                        form.status
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "status",
                                            e
                                                .target
                                                .value as ContentStatus
                                        )
                                    }
                                    className="input"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="published">
                                        Published
                                    </option>

                                    <option value="archived">
                                        Archived
                                    </option>
                                </select>
                            </Field>

                            <Field label="Employment Status">
                                <select
                                    value={
                                        form.employmentStatus
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateForm(
                                            "employmentStatus",
                                            e
                                                .target
                                                .value as EmploymentStatus
                                        )
                                    }
                                    className="input"
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </Field>
                        </div>

                        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/30">
                            <input
                                type="checkbox"
                                checked={
                                    form.featured
                                }
                                onChange={(
                                    e
                                ) =>
                                    updateForm(
                                        "featured",
                                        e
                                            .target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                            />

                            <div>
                                <p className="text-sm font-bold text-slate-800">
                                    Featured member
                                </p>

                                <p className="text-xs text-slate-500">
                                    Show this member in
                                    prominent team sections.
                                </p>
                            </div>
                        </label>
                    </FormSection>

                    {/* ACTIONS */}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                saving ||
                                uploading
                            }
                            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                uploading
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving && (
                                <Loader2
                                    size={
                                        16
                                    }
                                    className="animate-spin"
                                />
                            )}

                            {editing
                                ? "Save Changes"
                                : "Create Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ==========================================================================
   TEAM CARD
   ========================================================================== */

function TeamCard({
    member,
    onEdit,
    onDelete,
    onToggleFeatured,
}: {
    member: TeamMember;

    onEdit: (
        member: TeamMember
    ) => void;

    onDelete: () => void;

    onToggleFeatured: (
        member: TeamMember
    ) => void;
}) {
    const employmentStatus =
        member.employmentStatus ??
        "active";

    const avatar =
        member.avatar?.url;

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={
                            member.name
                        }
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <UserRound
                            size={
                                55
                            }
                            className="text-slate-300"
                        />
                    </div>
                )}

                <div className="absolute left-4 top-4 flex gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black text-white ${employmentStatus ===
                                "active"
                                ? "bg-emerald-500"
                                : "bg-slate-700"
                            }`}
                    >
                        {employmentStatus.toUpperCase()}
                    </span>

                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-slate-700">
                        {member.status.toUpperCase()}
                    </span>
                </div>

                {member.featured && (
                    <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-blue-700">
                        FEATURED
                    </span>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-black text-slate-900">
                            {
                                member.name
                            }
                        </h2>

                        <p className="mt-1 truncate text-sm font-bold text-blue-600">
                            {
                                member.designation
                            }
                        </p>
                    </div>

                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                onEdit(
                                    member
                                )
                            }
                            className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Edit3
                                size={
                                    16
                                }
                            />
                        </button>

                        <button
                            type="button"
                            onClick={
                                onDelete
                            }
                            className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2
                                size={
                                    16
                                }
                            />
                        </button>
                    </div>
                </div>

                {member.experience &&
                    member.experience >
                    0 && (
                        <div className="mt-3 inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                            {
                                member.experience
                            }{" "}
                            {member.experience ===
                                1
                                ? "year"
                                : "years"}{" "}
                            experience
                        </div>
                    )}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {member.shortBio ||
                        member.biography ||
                        "No biography available."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
                        {member.email ? (
                            <>
                                <Mail
                                    size={
                                        14
                                    }
                                />

                                <span className="truncate">
                                    {
                                        member.email
                                    }
                                </span>
                            </>
                        ) : (
                            "No email"
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onToggleFeatured(
                                member
                            )
                        }
                        className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black ${member.featured
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                    >
                        {member.featured
                            ? "Featured"
                            : "Feature"}
                    </button>
                </div>
            </div>
        </article>
    );
}

/* ==========================================================================
   MEDIA PICKER
   ========================================================================== */

function MediaPicker({
    media,
    loading,
    search,
    selectedId,
    onSearch,
    onClose,
    onSelect,
}: {
    media: MediaItem[];
    loading: boolean;
    search: string;
    selectedId: string | null;

    onSearch: (
        value: string
    ) => void;

    onClose: () => void;

    onSelect: (
        item: MediaItem
    ) => void;
}) {
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Media Library
                        </p>

                        <h2 className="mt-1 text-xl font-black text-slate-900">
                            Select Profile Image
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="border-b border-slate-100 p-4">
                    <div className="relative">
                        <Search
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={
                                search
                            }
                            onChange={(
                                e
                            ) =>
                                onSearch(
                                    e
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search images..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center">
                            <Loader2
                                size={
                                    28
                                }
                                className="animate-spin text-blue-600"
                            />
                        </div>
                    ) : media.length ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {media.map(
                                (
                                    item
                                ) => {
                                    const selected =
                                        item._id ===
                                        selectedId;

                                    return (
                                        <button
                                            key={
                                                item._id
                                            }
                                            type="button"
                                            onClick={() =>
                                                onSelect(
                                                    item
                                                )
                                            }
                                            className={`overflow-hidden rounded-2xl border-2 text-left ${selected
                                                    ? "border-blue-600"
                                                    : "border-transparent hover:border-slate-300"
                                                }`}
                                        >
                                            <div className="relative aspect-square bg-slate-100">
                                                <img
                                                    src={
                                                        item.url
                                                    }
                                                    alt={
                                                        item.originalName ||
                                                        item.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                                {selected && (
                                                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                                        <Check
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2.5">
                                                <p className="truncate text-xs font-bold text-slate-700">
                                                    {
                                                        item.originalName
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {formatFileSize(
                                                        item.size
                                                    )}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-64 items-center justify-center text-sm text-slate-400">
                            No images found.
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-100 p-4">
                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   DELETE MODAL
   ========================================================================== */

function DeleteModal({
    member,
    loading,
    onCancel,
    onConfirm,
}: {
    member: TeamMember;
    loading: boolean;

    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Trash2
                        size={21}
                    />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">
                    Delete team member?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    This will remove{" "}
                    <strong className="text-slate-700">
                        {member.name}
                    </strong>{" "}
                    from the team.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={
                            onCancel
                        }
                        disabled={
                            loading
                        }
                        className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            onConfirm
                        }
                        disabled={
                            loading
                        }
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white disabled:opacity-60"
                    >
                        {loading && (
                            <Loader2
                                size={
                                    16
                                }
                                className="animate-spin"
                            />
                        )}

                        Delete Member
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   SMALL UI COMPONENTS
   ========================================================================== */

function SocialInput({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (
        value: string
    ) => void;
    placeholder: string;
}) {
    return (
        <Field label={label}>
            <input
                type="url"
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                placeholder={
                    placeholder
                }
                className="input"
            />
        </Field>
    );
}

function FormSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                {title}
            </h3>

            <div className="mt-4">
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>

            {children}
        </div>
    );
}

function Stat({
    label,
    value,
    className = "text-slate-900",
}: {
    label: string;
    value: number;
    className?: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p
                className={`mt-2 text-3xl font-black ${className}`}
            >
                {value}
            </p>
        </div>
    );
}

function Alert({
    type,
    message,
    onClose,
}: {
    type: "error" | "success";
    message: string;
    onClose: () => void;
}) {
    return (
        <div
            className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${type ===
                    "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
        >
            <span>
                {message}
            </span>

            <button
                type="button"
                onClick={
                    onClose
                }
            >
                <X size={16} />
            </button>
        </div>
    );
}

function LoadingState() {
    return (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
                length: 6,
            }).map(
                (_, index) => (
                    <div
                        key={
                            index
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                        <div className="h-48 animate-pulse bg-slate-100" />

                        <div className="space-y-3 p-5">
                            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />

                            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

                            <div className="h-12 animate-pulse rounded bg-slate-100" />
                        </div>
                    </div>
                )
            )}
        </section>
    );
}

function EmptyState({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UserRound
                    size={25}
                />
            </div>

            <h2 className="mt-4 font-black text-slate-900">
                No team members found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                There are no team members matching
                your current filters.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white"
            >
                <Plus size={16} />
                Add Member
            </button>
        </section>
    );
}