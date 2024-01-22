const main = async () => {
  // 1つ目のアドレスは呼び出す人、2つ目のアドレスはランダムです。
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  let txn = await domainContract.register("doom");
  await txn.wait();

  const domainAddress = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainAddress);
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
