export interface Dictionary {
    id?: string,
    name: string,
    owner: string, //user id
    editor?: string[], //user ids
    viewer?: string[], //user ids
    usesrs: string[], //all user ids related to roles 
    published: boolean, //flag for users to view
    size: number,
    tags: string[],
    //subcollection: words[]
}
