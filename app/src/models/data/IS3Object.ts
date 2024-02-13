export interface IS3Object {
    /** Unique object/file ID or name */
    objectId: string;
    /** File type e.g., image/png, image/jpeg */
    fileType: string;
    /** URL of the object if applicable */
    url?: string;
}
