"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

type LeadStatus =
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "converted"
    | "lost";

type LeadSource =
    | "website"
    | "referral"
    | "social_media"
    | "email"
    | "phone"
    | "other";

type ConsultationStatus =
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rescheduled";

type MeetingType =
    | "zoom"
    | "in_person"
    | "phone";

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Service {
    _id: string;
    name?: string;
    title?: string;
}

interface LeadNote {
    _id?: string;
    note: string;
    content?: string;
    createdAt?: string;
    createdBy?: User | null;
}

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    projectTitle?: string;
    projectType?: string;
    timeline?: string;
    preferredContact?: string;
    message?: string;
    budget?: {
        min?: number;
        max?: number;
        currency?: string;
        amount?: number;
        type?: string;
    } | null;
    interestedServices?: Service[];
    assignedTo?: User | null;
    source?: LeadSource;
    status: LeadStatus;
    contactedAt?: string;
    convertedAt?: string;
    notes?: LeadNote[];
    createdAt: string;
    updatedAt: string;
}

interface Consultation {
    _id: string;
    lead: Lead;
    assignedTo?: User | null;
    scheduledAt: string;
    duration: number;
    meetingType: MeetingType;
    meetingLink?: string;
    location?: string;
    agenda?: string;
    status: ConsultationStatus;
    notes?: {
        _id?: string;
        content: string;
        createdAt?: string;
        createdBy?: User;
    }[];
    createdAt: string;
    updatedAt: string;
}

interface ApiResult<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface LeadListResponse {
    leads: Lead[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface ConsultationListResponse {
    consultations: Consultation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const leadStatusStyles: Record<
    LeadStatus,
    string
> = {
    new: "bg-blue-50 text-blue-700 border-blue-100",
    contacted:
        "bg-violet-50 text-violet-700 border-violet-100",
    qualified:
        "bg-cyan-50 text-cyan-700 border-cyan-100",
    proposal:
        "bg-amber-50 text-amber-700 border-amber-100",
    negotiation:
        "bg-orange-50 text-orange-700 border-orange-100",
    converted:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
    lost:
        "bg-red-50 text-red-700 border-red-100",
};

const consultationStatusStyles: Record<
    ConsultationStatus,
    string
> = {
    scheduled:
        "bg-blue-50 text-blue-700 border-blue-100",
    completed:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled:
        "bg-red-50 text-red-700 border-red-100",
    rescheduled:
        "bg-amber-50 text-amber-700 border-amber-100",
};

const leadStatusLabels: Record<
    LeadStatus,
    string
> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    converted: "Converted",
    lost: "Lost",
};

const meetingLabels: Record<
    MeetingType,
    string
> = {
    zoom: "Online",
    in_person: "In Person",
    phone: "Phone",
};

function getLeadName(lead?: Lead | null) {
    return (
        lead?.fullName ||
        "Unknown lead"
    );
}

function formatDate(date?: string) {
    if (!date) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
}

function formatDateTime(date?: string) {
    if (!date) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(date));
}

function formatTime(date?: string) {
    if (!date) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(date));
}

function isToday(date: string) {
    const value = new Date(date);
    const now = new Date();

    return (
        value.getDate() === now.getDate() &&
        value.getMonth() === now.getMonth() &&
        value.getFullYear() ===
        now.getFullYear()
    );
}

function isUpcoming(
    consultation: Consultation
) {
    return (
        consultation.status ===
        "scheduled" &&
        new Date(
            consultation.scheduledAt
        ) > new Date()
    );
}

