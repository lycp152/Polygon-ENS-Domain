const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // 'nyanko'をデプロイ時にconstructorに渡します。
  const domainContract = await domainContractFactory.deploy("nyanko");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // valueで代金をやりとりしています。
  let txn = await domainContract.register("mortal", {
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await txn.wait();

  const address = await domainContract.signer.getAddress("mortal");
  console.log("Owner of domain mortal:", address);

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
