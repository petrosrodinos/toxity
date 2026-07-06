export interface CreateEmail {
    to: string;
    subject: string;
    text?: string;
    from?: string;
    html?: string;
    attachments?: unknown[];
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    headers?: Record<string, string>;
}
