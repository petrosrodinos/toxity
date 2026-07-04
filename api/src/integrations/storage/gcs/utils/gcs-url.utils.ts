export const extract_gcs_path_from_url = (url: string): string | null => {
    const marker = '.googleapis.com/';
    const index = url.indexOf(marker);

    if (index === -1) {
        return null;
    }

    const path_with_bucket = url.slice(index + marker.length);
    const slash_index = path_with_bucket.indexOf('/');

    if (slash_index === -1) {
        return null;
    }

    return path_with_bucket.slice(slash_index + 1);
};
