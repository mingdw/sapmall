package errors

import (
	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/types"
)

// SuccessResp 返回成功的 BaseResp
func SuccessResp(data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code: consts.SUCCESS,
		Msg:  consts.GetErrorMessage(consts.SUCCESS),
		Data: data,
	}
}

// SuccessRespWithMsg 返回带自定义消息的成功 BaseResp
func SuccessRespWithMsg(msg string, data interface{}) *types.BaseResp {
	return &types.BaseResp{
		Code: consts.SUCCESS,
		Msg:  msg,
		Data: data,
	}
}

// FailResp 返回失败的 BaseResp
func FailResp(code int, msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(code)
	}
	return &types.BaseResp{
		Code: code,
		Msg:  msg,
		Data: nil,
	}
}

// FailRespWithData 返回带数据的失败 BaseResp
func FailRespWithData(code int, msg string, data interface{}) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(code)
	}
	return &types.BaseResp{
		Code: code,
		Msg:  msg,
		Data: data,
	}
}

// DefaultFailResp 返回默认的系统错误 BaseResp
func DefaultFailResp(errorMsg string) *types.BaseResp {
	return &types.BaseResp{
		Code: consts.SYSTEM_ERROR,
		Msg:  errorMsg,
		Data: nil,
	}
}

// ParamErrorResp 返回参数错误 BaseResp
func ParamErrorResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.PARAM_ERROR)
	}
	return &types.BaseResp{
		Code: consts.PARAM_ERROR,
		Msg:  msg,
		Data: nil,
	}
}

// AuthFailedResp 返回认证失败 BaseResp
func AuthFailedResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.AUTH_FAILED)
	}
	return &types.BaseResp{
		Code: consts.AUTH_FAILED,
		Msg:  msg,
		Data: nil,
	}
}

// PermissionDeniedResp 返回权限不足 BaseResp
func PermissionDeniedResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.PERMISSION_DENIED)
	}
	return &types.BaseResp{
		Code: consts.PERMISSION_DENIED,
		Msg:  msg,
		Data: nil,
	}
}

// NotFoundResp 返回资源不存在 BaseResp
func NotFoundResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.RESOURCE_NOT_FOUND)
	}
	return &types.BaseResp{
		Code: consts.RESOURCE_NOT_FOUND,
		Msg:  msg,
		Data: nil,
	}
}

// DatabaseErrorResp 返回数据库错误 BaseResp
func DatabaseErrorResp(msg string) *types.BaseResp {
	if msg == "" {
		msg = consts.GetErrorMessage(consts.DATABASE_ERROR)
	}
	return &types.BaseResp{
		Code: consts.DATABASE_ERROR,
		Msg:  msg,
		Data: nil,
	}
}
