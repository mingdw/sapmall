package common

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"math/rand"
	"time"

	"sapphire-mall/app/internal/cos"
	"sapphire-mall/app/internal/errors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/pkg/jwt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/google/uuid"
	"github.com/o1egl/govatar"
	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 登录
func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.LoginReq) (resp *types.LoginResp, err error) {
	// todo: add your logic here and delete this line
	nonce, err := l.svcCtx.Redis.Get(context.TODO(), req.WalletAddress).Result()
	if err != nil {
		// redis: nil 表示 key 不存在
		if err.Error() == "redis: nil" {
			return nil, errors.DefaultError("nonce not found")
		}
		logx.Errorf("redis get nonce error: %v", err)
		return nil, err
	}

	// 2. 校验签名
	if err = VerifyEthWallet(req.WalletAddress, nonce, req.Signature); err != nil {
		return nil, err
	}

	userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
	// 3. 查询用户
	userInfo, err := userRepository.GetByAddress(l.ctx, req.WalletAddress)
	if err != nil {
		logx.Errorf("get comer by address failed: %v", err)
		return nil, err
	}

	if userInfo == nil {
		// 4. 新用户，创建
		maxID, err := userRepository.GetMaxID(l.ctx)
		if err != nil {
			logx.Errorf("get max id failed: %v", err)
			return nil, err
		}
		maxID++

		avatar, err := createUserAvatar(req.WalletAddress, l.svcCtx)
		if err != nil {
			logx.Errorf("create user avatar failed: %v", err)
			return nil, err
		}
		userInfo = &model.User{
			UniqueId:   fmt.Sprintf("U%d", maxID),
			UserCode:   req.WalletAddress,
			Status:     0,
			StatusDesc: "正常",
			Type:       0,
			TypeDesc:   "普通用户",
			Avatar:     avatar,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}

		err = userRepository.Create(l.ctx, userInfo)
		if err != nil {
			logx.Errorf("create user failed: %v", err)
			return nil, err
		}

	}

	// 6. 删除 nonce
	_, err = l.svcCtx.Redis.Del(context.TODO(), req.WalletAddress).Result()
	if err != nil {
		logx.Errorf("redis remove nonce failed: %v", err)
	}

	// 7. 生成 jwt
	token, err := jwt.Sign(uint64(userInfo.ID), l.svcCtx.Config.Auth.AccessSecret, l.svcCtx.Config.Auth.AccessExpire)
	if err != nil {
		logx.Errorf("generate jwt token failed: %v", err)
		return nil, err
	}

	return &types.LoginResp{
		Token: token,
	}, nil

}

func VerifyEthWallet(address, nonce, signature string) error {
	logx.Infof("address: %v, nonce: %v, signature: %v", address, nonce, signature)
	addrKey := common.HexToAddress(address)
	sig := hexutil.MustDecode(signature)
	if sig[64] == 27 || sig[64] == 28 {
		sig[64] -= 27
	}
	msg := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(nonce), nonce)
	msg256 := crypto.Keccak256([]byte(msg))
	pubKey, err := crypto.SigToPub(msg256, sig)
	if err != nil {
		return err
	}
	recoverAddr := crypto.PubkeyToAddress(*pubKey)
	if recoverAddr != addrKey {
		return errors.DefaultError("Address mismatch")
	}
	return nil
}

func createUserAvatar(address string, svcCtx *svc.ServiceContext) (string, error) {
	// 1. 生成 govatar 头像
	buf := new(bytes.Buffer)
	// govatar 支持 Male/Female，可用地址 hash 决定性别
	gender := govatar.MALE
	if hash(address)%2 == 1 {
		gender = govatar.FEMALE
	}
	img, err := govatar.GenerateForUsername(gender, address)
	if err != nil {
		return "", err
	}
	err = png.Encode(buf, img)
	if err != nil {
		return "", err
	}
	// 2. 上传到COS（同你现有逻辑）
	uniqueId := uuid.New().String()
	key := "avatar/" + uniqueId + ".png"

	// 3. 上传到COS
	res, err := cos.UploadStreamToCOS(svcCtx.CosClient, key, buf, "image/png")
	if err != nil {
		return "", err
	}
	logx.Infof("upload avatar to cos success: %v", res)
	// 4. 拼接头像URL
	bucket := svcCtx.Config.Cos.BucketName
	region := svcCtx.Config.Cos.Region
	avatarURL := "https://" + bucket + ".cos." + region + ".myqcloud.com/" + key
	return avatarURL, nil
}

func hash(s string) int {
	h := 0
	for _, c := range s {
		h = int(c) + 31*h
	}
	return h
}

// generateRandomAvatar 生成简单的随机头像图片（可替换为更复杂的生成逻辑）
func generateRandomAvatar(seed string) *image.RGBA {
	rand.Seed(time.Now().UnixNano())
	w, h := 128, 128
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	// 随机颜色
	color := color.RGBA{
		R: uint8(rand.Intn(256)),
		G: uint8(rand.Intn(256)),
		B: uint8(rand.Intn(256)),
		A: 255,
	}
	for x := 0; x < w; x++ {
		for y := 0; y < h; y++ {
			img.Set(x, y, color)
		}
	}
	return img
}
