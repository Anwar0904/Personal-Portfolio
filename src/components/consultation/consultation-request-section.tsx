"use client";

import {
    ChangeEvent,
    DragEvent,
    useEffect,
    useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Controller,
    useForm,
} from "react-hook-form";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarClock,
    Check,
    CheckCircle2,
    FileText,
    FileUp,
    LoaderCircle,
    Mail,
    MessageSquareText,
    Phone,
    Trash2,
    UserRound,
    Video,
} from "lucide-react";

import {
    formatConsultationAnalytics,
    trackPageView,
} from "@/lib/analytics";
import {
    ConsultationFormSchema,
    ConsultationFormValues,
} from "@/validators/consultation-form.validator";

const MAX_FILES = 5;

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/plain",
];

const projectTypes = [
    "Website Development",
    "Web Application",
    "Mobile Application",
    "AI Solution",
    "Cloud & DevOps",
    "Blockchain Solution",
    "UI/UX Design",
    "Digital Transformation",
    "Other",
];

const budgets = [
    "Under $5,000",
    "$5,000 – $10,000",
    "$10,000 – $25,000",
    "$25,000 – $50,000",
    "$50,000+",
    "Not decided yet",
];

const timelines = [
    "As soon as possible",
    "Within 1 month",
    "1 – 3 months",
    "3 – 6 months",
    "More than 6 months",
    "Flexible",
];

const steps = [
    {
        number: 1,
        title: "Contact details",
    },
    {
        number: 2,
        title: "Project details",
    },
    {
        number: 3,
        title: "Files & review",
    },
];

function formatFileSize(
    bytes: number
) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}

