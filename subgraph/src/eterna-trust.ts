import {
  AssetAdded as AssetAddedEvent,
  RsvpAdded as RsvpAddedEvent,
  SettingsUpdated as SettingsUpdatedEvent,
  WillCreated as WillCreatedEvent
} from "../generated/EternaTrust/EternaTrust"
import {
  AssetAdded,
  RsvpAdded,
  SettingsUpdated,
  WillCreated
} from "../generated/schema"

export function handleAssetAdded(event: AssetAddedEvent): void {
  let entity = new AssetAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.indexId = event.params.indexId
  entity.owner = event.params.owner
  entity.assetData = event.params.assetData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRsvpAdded(event: RsvpAddedEvent): void {
  let entity = new RsvpAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSettingsUpdated(event: SettingsUpdatedEvent): void {
  let entity = new SettingsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.ipfsHash = event.params.ipfsHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWillCreated(event: WillCreatedEvent): void {
  let entity = new WillCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.willId = event.params.willId
  entity.creator = event.params.creator
  entity.willData = event.params.willData
  entity.schedule = event.params.schedule

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
