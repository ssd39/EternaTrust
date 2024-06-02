const go = async () => {
  const ipfsData = await (await fetch(ipfsUrl)).json();
  const resp = await Lit.Actions.decryptAndCombine({
    accessControlConditions,
    ciphertext: ipfsData.ciphertext,
    dataToEncryptHash: ipfsData.dataToEncryptHash,
    authSig: null,
    chain: "ethereum",
  });
  const respData = JSON.parse(resp)
  const conditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: respData.bAddr,
      },
    },
  ];

  const testResult = await Lit.Actions.checkConditions({
    conditions,
    authSig,
    chain,
  });
  if (testResult) {

    //currently using backend endpoint to get rsvp data in future directly use ethers to get the data
    const rsvpDetails =  await (await fetch(url)).json();
    if(rsvpDetails.timestamp>respData.coolDown + respData.initTimestamp){
        Lit.Actions.setResponse({ response: resp });
    }
  }
};

go();
