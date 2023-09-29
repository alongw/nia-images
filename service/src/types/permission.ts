export interface Permission {
    user: {
        // user
        login: boolean | null
        low: boolean | null
        getKey: boolean | null
        resetKey: boolean | null
    }
    admin: {
        // admin
    }
}
