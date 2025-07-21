package errors

import (
	consts "sapphire-mall/app/internal/const"
)

type CustomError struct {
	Code    int
	Message string
}

func (e *CustomError) Error() string {
	return e.Message
}

func NewCustomError(code int, message string) *CustomError {
	return &CustomError{
		Code:    code,
		Message: message,
	}
}

func DefaultError(errorMsg string) *CustomError {
	return &CustomError{
		Code:    consts.SYSTEM_ERROR,
		Message: errorMsg,
	}
}
