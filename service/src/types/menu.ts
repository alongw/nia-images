import type { Permission } from './permission.js'

export type PartialSub<T> = {
    [k in keyof T]?: {
        [sub in keyof T[k]]?: T[k][sub]
    }
}

export interface _Permission extends Permission {
    key: string
    name: string
}

export interface Menu {
    key: string
    label: string
    permission: PartialSub<_Permission> | string | null
    priority: number
}
