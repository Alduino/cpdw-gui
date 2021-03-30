export default function debug(tag: string, message: string) {
    if (process.env.NODE_ENV === "production") return;
    console.debug(`[${tag}] ${message}`);
}
