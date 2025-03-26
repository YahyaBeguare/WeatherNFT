const {expect} = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Weather contract", function() {
    let weatherContract, WeatherContract, user;
    const subId = 4414;

    beforeEach(async function(){
        [user] = await ethers.getSigners();
        WeatherContract = await ethers.getContractFactory("WeatherContract");

        weatherContract= await WeatherContract.deploy(subId);
        await weatherContract.waitForDeployment();
    }) 

    // it("should set correctly the subscriptionId", async function(){
    //     expect(await weatherContract.subscriptionId()).to.equal(subId);
    // });

    it("should request temperature and update city after fulfillment", async function () {
        const city = "New York";
        
        // User calls getTemperature
        await weatherContract.connect(user).getTemperature(city);
        
    
        // Get the last request ID from the contract
        const requestId = await weatherContract.lastRequestId();
        expect(requestId).to.not.equal(ethers.constants.HashZero);
    
        // Simulate fulfillment by creating a fake response ("22°C") and no error
        const fakeResponse = ethers.utils.toUtf8Bytes("22°C");
        const fakeError = "0x";
    
        // For testing purposes, we assume fulfillRequest is made public
        await weatherContract.fulfillRequest(requestId, fakeResponse, fakeError);
    
        // Retrieve city data to verify that the temperature has been updated
        const cityData = await weatherContract.getCity(city);
        expect(cityData.temperature).to.equal("22°C");
      });


}) 
