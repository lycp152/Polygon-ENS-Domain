const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("nyanko");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // domainをオリジナルにしましょう！
  let txn = await domainContract.register("banana", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();
  console.log("Minted domain banana.nyanko");

  txn = await domainContract.setRecord("banana", "Am I a banana or a nyanko??");
  await txn.wait();
  console.log("Set record for banana.nyanko");

  const address = await domainContract.signer.getAddress("banana");
  console.log("Owner of domain banana:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
