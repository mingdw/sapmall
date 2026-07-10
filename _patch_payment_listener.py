import pathlib

path = pathlib.Path(r"backend_service/app/internal/listener/payment_listener.go")
c = path.read_text(encoding="utf-8")

old_sig = (
    "// paymentPaidEventTopic 是 PaymentPaid(string,string,address,address,uint256,uint256) 事件的 topic hash\n"
    'var paymentPaidEventTopic = crypto.Keccak256Hash([]byte("PaymentPaid(string,string,address,address,uint256,uint256)"))'
)
new_sig = (
    "// paymentPaidEventTopic 是 PaymentPaid(string,string,address,address,address,uint256,uint256) 事件的 topic hash\n"
    'var paymentPaidEventTopic = crypto.Keccak256Hash([]byte("PaymentPaid(string,string,address,address,address,uint256,uint256)"))'
)

old_struct = (
    "\tPayer        common.Address // 支付者地址\n"
    "\tToken        common.Address // 支付代币地址"
)
new_struct = (
    "\tPayer        common.Address // 支付者地址\n"
    "\tSeller       common.Address // 卖家地址\n"
    "\tToken        common.Address // 支付代币地址"
)

old_decode = (
    "\t// 非 indexed 参数: token(address), amount(uint256), timestamp(uint256)\n"
    "\tdata := log.Data\n"
    "\tif len(data) >= 96 {\n"
    "\t\tevent.Token = common.BytesToAddress(data[12:32])\n"
    "\t\tevent.Amount = new(big.Int).SetBytes(data[32:64])\n"
    "\t\tevent.Timestamp = new(big.Int).SetBytes(data[64:96])\n"
    "\t} else if len(data) >= 64 {\n"
    "\t\tevent.Token = common.BytesToAddress(data[12:32])\n"
    "\t\tevent.Amount = new(big.Int).SetBytes(data[32:64])\n"
    "\t} else {\n"
    '\t\treturn nil, fmt.Errorf("invalid PaymentPaid event data length: %d", len(data))\n'
    "\t}"
)
new_decode = (
    "\t// 非 indexed 参数在 Data 中：seller(address), token(address), amount(uint256), timestamp(uint256)\n"
    "\tdata := log.Data\n"
    "\tif len(data) >= 128 {\n"
    "\t\tevent.Seller = common.BytesToAddress(data[12:32])\n"
    "\t\tevent.Token = common.BytesToAddress(data[44:64])\n"
    "\t\tevent.Amount = new(big.Int).SetBytes(data[64:96])\n"
    "\t\tevent.Timestamp = new(big.Int).SetBytes(data[96:128])\n"
    "\t} else {\n"
    '\t\treturn nil, fmt.Errorf("invalid PaymentPaid event data length: %d", len(data))\n'
    "\t}"
)

for name, old, new in [
    ("sig", old_sig, new_sig),
    ("struct", old_struct, new_struct),
    ("decode", old_decode, new_decode),
]:
    if old not in c:
        raise SystemExit(f"missing block: {name}")
    c = c.replace(old, new, 1)

path.write_text(c, encoding="utf-8", newline="\n")
print("patched ok")
