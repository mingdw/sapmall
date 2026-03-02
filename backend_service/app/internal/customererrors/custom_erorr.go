package customererrors

import (
	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/types"
)

// SuccessResp 返回成功的 BaseResp
func SuccessDefault() *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SUCCESS,
		Message: consts.GetErrorMessage(consts.SUCCESS),
		Data:    nil,
	}
}

// SuccessRespWithMsg 返回带自定义消息的成功 BaseResp
func SuccessMsg(msg string) *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SUCCESS,
		Message: msg,
		Data:    nil,
	}
}

func SuccessData(data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SUCCESS,
		Message: consts.GetErrorMessage(consts.SUCCESS),
		Data:    data,
	}
}

func Success(code int, msg string, data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code:    code,
		Message: msg,
		Data:    data,
	}
}

func FailDefault() *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SYSTEM_ERROR,
		Message: consts.GetErrorMessage(consts.SYSTEM_ERROR),
		Data:    nil,
	}
}

func FailMsg(msg string) *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SYSTEM_ERROR,
		Message: msg,
		Data:    nil,
	}
}

func FailData(data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code:    consts.SYSTEM_ERROR,
		Message: consts.GetErrorMessage(consts.SYSTEM_ERROR),
		Data:    data,
	}
}

func Fail(code int, msg string, data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code:    code,
		Message: msg,
		Data:    data,
	}
}

// ParamErrorResp 返回参数错误 BaseResp
func ParamErrorResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.PARAM_ERROR)
	}
	return &types.BaseResp{
		Code:    consts.PARAM_ERROR,
		Message: msg,
		Data:    nil,
	}
}

// AuthFailedResp 返回认证失败 BaseResp
func AuthFailedResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.AUTH_FAILED)
	}
	return &types.BaseResp{
		Code:    consts.AUTH_FAILED,
		Message: msg,
		Data:    nil,
	}
}

// PermissionDeniedResp 返回权限不足 BaseResp
func PermissionDeniedResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.PERMISSION_DENIED)
	}
	return &types.BaseResp{
		Code:    consts.PERMISSION_DENIED,
		Message: msg,
		Data:    nil,
	}
}

// NotFoundResp 返回资源不存在 BaseResp
func NotFoundResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.RESOURCE_NOT_FOUND)
	}
	return &types.BaseResp{
		Code:    consts.RESOURCE_NOT_FOUND,
		Message: msg,
		Data:    nil,
	}
}

// DatabaseErrorResp 返回数据库错误 BaseResp
func DatabaseErrorResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.DATABASE_ERROR)
	}
	return &types.BaseResp{
		Code:    consts.DATABASE_ERROR,
		Message: msg,
		Data:    nil,
	}
}
