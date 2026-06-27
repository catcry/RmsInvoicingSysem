package com.supptel.invoicingsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProfileViewId implements Serializable {

    @Column(name = "year-month")
    private String yearMonth;

    @Column(name = "operator")
    private String operator;

    public ProfileViewId() {}

    public ProfileViewId(String yearMonth, String operator) {
        this.yearMonth = yearMonth;
        this.operator = operator;
    }

    // Getters and Setters
    public String getYearMonth() {
        return yearMonth;
    }

    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    // Override equals and hashCode for composite key comparisons
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfileViewId that = (ProfileViewId) o;
        return Objects.equals(yearMonth, that.yearMonth) &&
                Objects.equals(operator, that.operator);
    }

    @Override
    public int hashCode() {
        return Objects.hash(yearMonth, operator);
    }
}