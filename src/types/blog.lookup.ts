export interface BlogLookupCategory {
    _id: string;
    name: string;
    slug: string;
}

export interface BlogLookupTag {
    _id: string;
    name: string;
    slug: string;
    color?: string;
}

export interface BlogLookups {
    categories: BlogLookupCategory[];
    tags: BlogLookupTag[];
}