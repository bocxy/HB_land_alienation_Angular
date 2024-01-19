
export interface Division {
    id: number;
    name: string;
}

export interface District {
    id: number;
    name: string;
    division_id: number;
}

export interface Taluk {
    id: number;
    name: string;
    district_id: number;
    division_id: number;
}

export interface Village {
    id: number;
    name: string;
    taluk_id: number;
}
