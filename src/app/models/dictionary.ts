export interface Dictionary {
    id?: string,
    name: string,
    owner: string, //user email
    editor?: string[], //user emails
    viewer?: string[], //user emails
    users: string[], //all user emails related to roles 
    published: boolean, //flag for users to view
    size: number,
    tags: string[]
    //subcollection: words[]
}
