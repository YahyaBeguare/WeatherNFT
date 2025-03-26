const hre= require("hardhat");
// const {ethers}= require("ethers");
require("dotenv").config();
const fs = require("fs");


const addressFile = require("../address.json");

let contractAddress ;
async function deployContract(){
    try{
    const [deployer]= await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const weatherContract= await hre.ethers.deployContract("WeatherContract", [4414]);
    await weatherContract.waitForDeployment(); 
    contractAddress = weatherContract.target
    console.log("Weather contract deployed to:", contractAddress);

    }catch(error){
        console.error("Error deploying contract:", error);
        process.exit(1);
    }

    try{
        addressFile["wetherContractAddress"]= {wetherContractAddress: contractAddress};
        fs.writeFileSync("./address.json", JSON.stringify(contractAddress, null, 2));
    }catch(error){
        console.error("Error writing contract address to file:", error);
        process.exit(1);
    }

} 

deployContract().catch(error=>{
    console.error(error);
    process.exit(1);
})