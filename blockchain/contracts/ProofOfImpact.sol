// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofOfImpact
 * @dev Records volunteer impact verifications on blockchain
 * @notice This contract creates immutable proof of volunteer work
 */
contract ProofOfImpact {
    // Struct to store impact records
    struct ImpactRecord {
        address volunteer;
        uint256 causeId;
        bytes32 impactHash;
        uint256 timestamp;
        address verifier; // NGO who verified
        bool exists;
    }

    // Mapping: volunteer address => array of impact records
    mapping(address => ImpactRecord[]) public volunteerImpacts;
    
    // Mapping: causeId => count of verifications
    mapping(uint256 => uint256) public causeVerificationCount;
    
    // Total impact records
    uint256 public totalImpacts;

    // Events
    event ImpactRecorded(
        address indexed volunteer,
        uint256 indexed causeId,
        bytes32 indexed impactHash,
        uint256 timestamp,
        address verifier
    );

    event ImpactVerified(
        address indexed volunteer,
        uint256 indexed causeId,
        bytes32 impactHash
    );

    /**
     * @dev Record a new impact verification
     * @param volunteer Address of the volunteer (can be derived from userId)
     * @param causeId Unique identifier for the cause
     * @param impactHash SHA256 hash of impact details (userId:causeId:timestamp)
     */
    function recordImpact(
        address volunteer,
        uint256 causeId,
        bytes32 impactHash
    ) external returns (bytes32) {
        require(volunteer != address(0), "Invalid volunteer address");
        require(causeId > 0, "Invalid cause ID");
        require(impactHash != bytes32(0), "Invalid impact hash");

        // Create impact record
        ImpactRecord memory newImpact = ImpactRecord({
            volunteer: volunteer,
            causeId: causeId,
            impactHash: impactHash,
            timestamp: block.timestamp,
            verifier: msg.sender,
            exists: true
        });

        // Store in mapping
        volunteerImpacts[volunteer].push(newImpact);
        
        // Update counters
        causeVerificationCount[causeId]++;
        totalImpacts++;

        // Emit event
        emit ImpactRecorded(
            volunteer,
            causeId,
            impactHash,
            block.timestamp,
            msg.sender
        );

        return impactHash;
    }

    /**
     * @dev Get all impacts for a volunteer
     * @param volunteer Address of the volunteer
     */
    function getVolunteerImpacts(address volunteer) 
        external 
        view 
        returns (ImpactRecord[] memory) 
    {
        return volunteerImpacts[volunteer];
    }

    /**
     * @dev Get impact count for a volunteer
     * @param volunteer Address of the volunteer
     */
    function getVolunteerImpactCount(address volunteer) 
        external 
        view 
        returns (uint256) 
    {
        return volunteerImpacts[volunteer].length;
    }

    /**
     * @dev Get verification count for a cause
     * @param causeId The cause identifier
     */
    function getCauseVerificationCount(uint256 causeId) 
        external 
        view 
        returns (uint256) 
    {
        return causeVerificationCount[causeId];
    }

    /**
     * @dev Verify an impact record exists
     * @param volunteer Address of the volunteer
     * @param causeId The cause identifier
     * @param impactHash The impact hash to verify
     */
    function verifyImpact(
        address volunteer,
        uint256 causeId,
        bytes32 impactHash
    ) external view returns (bool) {
        ImpactRecord[] memory impacts = volunteerImpacts[volunteer];
        
        for (uint256 i = 0; i < impacts.length; i++) {
            if (
                impacts[i].causeId == causeId &&
                impacts[i].impactHash == impactHash &&
                impacts[i].exists
            ) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @dev Get contract statistics
     */
    function getStats() 
        external 
        view 
        returns (uint256 _totalImpacts) 
    {
        return totalImpacts;
    }
}
