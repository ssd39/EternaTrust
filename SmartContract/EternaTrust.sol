// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EternaTrust {
    // TODO:
    // - Add delete will feature
    // - Add remove assets feature

    struct WillData {
        address creator;
        string willData;
        string schedule;
        bool isDeleted;
    }

    struct Asset {
        bool isDeleted;
        string assetData; // IPFS hash
    }

    struct AssetsLocker {
        uint256 indexCount;
        uint256 lastRsvp;
        mapping(uint256 => Asset) assetMapping;
    }

    // Mapping from address to IPFS hash
    mapping(address => string) private settings;

    mapping(uint256 => WillData) private wills;
    mapping(address => AssetsLocker) public assetsLocker;

    uint256 public curWillId = 0;

    // Event to be emitted when an IPFS hash is updated
    event SettingsUpdated(address indexed user, string ipfsHash);
    event WillCreated(
        uint256 willId,
        address indexed creator,
        string willData,
        string schedule
    );
    event AssetAdded(uint256 indexId, address indexed owner, string assetData);
    // Timestamp need to updated to block number in future
    event RsvpAdded(address indexed user, uint256 timestamp);
    // Function to update the IPFS hash associated with the caller's address
    function updateSettings(string memory _ipfsHash) public {
        settings[msg.sender] = _ipfsHash;
        emit SettingsUpdated(msg.sender, _ipfsHash);
    }

    function createWill(
        string memory _willData,
        string memory _schedule
    ) public {
        wills[curWillId] = WillData({
            creator: msg.sender,
            willData: _willData,
            schedule: _schedule,
            isDeleted: false
        });
        emit WillCreated(curWillId, msg.sender, _willData, _schedule);
        curWillId++;
    }

    function addAsset(string memory _assetData) public {
        AssetsLocker storage myLocker = assetsLocker[msg.sender];
        myLocker.assetMapping[myLocker.indexCount] = Asset({
            isDeleted: false,
            assetData: _assetData
        });
        if (myLocker.lastRsvp == 0) {
            emit RsvpAdded(msg.sender, block.timestamp);
        }
        myLocker.lastRsvp = block.timestamp;
        emit AssetAdded(myLocker.indexCount, msg.sender, _assetData);
        myLocker.indexCount++;
    }

    // Function to get the IPFS hash associated with a given address
    function getSettings(address _user) public view returns (string memory) {
        return settings[_user];
    }

    function rsvp() public {
        AssetsLocker storage myLocker = assetsLocker[msg.sender];
        // using timestamp for now need to update with blocknumber in future
        myLocker.lastRsvp = block.timestamp;
        emit RsvpAdded(msg.sender, block.timestamp);
    }

    function getWill(uint256 willId) public view returns (WillData memory) {
        return wills[willId];
    }
}
