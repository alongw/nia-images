export interface Permission {
    user: {
        // user
        low: boolean | null
        login: boolean | null
    }
    admin: {
        // admin
    }
}
