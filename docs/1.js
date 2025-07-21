const { ethers } = require('ethers');
const readline = require('readline');

/**
 * MetaMask 钱包签名生成脚本
 * 此脚本接收一个 nonce 字符串作为输入，然后返回使用 MetaMask 钱包对该 nonce 的签名
 */

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    // 检查是否有浏览器环境中的 ethereum 对象 (MetaMask)
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('请注意：此脚本需要在浏览器环境中运行，且已安装 MetaMask 插件');
      console.log('在 Node.js 环境下，我们将使用私钥来模拟签名过程');
      
      // 在 Node.js 环境下使用私钥模拟
      await signWithPrivateKey();
    } else {
      // 在浏览器环境下使用 MetaMask
      await signWithMetaMask();
    }
  } catch (error) {
    console.error('签名过程中发生错误:', error.message);
  } finally {
    rl.close();
  }
}

async function signWithMetaMask() {
  try {
    // 请求用户连接 MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    console.log(`已连接钱包地址: ${account}`);
    
    // 获取要签名的 nonce
    const nonce = await promptForNonce();
    
    // 创建要签名的消息
    const message = `${nonce}`;
    
    // 使用 MetaMask 签名
    console.log(`正在签名消息: "${message}"`);
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account]
    });
    
    console.log('\n签名成功!');
    console.log(`钱包地址: ${account}`);
    console.log(`签名消息: ${message}`);
    console.log(`签名结果: ${signature}`);
    
    // 验证签名
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log(`\n验证签名: ${recoveredAddress === account ? '有效 ✓' : '无效 ✗'}`);
    console.log(`恢复的地址: ${recoveredAddress}`);
  } catch (error) {
    console.error('MetaMask 签名过程中发生错误:', error.message);
  }
}

async function signWithPrivateKey() {
  try {
    // 提示用户输入私钥（在实际应用中应当谨慎处理）
    const privateKey = await new Promise(resolve => {
      rl.question('请输入您的私钥 (警告：仅用于测试，请勿在不信任的环境中输入真实私钥): ', resolve);
    });
    
    // 创建钱包实例
    const wallet = new ethers.Wallet(privateKey);
    console.log(`\n钱包地址: ${wallet.address}`);
    
    // 获取要签名的 nonce
    const nonce = await promptForNonce();
    
    // 创建要签名的消息
    const message = `${nonce}`;
    
    // 使用私钥签名
    console.log(`正在签名消息: "${message}"`);
    const signature = await wallet.signMessage(message);
    
    console.log('\n签名成功!');
    console.log(`钱包地址: ${wallet.address}`);
    console.log(`签名消息: ${message}`);
    console.log(`签名结果: ${signature}`);
    
    // 验证签名
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log(`\n验证签名: ${recoveredAddress === wallet.address ? '有效 ✓' : '无效 ✗'}`);
    console.log(`恢复的地址: ${recoveredAddress}`);
  } catch (error) {
    console.error('私钥签名过程中发生错误:', error.message);
  }
}

// 获取用户输入的 nonce
async function promptForNonce() {
  return new Promise(resolve => {
    rl.question('请输入 nonce 字符串: ', resolve);
  });
}

// 执行主函数
main();