export default function ConsultationsPage() {
    const [activeView, setActiveView] =
        useState<
            "overview" | "leads" | "consultations"
        >("overview");

    const [consultations, setConsultations] =
        useState<Consultation[]>([]);

    const [leads, setLeads] =
        useState<Lead[]>([]);

    const [consultationLoading, setConsultationLoading] =
        useState(true);

    const [leadLoading, setLeadLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [leadSearch, setLeadSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [leadStatus, setLeadStatus] =
        useState("");

    const [meetingType, setMeetingType] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [leadPage, setLeadPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [leadTotalPages, setLeadTotalPages] =
        useState(1);

    const [selectedConsultation, setSelectedConsultation] =
        useState<Consultation | null>(
            null
        );

    const [selectedLead, setSelectedLead] =
        useState<Lead | null>(null);

    const [showCreateConsultation, setShowCreateConsultation] =
        useState(false);

    const [showCreateLead, setShowCreateLead] =
        useState(false);

    const [showNote, setShowNote] =
        useState(false);

    const [showLeadNote, setShowLeadNote] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const fetchConsultations =
        useCallback(async () => {
            try {
                setConsultationLoading(true);
                setError("");

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(page)
                );

                params.set(
                    "limit",
                    "10"
                );

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (status) {
                    params.set(
                        "status",
                        status
                    );
                }

                if (meetingType) {
                    params.set(
                        "meetingType",
                        meetingType
                    );
                }

                const response =
                    await fetch(
                        `/api/consultations?${params.toString()}`,
                        {
                            credentials:
                                "include",
                            cache:
                                "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<ConsultationListResponse>;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to load consultations."
                    );
                }

                setConsultations(
                    result.data.consultations
                );

                setTotalPages(
                    result.data.pagination
                        .totalPages || 1
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load consultations."
                );
            } finally {
                setConsultationLoading(
                    false
                );
                setRefreshing(false);
            }
        }, [
            page,
            search,
            status,
            meetingType,
        ]);

    const fetchLeads =
        useCallback(async () => {
            try {
                setLeadLoading(true);

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(leadPage)
                );

                params.set(
                    "limit",
                    "10"
                );

                if (leadSearch.trim()) {
                    params.set(
                        "search",
                        leadSearch.trim()
                    );
                }

                if (leadStatus) {
                    params.set(
                        "status",
                        leadStatus
                    );
                }

                const response =
                    await fetch(
                        `/api/leads?${params.toString()}`,
                        {
                            credentials:
                                "include",
                            cache:
                                "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<LeadListResponse>;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to load leads."
                    );
                }

                setLeads(
                    result.data.leads
                );

                setLeadTotalPages(
                    result.data.pagination
                        .totalPages || 1
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load leads."
                );
            } finally {
                setLeadLoading(false);
            }
        }, [
            leadPage,
            leadSearch,
            leadStatus,
        ]);

    useEffect(() => {
        const timer = setTimeout(
            fetchConsultations,
            300
        );

        return () =>
            clearTimeout(timer);
    }, [fetchConsultations]);

    useEffect(() => {
        const timer = setTimeout(
            fetchLeads,
            300
        );

        return () =>
            clearTimeout(timer);
    }, [fetchLeads]);

    const refresh = async () => {
        setRefreshing(true);

        await Promise.all([
            fetchConsultations(),
            fetchLeads(),
        ]);

        setRefreshing(false);
    };

    const consultationStats =
        useMemo(() => {
            const scheduled =
                consultations.filter(
                    (item) =>
                        item.status ===
                        "scheduled"
                ).length;

            const today =
                consultations.filter(
                    (item) =>
                        item.status ===
                        "scheduled" &&
                        isToday(
                            item.scheduledAt
                        )
                ).length;

            const completed =
                consultations.filter(
                    (item) =>
                        item.status ===
                        "completed"
                ).length;

            const upcoming =
                consultations.filter(
                    isUpcoming
                ).length;

            return {
                scheduled,
                today,
                completed,
                upcoming,
            };
        }, [consultations]);

    const leadStats =
        useMemo(() => {
            return {
                total: leads.length,
                new: leads.filter(
                    (lead) =>
                        lead.status === "new"
                ).length,
                contacted: leads.filter(
                    (lead) =>
                        lead.status ===
                        "contacted"
                ).length,
                qualified: leads.filter(
                    (lead) =>
                        lead.status ===
                        "qualified"
                ).length,
                converted: leads.filter(
                    (lead) =>
                        lead.status ===
                        "converted"
                ).length,
            };
        }, [leads]);

    async function updateConsultationStatus(
        id: string,
        nextStatus: ConsultationStatus
    ) {
        try {
            const response =
                await fetch(
                    `/api/consultations/${id}/status`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials:
                            "include",
                        body: JSON.stringify({
                            status:
                                nextStatus,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Consultation>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to update consultation."
                );
            }

            setSelectedConsultation(
                result.data
            );

            setConsultations(
                (current) =>
                    current.map(
                        (item) =>
                            item._id === id
                                ? result.data
                                : item
                    )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to update status."
            );
        }
    }

    async function updateLeadStatus(
        id: string,
        nextStatus: LeadStatus
    ) {
        try {
            const response =
                await fetch(
                    `/api/leads/${id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials:
                            "include",
                        body: JSON.stringify({
                            status:
                                nextStatus,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Lead>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to update lead."
                );
            }

            setSelectedLead(
                result.data
            );

            setLeads(
                (current) =>
                    current.map(
                        (item) =>
                            item._id === id
                                ? result.data
                                : item
                    )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to update lead."
            );
        }
    }

    async function markLeadContacted(
        id: string
    ) {
        try {
            const response =
                await fetch(
                    `/api/leads/${id}/contacted`,
                    {
                        method: "PATCH",
                        credentials:
                            "include",
                    }
                );

            const result =
                (await response.json()) as ApiResult<Lead>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to mark lead as contacted."
                );
            }

            setSelectedLead(
                result.data
            );

            setLeads(
                (current) =>
                    current.map(
                        (item) =>
                            item._id === id
                                ? result.data
                                : item
                    )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to mark contacted."
            );
        }
    }

    async function addConsultationNote(
        id: string,
        content: string
    ) {
        const response =
            await fetch(
                `/api/consultations/${id}/notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials:
                        "include",
                    body: JSON.stringify({
                        content,
                    }),
                }
            );

        const result =
            (await response.json()) as ApiResult<Consultation>;

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to add note."
            );
        }

        setSelectedConsultation(
            result.data
        );

        setConsultations(
            (current) =>
                current.map(
                    (item) =>
                        item._id === id
                            ? result.data
                            : item
                )
        );

        setShowNote(false);
    }

    async function addLeadNote(
        id: string,
        content: string
    ) {
        const response =
            await fetch(
                `/api/leads/${id}/notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials:
                        "include",
                    body: JSON.stringify({
                        note: content,
                    }),
                }
            );

        const result =
            (await response.json()) as ApiResult<Lead>;

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to add lead note."
            );
        }

        setSelectedLead(
            result.data
        );

        setLeads(
            (current) =>
                current.map(
                    (item) =>
                        item._id === id
                            ? result.data
                            : item
                )
        );

        setShowLeadNote(false);
    }

    async function deleteLead(
        id: string
    ) {
        if (
            !window.confirm(
                "Move this lead to deleted records?"
            )
        ) {
            return;
        }

        try {
            const response =
                await fetch(
                    `/api/leads/${id}`,
                    {
                        method: "DELETE",
                        credentials:
                            "include",
                    }
                );

            const result =
                (await response.json()) as ApiResult<null>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to delete lead."
                );
            }

            setSelectedLead(null);

            await fetchLeads();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to delete lead."
            );
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <span>
                                Admin
                            </span>
                            <span>/</span>
                            <span className="text-slate-900">
                                CRM
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Leads & Consultations
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage incoming leads, follow-ups and scheduled consultations from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={
                                refreshing
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                        >
                            <span
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            >
                                ↻
                            </span>
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowCreateLead(
                                    true
                                )
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                        >
                            + New Lead
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowCreateConsultation(
                                    true
                                )
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                        >
                            + New Consultation
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-3 lg:grid-cols-7">
                    <StatCard
                        label="Leads"
                        value={
                            leadStats.total
                        }
                    />

                    <StatCard
                        label="New"
                        value={
                            leadStats.new
                        }
                    />

                    <StatCard
                        label="Contacted"
                        value={
                            leadStats.contacted
                        }
                    />

                    <StatCard
                        label="Qualified"
                        value={
                            leadStats.qualified
                        }
                    />

                    <StatCard
                        label="Converted"
                        value={
                            leadStats.converted
                        }
                    />

                    <StatCard
                        label="Today"
                        value={
                            consultationStats.today
                        }
                    />

                    <StatCard
                        label="Upcoming"
                        value={
                            consultationStats.upcoming
                        }
                    />
                </section>

                <section className="flex overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <ViewTab
                        active={
                            activeView ===
                            "overview"
                        }
                        onClick={() =>
                            setActiveView(
                                "overview"
                            )
                        }
                    >
                        Overview
                    </ViewTab>

                    <ViewTab
                        active={
                            activeView ===
                            "leads"
                        }
                        onClick={() =>
                            setActiveView(
                                "leads"
                            )
                        }
                    >
                        Leads
                    </ViewTab>

                    <ViewTab
                        active={
                            activeView ===
                            "consultations"
                        }
                        onClick={() =>
                            setActiveView(
                                "consultations"
                            )
                        }
                    >
                        Consultations
                    </ViewTab>
                </section>

                {error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                {activeView ===
                    "overview" && (
                        <Overview
                            leads={leads}
                            consultations={
                                consultations
                            }
                            loading={
                                leadLoading ||
                                consultationLoading
                            }
                            onLead={(lead) =>
                                setSelectedLead(
                                    lead
                                )
                            }
                            onConsultation={(
                                consultation
                            ) =>
                                setSelectedConsultation(
                                    consultation
                                )
                            }
                            onViewLeads={() =>
                                setActiveView(
                                    "leads"
                                )
                            }
                            onViewConsultations={() =>
                                setActiveView(
                                    "consultations"
                                )
                            }
                        />
                    )}

                {activeView === "leads" && (
                    <LeadManagement
                        leads={leads}
                        loading={leadLoading}
                        search={leadSearch}
                        status={leadStatus}
                        page={leadPage}
                        totalPages={
                            leadTotalPages
                        }
                        onSearch={(value) => {
                            setLeadPage(1);
                            setLeadSearch(
                                value
                            );
                        }}
                        onStatus={(value) => {
                            setLeadPage(1);
                            setLeadStatus(
                                value
                            );
                        }}
                        onPage={setLeadPage}
                        onOpen={(lead) =>
                            setSelectedLead(
                                lead
                            )
                        }
                    />
                )}

                {activeView ===
                    "consultations" && (
                        <ConsultationManagement
                            consultations={
                                consultations
                            }
                            loading={
                                consultationLoading
                            }
                            search={search}
                            status={status}
                            meetingType={
                                meetingType
                            }
                            page={page}
                            totalPages={
                                totalPages
                            }
                            onSearch={(value) => {
                                setPage(1);
                                setSearch(value);
                            }}
                            onStatus={(value) => {
                                setPage(1);
                                setStatus(value);
                            }}
                            onMeetingType={(
                                value
                            ) => {
                                setPage(1);
                                setMeetingType(
                                    value
                                );
                            }}
                            onPage={setPage}
                            onOpen={(
                                consultation
                            ) =>
                                setSelectedConsultation(
                                    consultation
                                )
                            }
                        />
                    )}
            </div>

            {selectedLead && (
                <LeadDrawer
                    lead={selectedLead}
                    onClose={() =>
                        setSelectedLead(
                            null
                        )
                    }
                    onStatusChange={
                        updateLeadStatus
                    }
                    onMarkContacted={
                        markLeadContacted
                    }
                    onAddNote={() =>
                        setShowLeadNote(
                            true
                        )
                    }
                    onDelete={
                        deleteLead
                    }
                />
            )}

            {selectedConsultation && (
                <ConsultationDrawer
                    consultation={
                        selectedConsultation
                    }
                    onClose={() =>
                        setSelectedConsultation(
                            null
                        )
                    }
                    onStatusChange={
                        updateConsultationStatus
                    }
                    onAddNote={() =>
                        setShowNote(true)
                    }
                />
            )}

            {showLeadNote &&
                selectedLead && (
                    <NoteModal
                        title="Add Lead Note"
                        placeholder="Write a note about this lead..."
                        onClose={() =>
                            setShowLeadNote(
                                false
                            )
                        }
                        onSubmit={async (
                            content
                        ) => {
                            await addLeadNote(
                                selectedLead._id,
                                content
                            );
                        }}
                    />
                )}

            {showNote &&
                selectedConsultation && (
                    <NoteModal
                        title="Add Consultation Note"
                        placeholder="Write a note about this consultation..."
                        onClose={() =>
                            setShowNote(
                                false
                            )
                        }
                        onSubmit={async (
                            content
                        ) => {
                            await addConsultationNote(
                                selectedConsultation._id,
                                content
                            );
                        }}
                    />
                )}

            {showCreateLead && (
                <CreateLeadModal
                    onClose={() =>
                        setShowCreateLead(
                            false
                        )
                    }
                    onCreated={() => {
                        setShowCreateLead(
                            false
                        );
                        setLeadPage(1);
                        fetchLeads();
                    }}
                />
            )}

            {showCreateConsultation && (
                <CreateConsultationModal
                    leads={leads}
                    onClose={() =>
                        setShowCreateConsultation(
                            false
                        )
                    }
                    onCreated={() => {
                        setShowCreateConsultation(
                            false
                        );
                        setPage(1);
                        fetchConsultations();
                    }}
                />
            )}
        </div>
    );
}

function ViewTab({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${active
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
        >
            {children}
        </button>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
                {value}
            </p>
        </div>
    );
}

function Overview({
    leads,
    consultations,
    loading,
    onLead,
    onConsultation,
    onViewLeads,
    onViewConsultations,
}: {
    leads: Lead[];
    consultations: Consultation[];
    loading: boolean;
    onLead: (lead: Lead) => void;
    onConsultation: (
        consultation: Consultation
    ) => void;
    onViewLeads: () => void;
    onViewConsultations: () => void;
}) {
    const recentLeads =
        leads.slice(0, 5);

    const upcoming =
        consultations
            .filter(isUpcoming)
            .sort(
                (a, b) =>
                    new Date(
                        a.scheduledAt
                    ).getTime() -
                    new Date(
                        b.scheduledAt
                    ).getTime()
            )
            .slice(0, 5);

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="font-bold text-slate-950">
                            Recent Leads
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Latest opportunities entering the pipeline.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onViewLeads
                        }
                        className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                    >
                        View all →
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <ListSkeleton />
                    ) : recentLeads.length ===
                        0 ? (
                        <EmptyState text="No leads found." />
                    ) : (
                        recentLeads.map(
                            (lead) => (
                                <button
                                    type="button"
                                    key={
                                        lead._id
                                    }
                                    onClick={() =>
                                        onLead(
                                            lead
                                        )
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {
                                                lead.fullName
                                            }
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {
                                                lead.email
                                            }
                                        </p>
                                    </div>

                                    <LeadStatusBadge
                                        status={
                                            lead.status
                                        }
                                    />
                                </button>
                            )
                        )
                    )}
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="font-bold text-slate-950">
                            Upcoming Consultations
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Meetings that need attention.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onViewConsultations
                        }
                        className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                    >
                        View all →
                    </button>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <ListSkeleton />
                    ) : upcoming.length ===
                        0 ? (
                        <EmptyState text="No upcoming consultations." />
                    ) : (
                        upcoming.map(
                            (
                                consultation
                            ) => (
                                <button
                                    type="button"
                                    key={
                                        consultation._id
                                    }
                                    onClick={() =>
                                        onConsultation(
                                            consultation
                                        )
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {getLeadName(
                                                consultation.lead
                                            )}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {formatDate(
                                                consultation.scheduledAt
                                            )}{" "}
                                            ·{" "}
                                            {formatTime(
                                                consultation.scheduledAt
                                            )}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {
                                            meetingLabels[
                                            consultation.meetingType
                                            ]
                                        }
                                    </span>
                                </button>
                            )
                        )
                    )}
                </div>
            </section>
        </div>
    );
}

function LeadManagement({
    leads,
    loading,
    search,
    status,
    page,
    totalPages,
    onSearch,
    onStatus,
    onPage,
    onOpen,
}: {
    leads: Lead[];
    loading: boolean;
    search: string;
    status: string;
    page: number;
    totalPages: number;
    onSearch: (value: string) => void;
    onStatus: (value: string) => void;
    onPage: (page: number) => void;
    onOpen: (lead: Lead) => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
                <div className="flex flex-col gap-3 xl:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            ⌕
                        </span>

                        <input
                            value={search}
                            onChange={(e) =>
                                onSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search leads by name, email, company, phone or project..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) =>
                            onStatus(
                                e.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    >
                        <option value="">
                            All lead statuses
                        </option>

                        {Object.entries(
                            leadStatusLabels
                        ).map(
                            ([
                                value,
                                label,
                            ]) => (
                                <option
                                    key={
                                        value
                                    }
                                    value={
                                        value
                                    }
                                >
                                    {label}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Lead
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Project
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Source
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Assigned
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Created
                            </th>
                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({
                                length: 7,
                            }).map(
                                (_, index) => (
                                    <SkeletonRow
                                        key={
                                            index
                                        }
                                        columns={
                                            7
                                        }
                                    />
                                )
                            )
                        ) : leads.length ===
                            0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        7
                                    }
                                >
                                    <EmptyState text="No leads found." />
                                </td>
                            </tr>
                        ) : (
                            leads.map(
                                (lead) => (
                                    <tr
                                        key={
                                            lead._id
                                        }
                                        className="group hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onOpen(
                                                        lead
                                                    )
                                                }
                                                className="text-left"
                                            >
                                                <p className="font-semibold text-slate-900">
                                                    {
                                                        lead.fullName
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        lead.email
                                                    }
                                                </p>

                                                {lead.phone && (
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {
                                                            lead.phone
                                                        }
                                                    </p>
                                                )}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-slate-800">
                                                {
                                                    lead.projectTitle ||
                                                    "No project title"
                                                }
                                            </p>

                                            {lead.company && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        lead.company
                                                    }
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-sm capitalize text-slate-600">
                                                {(
                                                    lead.source ||
                                                    "website"
                                                ).replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            {lead.assignedTo ? (
                                                <p className="text-sm font-medium text-slate-700">
                                                    {
                                                        lead
                                                            .assignedTo
                                                            .name
                                                    }
                                                </p>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <LeadStatusBadge
                                                status={
                                                    lead.status
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {formatDate(
                                                lead.createdAt
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onOpen(
                                                        lead
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {!loading &&
                leads.length > 0 && (
                    <Pagination
                        page={page}
                        totalPages={
                            totalPages
                        }
                        onPage={onPage}
                    />
                )}
        </section>
    );
}

function ConsultationManagement({
    consultations,
    loading,
    search,
    status,
    meetingType,
    page,
    totalPages,
    onSearch,
    onStatus,
    onMeetingType,
    onPage,
    onOpen,
}: {
    consultations: Consultation[];
    loading: boolean;
    search: string;
    status: string;
    meetingType: string;
    page: number;
    totalPages: number;
    onSearch: (value: string) => void;
    onStatus: (value: string) => void;
    onMeetingType: (value: string) => void;
    onPage: (page: number) => void;
    onOpen: (
        consultation: Consultation
    ) => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
                <div className="flex flex-col gap-3 xl:flex-row">
                    <input
                        value={search}
                        onChange={(e) =>
                            onSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search consultations..."
                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    />

                    <select
                        value={status}
                        onChange={(e) =>
                            onStatus(
                                e.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
                    >
                        <option value="">
                            All statuses
                        </option>
                        <option value="scheduled">
                            Scheduled
                        </option>
                        <option value="rescheduled">
                            Rescheduled
                        </option>
                        <option value="completed">
                            Completed
                        </option>
                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    <select
                        value={
                            meetingType
                        }
                        onChange={(e) =>
                            onMeetingType(
                                e.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
                    >
                        <option value="">
                            All meeting types
                        </option>
                        <option value="zoom">
                            Online
                        </option>
                        <option value="in_person">
                            In Person
                        </option>
                        <option value="phone">
                            Phone
                        </option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Lead
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Schedule
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Meeting
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Assigned
                            </th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (
                                    <SkeletonRow
                                        key={
                                            index
                                        }
                                        columns={
                                            6
                                        }
                                    />
                                )
                            )
                        ) : consultations.length ===
                            0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        6
                                    }
                                >
                                    <EmptyState text="No consultations found." />
                                </td>
                            </tr>
                        ) : (
                            consultations.map(
                                (
                                    consultation
                                ) => (
                                    <ConsultationRow
                                        key={
                                            consultation._id
                                        }
                                        consultation={
                                            consultation
                                        }
                                        onOpen={() =>
                                            onOpen(
                                                consultation
                                            )
                                        }
                                    />
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {!loading &&
                consultations.length >
                0 && (
                    <Pagination
                        page={page}
                        totalPages={
                            totalPages
                        }
                        onPage={onPage}
                    />
                )}
        </section>
    );
}

function ConsultationRow({
    consultation,
    onOpen,
}: {
    consultation: Consultation;
    onOpen: () => void;
}) {
    return (
        <tr className="group hover:bg-slate-50/70">
            <td className="px-5 py-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="text-left"
                >
                    <p className="font-semibold text-slate-900">
                        {getLeadName(
                            consultation.lead
                        )}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {
                            consultation
                                .lead
                                ?.email
                        }
                    </p>

                    {consultation.lead
                        ?.company && (
                            <p className="mt-1 text-xs text-slate-400">
                                {
                                    consultation
                                        .lead
                                        .company
                                }
                            </p>
                        )}
                </button>
            </td>

            <td className="px-5 py-4">
                <p className="text-sm font-medium text-slate-900">
                    {formatDate(
                        consultation.scheduledAt
                    )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {formatTime(
                        consultation.scheduledAt
                    )}{" "}
                    ·{" "}
                    {
                        consultation.duration
                    }{" "}
                    min
                </p>

                {isToday(
                    consultation.scheduledAt
                ) && (
                        <span className="mt-1.5 inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            TODAY
                        </span>
                    )}
            </td>

            <td className="px-5 py-4">
                <p className="text-sm font-medium text-slate-800">
                    {
                        meetingLabels[
                        consultation.meetingType
                        ]
                    }
                </p>

                {consultation.meetingType ===
                    "zoom" &&
                    consultation.meetingLink && (
                        <a
                            href={
                                consultation.meetingLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs font-semibold text-blue-600 hover:underline"
                        >
                            Open meeting
                        </a>
                    )}

                {consultation.meetingType ===
                    "in_person" &&
                    consultation.location && (
                        <p className="mt-1 text-xs text-slate-500">
                            {
                                consultation.location
                            }
                        </p>
                    )}
            </td>

            <td className="px-5 py-4">
                {consultation.assignedTo ? (
                    <p className="text-sm font-medium text-slate-700">
                        {
                            consultation
                                .assignedTo
                                .name
                        }
                    </p>
                ) : (
                    <span className="text-sm text-slate-400">
                        Unassigned
                    </span>
                )}
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${consultationStatusStyles[
                        consultation.status
                    ]
                        }`}
                >
                    {
                        consultation.status
                    }
                </span>
            </td>

            <td className="px-5 py-4 text-right">
                <button
                    type="button"
                    onClick={onOpen}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                >
                    View
                </button>
            </td>
        </tr>
    );
}

