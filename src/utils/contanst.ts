export const USER_ROLE = {
    ADMIN: 'admin',
    OWNER: 'owner',
    TENANT: 'tenant'
}

export function getDownloadUrl(cloudinaryUrl) {
    const parts = cloudinaryUrl.split('/upload/');
    const filename = cloudinaryUrl.split('/').pop().split('.')[0];
    return `${parts[0]}/upload/fl_attachment:${filename}/${parts[1]}`;
}