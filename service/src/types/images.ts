export interface Images {
    iid: number
    source_name: string
    source_type: string
    source_id: string
    source_url?: string
    tag?: string
    image_age: 0 | 1 | 2 | 3 | 4 | 5
    size: number
    size_type: 0 | 1 | 2
    x?: number
    y?: number
    artist_id?: string
    artist_url?: string
    artisi_name?: string
    image_tag?: string
    image_tag_translate?: string
    image_title?: string
    image_page?: string
    url_public?: string
    url_external?: string
    url_internal?: string
    url_backup?: string
    url_archive?: string
    comment?: string
}

export interface Config {
    iid?: number
    image_age?: 0 | 1 | 2 | 3 | 4 | 5
    size_type?: 0 | 1 | 2
    artist_name?: string
}
