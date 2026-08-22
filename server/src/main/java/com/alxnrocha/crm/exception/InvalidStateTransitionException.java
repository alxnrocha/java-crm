package com.alxnrocha.crm.exception;

import com.alxnrocha.crm.enums.ContractStatus;

public class InvalidStateTransitionException extends RuntimeException {
    public InvalidStateTransitionException(ContractStatus from, ContractStatus to) {
        super(String.format("Cannot transition contract status from %s to %s", from, to));
    }

    public InvalidStateTransitionException(String message) {
        super(message);
    }
}
