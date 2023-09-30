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
    api: {
        // api
        useApi: boolean | null
        level0: boolean | null
        level1: boolean | null
        level2: boolean | null
        level3: boolean | null
        level4: boolean | null
        level5: boolean | null
        zip0: boolean | null
        zip1: boolean | null
        zip2: boolean | null
        iid: boolean | null
        artist: boolean | null
        json: boolean | null
        lite: boolean | null
    }
}
