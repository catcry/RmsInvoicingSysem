package com.supptel.invoicingsystem.converter;

import com.supptel.invoicingsystem.enumeration.ExcludeIncludeType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ExcludeIncludeTypeConverter implements AttributeConverter<ExcludeIncludeType, String> {
    @Override
    public String convertToDatabaseColumn(ExcludeIncludeType attribute) {
        return attribute != null ? attribute.getValue() : null;
    }
    @Override
    public ExcludeIncludeType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return switch (dbData) {
            case "E" -> ExcludeIncludeType.EXCLUDE;
            case "I" -> ExcludeIncludeType.INCLUDE;
            default -> ExcludeIncludeType.UNKNOWN;
        };
    }
}
