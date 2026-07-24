package cctp

// MVP 路由常量（与 Circle CCTP / faucet 对齐）
// https://developers.circle.com/cctp/concepts/supported-chains-and-domains
// https://faucet.circle.com/
const (
	EthereumSepoliaChainID   = 11155111
	ArbitrumSepoliaChainID   = 421614
	AvalancheFujiChainID     = 43113
	BaseSepoliaChainID       = 84532
	OPSepoliaChainID         = 11155420
	PolygonAmoyChainID       = 80002
	LineaSepoliaChainID      = 59141
	UnichainSepoliaChainID   = 1301
	WorldchainSepoliaChainID = 4801
	ArcTestnetChainID        = 5042002

	EthereumSepoliaDomain   = 0
	AvalancheFujiDomain     = 1
	OPSepoliaDomain         = 2
	ArbitrumSepoliaDomain   = 3
	BaseSepoliaDomain       = 6
	PolygonAmoyDomain       = 7
	UnichainSepoliaDomain   = 10
	LineaSepoliaDomain      = 11
	WorldchainSepoliaDomain = 14
	ArcTestnetDomain        = 26

	TokenMessengerV2      = "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA"
	EthereumSepoliaUSDC   = "0x1c7D4B196Cb0C7B01d157F041a657A09DDBf8aF4"
	ArbitrumSepoliaUSDC   = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
	AvalancheFujiUSDC     = "0x5425890298aed601595a70AB815c96711a31Bc65"
	BaseSepoliaUSDC       = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
	OPSepoliaUSDC         = "0x5fd84259d66Cd46123540766Be93DFE6D43130D7"
	PolygonAmoyUSDC       = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
	LineaSepoliaUSDC      = "0xFEce4462D57bD51A6A552365A011b95f0E16d9B7"
	UnichainSepoliaUSDC   = "0x31d0220469e10c4E71834a79b1f276d740d3768F"
	WorldchainSepoliaUSDC = "0x66145f38cBAC35Ca6F1Dfb4914dF98F1614aeA88"
	ArcMessageTransmitter = "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275"
	MinFinalityThreshold  = 1000
	ZeroBytes32           = "0x0000000000000000000000000000000000000000000000000000000000000000"
	DefaultIrisBaseURL    = "https://iris-api-sandbox.circle.com"

	// USDCDecimals Circle USDC 小数位（各测试网一致为 6）
	USDCDecimals = 6
	USDCSymbol   = "USDC"
)

// SourceChainMeta 可跨入 Arc 的源链元数据
type SourceChainMeta struct {
	ChainID int
	Domain  int
	USDC    string
	Name    string
}

// ArcSourceChains 可在 Circle Faucet 领 USDC、且支持 CCTP 跨入 Arc 的测试网
// 不含 Celo Sepolia / ZKsync（水龙头有 USDC，但不在 CCTP V2 domain 列表）
var ArcSourceChains = map[int]SourceChainMeta{
	EthereumSepoliaChainID: {
		ChainID: EthereumSepoliaChainID,
		Domain:  EthereumSepoliaDomain,
		USDC:    EthereumSepoliaUSDC,
		Name:    "Ethereum Sepolia",
	},
	ArbitrumSepoliaChainID: {
		ChainID: ArbitrumSepoliaChainID,
		Domain:  ArbitrumSepoliaDomain,
		USDC:    ArbitrumSepoliaUSDC,
		Name:    "Arbitrum Sepolia",
	},
	AvalancheFujiChainID: {
		ChainID: AvalancheFujiChainID,
		Domain:  AvalancheFujiDomain,
		USDC:    AvalancheFujiUSDC,
		Name:    "Avalanche Fuji",
	},
	BaseSepoliaChainID: {
		ChainID: BaseSepoliaChainID,
		Domain:  BaseSepoliaDomain,
		USDC:    BaseSepoliaUSDC,
		Name:    "Base Sepolia",
	},
	OPSepoliaChainID: {
		ChainID: OPSepoliaChainID,
		Domain:  OPSepoliaDomain,
		USDC:    OPSepoliaUSDC,
		Name:    "OP Sepolia",
	},
	PolygonAmoyChainID: {
		ChainID: PolygonAmoyChainID,
		Domain:  PolygonAmoyDomain,
		USDC:    PolygonAmoyUSDC,
		Name:    "Polygon PoS Amoy",
	},
	LineaSepoliaChainID: {
		ChainID: LineaSepoliaChainID,
		Domain:  LineaSepoliaDomain,
		USDC:    LineaSepoliaUSDC,
		Name:    "Linea Sepolia",
	},
	UnichainSepoliaChainID: {
		ChainID: UnichainSepoliaChainID,
		Domain:  UnichainSepoliaDomain,
		USDC:    UnichainSepoliaUSDC,
		Name:    "Unichain Sepolia",
	},
	WorldchainSepoliaChainID: {
		ChainID: WorldchainSepoliaChainID,
		Domain:  WorldchainSepoliaDomain,
		USDC:    WorldchainSepoliaUSDC,
		Name:    "World Chain Sepolia",
	},
}

// ResolveArcSource 解析可跨入 Arc 的源链；不支持则返回 false
func ResolveArcSource(chainID int) (SourceChainMeta, bool) {
	meta, ok := ArcSourceChains[chainID]
	return meta, ok
}

// StatusDesc 返回状态中文描述
func StatusDesc(status int8) string {
	switch status {
	case 0:
		return "已创建"
	case 1:
		return "源链锁定"
	case 2:
		return "待铸造"
	case 3:
		return "已铸造"
	case 4:
		return "已完成"
	case 5:
		return "失败"
	default:
		return "未知"
	}
}