function LeadStatusBadge({
    status,
}: {
    status: LeadStatus;
}) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${leadStatusStyles[
                status
            ]
                }`}
        >
            {
                leadStatusLabels[
                status
                ]
            }
        </span>
    );
}

function LeadDrawer({
    lead,
    onClose,
    onStatusChange,
    onMarkContacted,
    onAddNote,
    onDelete,
}: {
    lead: Lead;
    onClose: () => void;
    onStatusChange: (
        id: string,
        status: LeadStatus
    ) => void;
    onMarkContacted: (
        id: string
    ) => void;
    onAddNote: () => void;
    onDelete: (id: string) => void;
}) {
    return (
        <DrawerShell
            title="Lead"
            subtitle={lead.fullName}
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <LeadStatusBadge
                            status={
                                lead.status
                            }
                        />

                        <select
                            value={
                                lead.status
                            }
                            onChange={(e) =>
                                onStatusChange(
                                    lead._id,
                                    e.target
                                        .value as LeadStatus
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
                        >
                            {Object.entries(
                                leadStatusLabels
                            ).map(
                                ([
                                    value,
                                    label,
                                ]) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                <DetailSection title="Contact">
                    <Detail
                        label="Name"
                        value={
                            lead.fullName
                        }
                    />

                    <Detail
                        label="Email"
                        value={
                            <a
                                href={`mailto:${lead.email}`}
                                className="text-blue-600 hover:underline"
                            >
                                {
                                    lead.email
                                }
                            </a>
                        }
                    />

                    <Detail
                        label="Phone"
                        value={
                            lead.phone ? (
                                <a
                                    href={`tel:${lead.phone}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {
                                        lead.phone
                                    }
                                </a>
                            ) : (
                                "—"
                            )
                        }
                    />

                    <Detail
                        label="Company"
                        value={
                            lead.company ||
                            "—"
                        }
                    />

                    <Detail
                        label="Website"
                        value={
                            lead.website ? (
                                <a
                                    href={
                                        lead.website.startsWith(
                                            "http"
                                        )
                                            ? lead.website
                                            : `https://${lead.website}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="max-w-[260px] truncate text-blue-600 hover:underline"
                                >
                                    {
                                        lead.website
                                    }
                                </a>
                            ) : (
                                "—"
                            )
                        }
                    />
                </DetailSection>

                <DetailSection title="Project">
                    <Detail
                        label="Title"
                        value={
                            lead.projectTitle ||
                            "—"
                        }
                    />

                    <Detail
                        label="Type"
                        value={
                            lead.projectType ||
                            "—"
                        }
                    />

                    <Detail
                        label="Timeline"
                        value={
                            lead.timeline ||
                            "—"
                        }
                    />

                    <Detail
                        label="Preferred Contact"
                        value={
                            lead.preferredContact ||
                            "—"
                        }
                    />

                    <Detail
                        label="Source"
                        value={
                            (
                                lead.source ||
                                "website"
                            ).replace(
                                /_/g,
                                " "
                            )
                        }
                    />
                </DetailSection>

                {lead.budget && (
                    <DetailSection title="Budget">
                        <Detail
                            label="Amount"
                            value={
                                formatBudget(
                                    lead.budget
                                )
                            }
                        />
                    </DetailSection>
                )}

                {lead.message && (
                    <DetailSection title="Message">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {
                                lead.message
                            }
                        </p>
                    </DetailSection>
                )}

                <DetailSection title="Activity">
                    <Detail
                        label="Created"
                        value={formatDateTime(
                            lead.createdAt
                        )}
                    />

                    <Detail
                        label="Contacted"
                        value={
                            lead.contactedAt
                                ? formatDateTime(
                                    lead.contactedAt
                                )
                                : "Not contacted"
                        }
                    />

                    {lead.convertedAt && (
                        <Detail
                            label="Converted"
                            value={formatDateTime(
                                lead.convertedAt
                            )}
                        />
                    )}
                </DetailSection>

                <DetailSection title="Notes">
                    <div className="space-y-3">
                        {lead.notes &&
                            lead.notes.length >
                            0 ? (
                            lead.notes.map(
                                (
                                    note,
                                    index
                                ) => (
                                    <div
                                        key={
                                            note._id ||
                                            index
                                        }
                                        className="rounded-xl border border-slate-200 p-3"
                                    >
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {
                                                note.note ||
                                                note.content
                                            }
                                        </p>

                                        <p className="mt-2 text-[11px] text-slate-400">
                                            {note.createdAt
                                                ? formatDateTime(
                                                    note.createdAt
                                                )
                                                : ""}
                                        </p>
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-sm text-slate-400">
                                No notes yet.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={
                                onAddNote
                            }
                            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            + Add Note
                        </button>
                    </div>
                </DetailSection>

                <div className="grid gap-2 sm:grid-cols-2">
                    {!lead.contactedAt && (
                        <button
                            type="button"
                            onClick={() =>
                                onMarkContacted(
                                    lead._id
                                )
                            }
                            className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Mark Contacted
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(
                                lead._id
                            )
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                        Delete Lead
                    </button>
                </div>
            </div>
        </DrawerShell>
    );
}

function ConsultationDrawer({
    consultation,
    onClose,
    onStatusChange,
    onAddNote,
}: {
    consultation: Consultation;
    onClose: () => void;
    onStatusChange: (
        id: string,
        status: ConsultationStatus
    ) => void;
    onAddNote: () => void;
}) {
    const lead =
        consultation.lead;

    return (
        <DrawerShell
            title="Consultation"
            subtitle={getLeadName(
                lead
            )}
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${consultationStatusStyles[
                                consultation.status
                            ]
                                }`}
                        >
                            {
                                consultation.status
                            }
                        </span>

                        <select
                            value={
                                consultation.status
                            }
                            onChange={(e) =>
                                onStatusChange(
                                    consultation._id,
                                    e.target
                                        .value as ConsultationStatus
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
                        >
                            <option value="scheduled">
                                Scheduled
                            </option>
                            <option value="rescheduled">
                                Rescheduled
                            </option>
                            <option value="completed">
                                Completed
                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>

                <DetailSection title="Lead Information">
                    <Detail
                        label="Name"
                        value={
                            getLeadName(
                                lead
                            )
                        }
                    />

                    <Detail
                        label="Email"
                        value={
                            lead?.email ||
                            "—"
                        }
                    />

                    <Detail
                        label="Phone"
                        value={
                            lead?.phone ||
                            "—"
                        }
                    />

                    <Detail
                        label="Company"
                        value={
                            lead?.company ||
                            "—"
                        }
                    />

                    <Detail
                        label="Project"
                        value={
                            lead?.projectTitle ||
                            "—"
                        }
                    />
                </DetailSection>

                <DetailSection title="Meeting">
                    <Detail
                        label="Date"
                        value={formatDate(
                            consultation.scheduledAt
                        )}
                    />

                    <Detail
                        label="Time"
                        value={`${formatTime(
                            consultation.scheduledAt
                        )} · ${consultation.duration
                            } minutes`}
                    />

                    <Detail
                        label="Type"
                        value={
                            meetingLabels[
                            consultation
                                .meetingType
                            ]
                        }
                    />

                    {consultation.meetingLink && (
                        <Detail
                            label="Meeting Link"
                            value={
                                <a
                                    href={
                                        consultation.meetingLink
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Open meeting
                                </a>
                            }
                        />
                    )}

                    {consultation.location && (
                        <Detail
                            label="Location"
                            value={
                                consultation.location
                            }
                        />
                    )}
                </DetailSection>

                <DetailSection title="Assignment">
                    <Detail
                        label="Assigned To"
                        value={
                            consultation.assignedTo
                                ? consultation
                                    .assignedTo
                                    .name
                                : "Unassigned"
                        }
                    />
                </DetailSection>

                {consultation.agenda && (
                    <DetailSection title="Agenda">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {
                                consultation.agenda
                            }
                        </p>
                    </DetailSection>
                )}

                <DetailSection title="Notes">
                    <div className="space-y-3">
                        {consultation.notes &&
                            consultation.notes
                                .length > 0 ? (
                            consultation.notes.map(
                                (
                                    note,
                                    index
                                ) => (
                                    <div
                                        key={
                                            note._id ||
                                            index
                                        }
                                        className="rounded-xl border border-slate-200 p-3"
                                    >
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {
                                                note.content
                                            }
                                        </p>

                                        <p className="mt-2 text-[11px] text-slate-400">
                                            {note.createdAt
                                                ? formatDateTime(
                                                    note.createdAt
                                                )
                                                : ""}
                                        </p>
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-sm text-slate-400">
                                No notes yet.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={
                                onAddNote
                            }
                            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            + Add Note
                        </button>
                    </div>
                </DetailSection>
            </div>
        </DrawerShell>
    );
}

function DrawerShell({
    title,
    subtitle,
    onClose,
    children,
}: {
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            {title}
                        </p>

                        <h2 className="mt-1 truncate text-lg font-bold text-slate-950">
                            {subtitle}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    {children}
                </div>

                <div className="border-t border-slate-200 p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Close
                    </button>
                </div>
            </aside>
        </div>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
                {title}
            </h3>

            <div className="space-y-3">
                {children}
            </div>
        </section>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <span className="text-xs font-medium text-slate-400">
                {label}
            </span>

            <span className="break-words text-right text-sm font-medium text-slate-700">
                {value}
            </span>
        </div>
    );
}

function NoteModal({
    title,
    placeholder,
    onClose,
    onSubmit,
}: {
    title: string;
    placeholder: string;
    onClose: () => void;
    onSubmit: (
        content: string
    ) => Promise<void>;
}) {
    const [content, setContent] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!content.trim()) return;

        setSaving(true);

        try {
            await onSubmit(
                content.trim()
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to save note."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <form
                onSubmit={submit}
                className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-950">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400"
                    >
                        ×
                    </button>
                </div>

                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                    rows={6}
                    autoFocus
                    placeholder={
                        placeholder
                    }
                    className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            !content.trim()
                        }
                        className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Add Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function CreateLeadModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [form, setForm] =
        useState({
            fullName: "",
            email: "",
            phone: "",
            company: "",
            website: "",
            projectTitle: "",
            projectType: "",
            timeline: "",
            preferredContact:
                "email",
            message: "",
        });

    const [saving, setSaving] =
        useState(false);

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (
            !form.fullName.trim() ||
            !form.email.trim() ||
            !form.message.trim()
        ) {
            alert(
                "Name, email and message are required."
            );
            return;
        }

        setSaving(true);

        try {
            const response =
                await fetch(
                    "/api/leads",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials:
                            "include",
                        body: JSON.stringify({
                            ...form,
                            interestedServices:
                                [],
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Lead>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to create lead."
                );
            }

            onCreated();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to create lead."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell
            title="New Lead"
            subtitle="Create a lead manually."
            onClose={onClose}
        >
            <form
                onSubmit={submit}
            >
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <Field
                        label="Full Name"
                        required
                    >
                        <input
                            value={
                                form.fullName
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        fullName:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field
                        label="Email"
                        required
                    >
                        <input
                            type="email"
                            value={
                                form.email
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        email:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Phone">
                        <input
                            value={
                                form.phone
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        phone:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Company">
                        <input
                            value={
                                form.company
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        company:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Project Title">
                        <input
                            value={
                                form.projectTitle
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        projectTitle:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Project Type">
                        <input
                            value={
                                form.projectType
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        projectType:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Timeline">
                        <input
                            value={
                                form.timeline
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        timeline:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Preferred Contact">
                        <select
                            value={
                                form.preferredContact
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        preferredContact:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        >
                            <option value="email">
                                Email
                            </option>
                            <option value="phone">
                                Phone
                            </option>
                            <option value="whatsapp">
                                WhatsApp
                            </option>
                        </select>
                    </Field>

                    <Field
                        label="Website"
                        className="sm:col-span-2"
                    >
                        <input
                            value={
                                form.website
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        website:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field
                        label="Message"
                        required
                        className="sm:col-span-2"
                    >
                        <textarea
                            rows={5}
                            value={
                                form.message
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,
                                        message:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            className="input resize-none"
                        />
                    </Field>
                </div>

                <ModalFooter
                    onClose={onClose}
                    saving={saving}
                    submitLabel="Create Lead"
                />
            </form>
        </ModalShell>
    );
}

function CreateConsultationModal({
    leads,
    onClose,
    onCreated,
}: {
    leads: Lead[];
    onClose: () => void;
    onCreated: () => void;
}) {
    const [lead, setLead] =
        useState("");

    const [scheduledAt, setScheduledAt] =
        useState("");

    const [duration, setDuration] =
        useState("30");

    const [meetingType, setMeetingType] =
        useState<MeetingType>(
            "zoom"
        );

    const [meetingLink, setMeetingLink] =
        useState("");

    const [location, setLocation] =
        useState("");

    const [agenda, setAgenda] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (
            !lead ||
            !scheduledAt
        ) {
            alert(
                "Lead and schedule are required."
            );
            return;
        }

        if (
            meetingType ===
            "zoom" &&
            !meetingLink.trim()
        ) {
            alert(
                "Meeting link is required."
            );
            return;
        }

        if (
            meetingType ===
            "in_person" &&
            !location.trim()
        ) {
            alert(
                "Location is required."
            );
            return;
        }

        setSaving(true);

        try {
            const response =
                await fetch(
                    "/api/consultations",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials:
                            "include",
                        body: JSON.stringify({
                            lead,
                            scheduledAt:
                                new Date(
                                    scheduledAt
                                ).toISOString(),
                            duration:
                                Number(
                                    duration
                                ),
                            meetingType,
                            meetingLink:
                                meetingType ===
                                    "zoom"
                                    ? meetingLink
                                    : "",
                            location:
                                meetingType ===
                                    "in_person"
                                    ? location
                                    : "",
                            agenda,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Consultation>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to create consultation."
                );
            }

            onCreated();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to create consultation."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell
            title="New Consultation"
            subtitle="Schedule a consultation for an existing lead."
            onClose={onClose}
        >
            <form
                onSubmit={submit}
            >
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <Field
                        label="Lead"
                        required
                        className="sm:col-span-2"
                    >
                        <select
                            value={
                                lead
                            }
                            onChange={(e) =>
                                setLead(
                                    e.target
                                        .value
                                )
                            }
                            className="input"
                        >
                            <option value="">
                                Select a lead
                            </option>

                            {leads.map(
                                (
                                    item
                                ) => (
                                    <option
                                        key={
                                            item._id
                                        }
                                        value={
                                            item._id
                                        }
                                    >
                                        {
                                            item.fullName
                                        }{" "}
                                        —{" "}
                                        {
                                            item.email
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </Field>

                    <Field
                        label="Date & Time"
                        required
                    >
                        <input
                            type="datetime-local"
                            value={
                                scheduledAt
                            }
                            onChange={(e) =>
                                setScheduledAt(
                                    e.target
                                        .value
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Duration">
                        <select
                            value={
                                duration
                            }
                            onChange={(e) =>
                                setDuration(
                                    e.target
                                        .value
                                )
                            }
                            className="input"
                        >
                            <option value="15">
                                15 minutes
                            </option>
                            <option value="30">
                                30 minutes
                            </option>
                            <option value="45">
                                45 minutes
                            </option>
                            <option value="60">
                                60 minutes
                            </option>
                            <option value="90">
                                90 minutes
                            </option>
                            <option value="120">
                                2 hours
                            </option>
                        </select>
                    </Field>

                    <Field label="Meeting Type">
                        <select
                            value={
                                meetingType
                            }
                            onChange={(e) =>
                                setMeetingType(
                                    e.target
                                        .value as MeetingType
                                )
                            }
                            className="input"
                        >
                            <option value="zoom">
                                Online
                            </option>
                            <option value="in_person">
                                In Person
                            </option>
                            <option value="phone">
                                Phone
                            </option>
                        </select>
                    </Field>

                    {meetingType ===
                        "zoom" && (
                            <Field
                                label="Meeting Link"
                                required
                            >
                                <input
                                    value={
                                        meetingLink
                                    }
                                    onChange={(e) =>
                                        setMeetingLink(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="input"
                                />
                            </Field>
                        )}

                    {meetingType ===
                        "in_person" && (
                            <Field
                                label="Location"
                                required
                            >
                                <input
                                    value={
                                        location
                                    }
                                    onChange={(e) =>
                                        setLocation(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Office location"
                                    className="input"
                                />
                            </Field>
                        )}

                    <Field
                        label="Agenda"
                        className="sm:col-span-2"
                    >
                        <textarea
                            rows={5}
                            value={
                                agenda
                            }
                            onChange={(e) =>
                                setAgenda(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="What will be discussed?"
                            className="input resize-none"
                        />
                    </Field>
                </div>

                <ModalFooter
                    onClose={onClose}
                    saving={saving}
                    submitLabel="Create Consultation"
                />
            </form>
        </ModalShell>
    );
}

function ModalShell({
    title,
    subtitle,
    onClose,
    children,
}: {
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

function ModalFooter({
    onClose,
    saving,
    submitLabel,
}: {
    onClose: () => void;
    saving: boolean;
    submitLabel: string;
}) {
    return (
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6">
            <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
                {saving
                    ? "Saving..."
                    : submitLabel}
            </button>
        </div>
    );
}

function Field({
    label,
    required,
    children,
    className = "",
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label
            className={`block ${className}`}
        >
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

function Pagination({
    page,
    totalPages,
    onPage,
}: {
    page: number;
    totalPages: number;
    onPage: (page: number) => void;
}) {
    return (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-medium text-slate-700">
                    {page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                    {totalPages}
                </span>
            </p>

            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                        onPage(
                            page - 1
                        )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>

                <button
                    type="button"
                    disabled={
                        page >=
                        totalPages
                    }
                    onClick={() =>
                        onPage(
                            page + 1
                        )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function SkeletonRow({
    columns,
}: {
    columns: number;
}) {
    return (
        <tr>
            {Array.from({
                length: columns,
            }).map((_, index) => (
                <td
                    key={index}
                    className="px-5 py-5"
                >
                    <div className="animate-pulse space-y-2">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-2.5 w-20 rounded bg-slate-100" />
                    </div>
                </td>
            ))}
        </tr>
    );
}

function ListSkeleton() {
    return (
        <>
            {Array.from({
                length: 5,
            }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse px-5 py-4"
                >
                    <div className="h-3 w-40 rounded bg-slate-200" />
                    <div className="mt-2 h-2.5 w-28 rounded bg-slate-100" />
                </div>
            ))}
        </>
    );
}

function EmptyState({
    text,
}: {
    text: string;
}) {
    return (
        <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                ◫
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
                {text}
            </p>
        </div>
    );
}

function formatBudget(
    budget: NonNullable<
        Lead["budget"]
    >
) {
    if (
        budget.amount !==
        undefined
    ) {
        return `${budget.currency || "USD"} ${budget.amount}`;
    }

    if (
        budget.min !==
        undefined ||
        budget.max !==
        undefined
    ) {
        const min =
            budget.min !==
                undefined
                ? budget.min
                : "—";

        const max =
            budget.max !==
                undefined
                ? budget.max
                : "—";

        return `${budget.currency || "USD"} ${min} – ${max}`;
    }

    return "—";
}