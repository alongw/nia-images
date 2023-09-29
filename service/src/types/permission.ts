export interface Permission {
    user: {
        // user
        login: boolean | null
        low: boolean | null
    }
    admin: {
        // admin
    }
}
