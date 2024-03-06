import { scw } from @arcana/scw;

const scw = new arcana.scw.SCW();
await scw.init("xar_dev_94e94a04c757420c1bb9473f25d2701330a2caa8", window.ethereum);

  const erc20abi = [...];
  let amount = 0.1;

  const erc20Address = "0x2d7aC0907961c7.......45f981Ed8373b5dF86";
  const toAddress = "0x723455665060698....87689dA78E25";
  const Erc20Interface = new ethers.utils.Interface(erc20abi);

  const encodedData = Erc20Interface.encodeFunctionData("transfer", [
    toAddress,
    ethers.utils.parseEther(amount + ""),
  ]);

  console.log("Address: " + scw.getSCWAddress());

  // Check balance

  console.log("Paymaster Balance: " + (await scw.getPaymasterBalance()) / 1e18);

  const erc20abi = [...];
  let amount = 0.1;

  const erc20Address = "0x2d7aC0907961c7.......45f981Ed8373b5dF86";
  const toAddress = "0x723455665060698....87689dA78E25";
  const Erc20Interface = new ethers.utils.Interface(erc20abi);

  const encodedData = Erc20Interface.encodeFunctionData("transfer", [
    toAddress,
    ethers.utils.parseEther(amount + ""),
  ]);

  // You need to create transaction objects of the following interface
  const tx1 = {
    from: scw.getSCWAddress(),
    to: erc20Address, // destination smart contract address
    data: encodedData,
  };

  // Check balance
  // Use scw.getPaymaster() to check whether gas tanks are adequately funded

  console.log("Paymaster Balance: " + (await scw.getPaymasterBalance()) / 1e18);
  if (await scw.getPaymasterBalance()/1e18) > 0 {
    let tx = await scw.doTx(tx1);
    await tx.wait();
    console.log(`Transfer done ${tx.userOpHash}`)
  } else {
    console.log("Insufficient funds in the gas tank.")
  }