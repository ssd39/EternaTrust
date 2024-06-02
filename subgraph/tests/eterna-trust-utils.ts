import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AssetAdded,
  RsvpAdded,
  SettingsUpdated,
  WillCreated
} from "../generated/EternaTrust/EternaTrust"

export function createAssetAddedEvent(
  indexId: BigInt,
  owner: Address,
  assetData: string
): AssetAdded {
  let assetAddedEvent = changetype<AssetAdded>(newMockEvent())

  assetAddedEvent.parameters = new Array()

  assetAddedEvent.parameters.push(
    new ethereum.EventParam(
      "indexId",
      ethereum.Value.fromUnsignedBigInt(indexId)
    )
  )
  assetAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  assetAddedEvent.parameters.push(
    new ethereum.EventParam("assetData", ethereum.Value.fromString(assetData))
  )

  return assetAddedEvent
}

export function createRsvpAddedEvent(
  user: Address,
  timestamp: BigInt
): RsvpAdded {
  let rsvpAddedEvent = changetype<RsvpAdded>(newMockEvent())

  rsvpAddedEvent.parameters = new Array()

  rsvpAddedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  rsvpAddedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return rsvpAddedEvent
}

export function createSettingsUpdatedEvent(
  user: Address,
  ipfsHash: string
): SettingsUpdated {
  let settingsUpdatedEvent = changetype<SettingsUpdated>(newMockEvent())

  settingsUpdatedEvent.parameters = new Array()

  settingsUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  settingsUpdatedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )

  return settingsUpdatedEvent
}

export function createWillCreatedEvent(
  willId: BigInt,
  creator: Address,
  willData: string,
  schedule: string
): WillCreated {
  let willCreatedEvent = changetype<WillCreated>(newMockEvent())

  willCreatedEvent.parameters = new Array()

  willCreatedEvent.parameters.push(
    new ethereum.EventParam("willId", ethereum.Value.fromUnsignedBigInt(willId))
  )
  willCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  willCreatedEvent.parameters.push(
    new ethereum.EventParam("willData", ethereum.Value.fromString(willData))
  )
  willCreatedEvent.parameters.push(
    new ethereum.EventParam("schedule", ethereum.Value.fromString(schedule))
  )

  return willCreatedEvent
}
