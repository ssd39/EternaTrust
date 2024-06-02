const go = async () => {
  // TODO:
  // Add logic to fetch last rsvp of given user if it exceed cool down period then only return beneficiary email
  // For test version directly returning the details
  // test an access control condition
  const conditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain, //param
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37",
      },
    },
  ];
  const testResult = await Lit.Actions.checkConditions({
    conditions,
    authSig, //param
    chain,
  });

  if (testResult) {
    const result = await Lit.Actions.decryptAndCombine({
      accessControlConditions: decryptAccessControlConditions, //param
      ciphertext, //param
      dataToEncryptHash, //param
      authSig: null,
      chain,
    });
    const willData = JSON.parse(result);

    Lit.Actions.setResponse({ response: { emaill: willData.bEmail } });
  }
};

go();
