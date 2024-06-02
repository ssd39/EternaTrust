import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AssetAdded } from "../generated/schema"
import { AssetAdded as AssetAddedEvent } from "../generated/EternaTrust/EternaTrust"
import { handleAssetAdded } from "../src/eterna-trust"
import { createAssetAddedEvent } from "./eterna-trust-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let indexId = BigInt.fromI32(234)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let assetData = "Example string value"
    let newAssetAddedEvent = createAssetAddedEvent(indexId, owner, assetData)
    handleAssetAdded(newAssetAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AssetAdded created and stored", () => {
    assert.entityCount("AssetAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AssetAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "indexId",
      "234"
    )
    assert.fieldEquals(
      "AssetAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AssetAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assetData",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