export default function ConsultationRequestSection() {
    useEffect(() => {
        trackPageView("consultation_page_view");
    }, []);

    const [currentStep, setCurrentStep] =
        useState(1);

    const [files, setFiles] = useState<
        File[]
    >([]);

    const [fileError, setFileError] =
        useState("");

    const [submitError, setSubmitError] =
        useState("");

    const [submitted, setSubmitted] =
        useState(false);

    const {
        register,
        control,
        handleSubmit,
        trigger,
        reset,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ConsultationFormValues>({
        resolver: zodResolver(
            ConsultationFormSchema
        ),

        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            company: "",
            projectType: "",
            budget: "",
            timeline: "",
            preferredContact: "email",
            projectTitle: "",
            message: "",
        },
    });

    const formValues = watch();

    const validateAndAddFiles = (
        incomingFiles: File[]
    ) => {
        setFileError("");

        const availableSlots =
            MAX_FILES - files.length;

        if (availableSlots <= 0) {
            setFileError(
                `You can upload a maximum of ${MAX_FILES} files.`
            );

            return;
        }

        const acceptedFiles =
            incomingFiles.slice(
                0,
                availableSlots
            );

        for (const file of acceptedFiles) {
            if (
                file.size >
                MAX_FILE_SIZE
            ) {
                setFileError(
                    `${file.name} exceeds the 10 MB limit.`
                );

                return;
            }

            if (
                !acceptedFileTypes.includes(
                    file.type
                )
            ) {
                setFileError(
                    `${file.name} is not a supported file type.`
                );

                return;
            }

            const alreadyExists =
                files.some(
                    (existingFile) =>
                        existingFile.name ===
                        file.name &&
                        existingFile.size ===
                        file.size
                );

            if (alreadyExists) {
                setFileError(
                    `${file.name} has already been selected.`
                );

                return;
            }
        }

        setFiles((currentFiles) => [
            ...currentFiles,
            ...acceptedFiles,
        ]);
    };

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles =
            Array.from(
                event.target.files ?? []
            );

        validateAndAddFiles(
            selectedFiles
        );

        event.target.value = "";
    };

    const handleDrop = (
        event: DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        const droppedFiles =
            Array.from(
                event.dataTransfer.files
            );

        validateAndAddFiles(
            droppedFiles
        );
    };

    const removeFile = (
        fileIndex: number
    ) => {
        setFiles((currentFiles) =>
            currentFiles.filter(
                (_, index) =>
                    index !== fileIndex
            )
        );

        setFileError("");
    };

    const nextStep = async () => {
        const fieldsToValidate: Array<
            keyof ConsultationFormValues
        > =
            currentStep === 1
                ? [
                    "fullName",
                    "email",
                    "phone",
                    "company",
                    "preferredContact",
                ]
                : [
                    "projectType",
                    "budget",
                    "timeline",
                    "projectTitle",
                    "message",
                ];

        const isValid =
            await trigger(
                fieldsToValidate
            );

        if (!isValid) {
            return;
        }

        setCurrentStep(
            (step) =>
                Math.min(step + 1, 3)
        );
    };

    const previousStep = () => {
        setCurrentStep(
            (step) =>
                Math.max(step - 1, 1)
        );
    };

    const onSubmit = async (
        values: ConsultationFormValues
    ) => {
        try {
            setSubmitError("");

            const formData =
                new FormData();

            Object.entries(
                values
            ).forEach(
                ([key, value]) => {
                    formData.append(
                        key,
                        value ?? ""
                    );
                }
            );

            files.forEach((file) => {
                formData.append(
                    "attachments",
                    file
                );
            });

            const response = await fetch("/api/leads", {
                method: "POST",
                body: formData,
            });

            const contentType =
                response.headers.get("content-type");

            let result = null;

            if (
                contentType?.includes("application/json")
            ) {
                result = await response.json();
            }

            if (!response.ok) {
                throw new Error(
                    result?.message ??
                    "Request failed."
                );
            }

            trackPageView(
                "consultation_request_submitted",
                formatConsultationAnalytics({
                    projectType: values.projectType,
                    budget: values.budget,
                    timeline: values.timeline,
                    preferredContact: values.preferredContact,
                    hasFiles: files.length > 0,
                })
            );

            setSubmitted(true);
            setCurrentStep(1);
            setFiles([]);
            reset();
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while submitting your request."
            );
        }
    };

    if (submitted) {
        return (
            <section
                id="consultation-form"
                className="bg-slate-50 py-24 lg:py-32"
            >
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="mx-auto max-w-3xl rounded-[36px] border border-emerald-200 bg-white px-6 py-16 text-center shadow-xl sm:px-12"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle2
                                size={48}
                                className="text-emerald-600"
                            />
                        </div>

                        <h2 className="mt-8 text-3xl font-black text-slate-900 sm:text-5xl">
                            Request Submitted
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Your consultation request
                            has been received. Our team
                            will review the details and
                            contact you within 24
                            business hours.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSubmitted(false)
                            }
                            className="mt-10 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Submit Another Request
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="consultation-form"
            className="relative overflow-hidden bg-slate-50 py-24 lg:py-32"
        >
            <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[140px]" />

            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-[140px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Start Your Consultation
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl">
                        Tell Us About Your
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Project Idea
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Complete the steps below and
                        provide everything our team
                        needs to prepare for your
                        consultation.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    {/* Step indicator */}

                    <div className="mb-10 grid gap-4 sm:grid-cols-3">
                        {steps.map((step) => {
                            const completed =
                                currentStep >
                                step.number;

                            const active =
                                currentStep ===
                                step.number;

                            return (
                                <div
                                    key={step.number}
                                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${active
                                        ? "border-blue-500 bg-blue-50"
                                        : completed
                                            ? "border-emerald-200 bg-emerald-50"
                                            : "border-slate-200 bg-white"
                                        }`}
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${active
                                            ? "bg-blue-600 text-white"
                                            : completed
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {completed ? (
                                            <Check size={20} />
                                        ) : (
                                            step.number
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Step {step.number}
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,.08)]"
                    >
                        <div className="grid lg:grid-cols-[1fr_340px]">
                            {/* Form */}

                            <div className="min-w-0 p-6 sm:p-10 lg:p-12">
                                <AnimatePresence
                                    mode="wait"
                                >
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="contact-step"
                                            initial={{
                                                opacity: 0,
                                                x: 20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -20,
                                            }}
                                        >
                                            <div className="mb-8">
                                                <h3 className="text-3xl font-black text-slate-900">
                                                    Contact Information
                                                </h3>

                                                <p className="mt-3 text-slate-600">
                                                    Tell us who you
                                                    are and how you
                                                    prefer to be
                                                    contacted.
                                                </p>
                                            </div>

                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <FormField
                                                    label="Full name"
                                                    error={
                                                        errors
                                                            .fullName
                                                            ?.message
                                                    }
                                                    icon={
                                                        <UserRound
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <input
                                                        {...register(
                                                            "fullName"
                                                        )}
                                                        placeholder="Your full name"
                                                        className="form-input"
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Email address"
                                                    error={
                                                        errors.email
                                                            ?.message
                                                    }
                                                    icon={
                                                        <Mail
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <input
                                                        type="email"
                                                        {...register(
                                                            "email"
                                                        )}
                                                        placeholder="you@company.com"
                                                        className="form-input"
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Phone number"
                                                    error={
                                                        errors.phone
                                                            ?.message
                                                    }
                                                    icon={
                                                        <Phone
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <input
                                                        type="tel"
                                                        {...register(
                                                            "phone"
                                                        )}
                                                        placeholder="+92..."
                                                        className="form-input"
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Company"
                                                    error={
                                                        errors.company
                                                            ?.message
                                                    }
                                                    icon={
                                                        <Building2
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <input
                                                        {...register(
                                                            "company"
                                                        )}
                                                        placeholder="Company name"
                                                        className="form-input"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="mt-8">
                                                <label className="font-bold text-slate-900">
                                                    Preferred contact
                                                    method
                                                </label>

                                                <Controller
                                                    name="preferredContact"
                                                    control={control}
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                                            {[
                                                                {
                                                                    value:
                                                                        "email",
                                                                    label:
                                                                        "Email",
                                                                    icon: Mail,
                                                                },
                                                                {
                                                                    value:
                                                                        "phone",
                                                                    label:
                                                                        "Phone",
                                                                    icon: Phone,
                                                                },
                                                                {
                                                                    value:
                                                                        "video-call",
                                                                    label:
                                                                        "Video call",
                                                                    icon: Video,
                                                                },
                                                            ].map(
                                                                (option) => {
                                                                    const Icon =
                                                                        option.icon;

                                                                    const selected =
                                                                        field.value ===
                                                                        option.value;

                                                                    return (
                                                                        <button
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                field.onChange(
                                                                                    option.value
                                                                                )
                                                                            }
                                                                            className={`flex items-center justify-center gap-3 rounded-2xl border px-4 py-4 font-semibold transition ${selected
                                                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                                : "border-slate-200 text-slate-600 hover:border-blue-300"
                                                                                }`}
                                                                        >
                                                                            <Icon
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />

                                                                            {
                                                                                option.label
                                                                            }
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="project-step"
                                            initial={{
                                                opacity: 0,
                                                x: 20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -20,
                                            }}
                                        >
                                            <div className="mb-8">
                                                <h3 className="text-3xl font-black text-slate-900">
                                                    Project Details
                                                </h3>

                                                <p className="mt-3 text-slate-600">
                                                    Provide enough
                                                    context for our
                                                    team to understand
                                                    your goals.
                                                </p>
                                            </div>

                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <FormField
                                                    label="Project type"
                                                    error={
                                                        errors
                                                            .projectType
                                                            ?.message
                                                    }
                                                >
                                                    <select
                                                        {...register(
                                                            "projectType"
                                                        )}
                                                        className="form-input"
                                                    >
                                                        <option value="">
                                                            Select project
                                                            type
                                                        </option>

                                                        {projectTypes.map(
                                                            (type) => (
                                                                <option
                                                                    key={
                                                                        type
                                                                    }
                                                                    value={
                                                                        type
                                                                    }
                                                                >
                                                                    {type}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </FormField>

                                                <FormField
                                                    label="Estimated budget"
                                                    error={
                                                        errors.budget
                                                            ?.message
                                                    }
                                                >
                                                    <select
                                                        {...register(
                                                            "budget"
                                                        )}
                                                        className="form-input"
                                                    >
                                                        <option value="">
                                                            Select budget
                                                        </option>

                                                        {budgets.map(
                                                            (budget) => (
                                                                <option
                                                                    key={
                                                                        budget
                                                                    }
                                                                    value={
                                                                        budget
                                                                    }
                                                                >
                                                                    {budget}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </FormField>

                                                <FormField
                                                    label="Expected timeline"
                                                    error={
                                                        errors
                                                            .timeline
                                                            ?.message
                                                    }
                                                    icon={
                                                        <CalendarClock
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <select
                                                        {...register(
                                                            "timeline"
                                                        )}
                                                        className="form-input"
                                                    >
                                                        <option value="">
                                                            Select timeline
                                                        </option>

                                                        {timelines.map(
                                                            (
                                                                timeline
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        timeline
                                                                    }
                                                                    value={
                                                                        timeline
                                                                    }
                                                                >
                                                                    {
                                                                        timeline
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </FormField>

                                                <FormField
                                                    label="Project title"
                                                    error={
                                                        errors
                                                            .projectTitle
                                                            ?.message
                                                    }
                                                    icon={
                                                        <FileText
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <input
                                                        {...register(
                                                            "projectTitle"
                                                        )}
                                                        placeholder="Example: ADM mobile application"
                                                        className="form-input"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="mt-6">
                                                <FormField
                                                    label="Project description"
                                                    error={
                                                        errors.message
                                                            ?.message
                                                    }
                                                    icon={
                                                        <MessageSquareText
                                                            size={18}
                                                        />
                                                    }
                                                >
                                                    <textarea
                                                        {...register(
                                                            "message"
                                                        )}
                                                        rows={8}
                                                        placeholder="Describe your goals, key features, challenges and expected outcome..."
                                                        className="form-input resize-none py-4"
                                                    />
                                                </FormField>
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="upload-step"
                                            initial={{
                                                opacity: 0,
                                                x: 20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -20,
                                            }}
                                        >
                                            <div className="mb-8">
                                                <h3 className="text-3xl font-black text-slate-900">
                                                    Files & Review
                                                </h3>

                                                <p className="mt-3 text-slate-600">
                                                    Upload supporting
                                                    documents, designs
                                                    or requirement
                                                    files.
                                                </p>
                                            </div>

                                            <div
                                                onDragOver={(
                                                    event
                                                ) =>
                                                    event.preventDefault()
                                                }
                                                onDrop={
                                                    handleDrop
                                                }
                                                className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                                            >
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                                    <FileUp
                                                        size={30}
                                                    />
                                                </div>

                                                <h4 className="mt-5 text-lg font-bold text-slate-900">
                                                    Drop your files
                                                    here
                                                </h4>

                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    PDF, DOC, DOCX,
                                                    XLS, XLSX, PNG,
                                                    JPG, WEBP or TXT.
                                                    Maximum 10 MB per
                                                    file.
                                                </p>

                                                <label className="mt-6 inline-flex cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                                                    Browse Files

                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            {fileError && (
                                                <p className="mt-3 text-sm font-medium text-red-600">
                                                    {fileError}
                                                </p>
                                            )}

                                            {files.length > 0 && (
                                                <div className="mt-6 space-y-3">
                                                    {files.map(
                                                        (
                                                            file,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={`${file.name}-${file.size}`}
                                                                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                                                            >
                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                    <FileText
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate font-semibold text-slate-900">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-slate-500">
                                                                        {formatFileSize(
                                                                            file.size
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeFile(
                                                                            index
                                                                        )
                                                                    }
                                                                    aria-label={`Remove ${file.name}`}
                                                                    className="rounded-xl p-3 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                                <h4 className="font-bold text-slate-900">
                                                    Request Summary
                                                </h4>

                                                <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
                                                    <SummaryItem
                                                        label="Name"
                                                        value={
                                                            formValues.fullName
                                                        }
                                                    />

                                                    <SummaryItem
                                                        label="Email"
                                                        value={
                                                            formValues.email
                                                        }
                                                    />

                                                    <SummaryItem
                                                        label="Project"
                                                        value={
                                                            formValues.projectTitle
                                                        }
                                                    />

                                                    <SummaryItem
                                                        label="Project type"
                                                        value={
                                                            formValues.projectType
                                                        }
                                                    />

                                                    <SummaryItem
                                                        label="Budget"
                                                        value={
                                                            formValues.budget
                                                        }
                                                    />

                                                    <SummaryItem
                                                        label="Timeline"
                                                        value={
                                                            formValues.timeline
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {submitError && (
                                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                                                    {submitError}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation */}

                                <div className="mt-10 flex flex-col-reverse gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={
                                            previousStep
                                        }
                                        disabled={Boolean(
                                            currentStep === 1 ||
                                            isSubmitting
                                        )}
                                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ArrowLeft
                                            size={18}
                                            className="mr-2"
                                        />

                                        Previous
                                    </button>

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={
                                                nextStep
                                            }
                                            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Continue

                                            <ArrowRight
                                                size={18}
                                                className="ml-2"
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={Boolean(
                                                isSubmitting
                                            )}
                                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <LoaderCircle
                                                        size={
                                                            18
                                                        }
                                                        className="mr-2 animate-spin"
                                                    />

                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Request

                                                    <ArrowRight
                                                        size={
                                                            18
                                                        }
                                                        className="ml-2"
                                                    />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}

                            <aside className="border-t border-slate-200 bg-slate-950 p-7 text-white lg:border-l lg:border-t-0 lg:p-9">
                                <h3 className="text-2xl font-black">
                                    What Happens Next?
                                </h3>

                                <p className="mt-4 leading-7 text-slate-400">
                                    Your request enters our
                                    consultation pipeline
                                    immediately after
                                    submission.
                                </p>

                                <div className="mt-9 space-y-7">
                                    {[
                                        {
                                            number: "01",
                                            title:
                                                "Request review",
                                            text:
                                                "Our team checks your requirements and uploaded files.",
                                        },
                                        {
                                            number: "02",
                                            title:
                                                "Initial response",
                                            text:
                                                "We contact you within 24 business hours.",
                                        },
                                        {
                                            number: "03",
                                            title:
                                                "Discovery session",
                                            text:
                                                "We discuss requirements, goals and technical options.",
                                        },
                                        {
                                            number: "04",
                                            title:
                                                "Proposal",
                                            text:
                                                "You receive a tailored scope, timeline and estimate.",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.number}
                                            className="flex gap-4"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">
                                                {item.number}
                                            </span>

                                            <div>
                                                <h4 className="font-bold">
                                                    {item.title}
                                                </h4>

                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm leading-6 text-slate-300">
                                        Your information and
                                        documents are used only
                                        to evaluate your
                                        consultation request.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx global>{`
        .form-input {
          min-height: 3.5rem;
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding-left: 1rem;
          padding-right: 1rem;
          color: rgb(15 23 42);
          outline: none;
          transition:
            border-color 150ms,
            box-shadow 150ms;
        }

        .form-input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 4px
            rgb(59 130 246 / 0.1);
        }
      `}</style>
        </section>
    );
}

interface FormFieldProps {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

function FormField({
    label,
    error,
    icon,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label className="flex items-center gap-2 font-bold text-slate-900">
                {icon && (
                    <span className="text-blue-600">
                        {icon}
                    </span>
                )}

                {label}
            </label>

            <div className="mt-3">
                {children}
            </div>

            {error && (
                <p className="mt-2 text-sm font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div>
            <p className="font-medium text-slate-400">
                {label}
            </p>

            <p className="mt-1 wrap-break-words font-bold text-slate-800">
                {value || "Not provided"}
            </p>
        </div>
    );
}