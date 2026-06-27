package com.supptel.invoicingsystem.enumeration;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

public enum StreamType {
    II("INTERNATIONAL_INBOUND"),
    IO("INTERNATIONAL_OUTBOUND"),
    NI("NATIONAL_INBOUND"),
    NO("NATIONAL_OUTBOUND");

    private final String code;

    private static final Map<String, StreamType> CODE_MAP = new HashMap<>();

    static {
        for (StreamType type : values()) {
            CODE_MAP.put(type.code.toUpperCase(), type);
        }
    }

    StreamType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    // ✅ Lookup by code (throws if not found)
    public static StreamType fromCode(String code) {
        StreamType type = CODE_MAP.get(code.toUpperCase());
        if (type == null) {
            throw new IllegalArgumentException("Unknown code: " + code);
        }
        return type;
    }

    // ✅ Lookup by code (safe with Optional)
    public static Optional<StreamType> fromCodeSafe(String code) {
        return Optional.ofNullable(CODE_MAP.get(code.toUpperCase()));
    }

    // ✅ Check if code exists
    public static boolean isValidCode(String code) {
        return CODE_MAP.containsKey(code.toUpperCase());
    }
}
