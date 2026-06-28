export enum StreamType {
    INTERNATIONAL_INBOUND = "II",
    INTERNATIONAL_OUTBOUND = "IO",
    NATIONAL_INBOUND = "NI",
    NATIONAL_OUTBOUND = "NO",
}
export const StreamTypeLabel: Record<StreamType, string> = {
    [StreamType.INTERNATIONAL_INBOUND]: "II (International Inbound)",
    [StreamType.INTERNATIONAL_OUTBOUND]: "IO (International Outbound)",
    [StreamType.NATIONAL_INBOUND]: "NI (National Inbound)",
    [StreamType.NATIONAL_OUTBOUND]: "NO (National Outbound)",
};