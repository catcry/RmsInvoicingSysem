package com.supptel.invoicingsystem.enumeration;

public enum ExcludeIncludeType {

    EXCLUDE("E"),
    INCLUDE("I"),
    UNKNOWN("U")
    ;

    private String value;

    ExcludeIncludeType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
