export const parse_gcs_credentials_from_base64 = (
    credentials_json_base64?: string,
): object | undefined => {
    if (!credentials_json_base64) {
        return undefined;
    }

    const credentials_json = Buffer.from(credentials_json_base64, 'base64').toString(
        'utf-8',
    );

    return JSON.parse(credentials_json);
};
