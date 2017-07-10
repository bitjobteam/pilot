pragma solidity ^0.4.2;



/* define 'owned' */
contract owned {
     address public owner;

     
   
    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
        
    }	

     function kill() {
        if (msg.sender == owner) selfdestruct(owner);
    }
}

contract ld {
    
    mapping (address => uint) public voteWeight;
    function updateVoteWeight(address member, uint numTokens) returns (bool success);
}
     


contract member is owned{   
    
     mapping (address => uint) public memberId;  
     Member[] public members;     
     uint public numMembers;
     ld public ldAddress;
     
    struct Member {
        address member;
        bool canVote;
	    uint memberSince;
        string firstName;
	    string lastName;
	    string userID;
	    bool delegated; 
        bytes32 memberHash;
        bool admin;   
    }
    
    event MembershipChanged(address member, bool isMember, string firstName, string lastName, string userID, string status);
    event BlockUnblockMember(address member, bool status);
    event OwnershipTransfer(bool result);
    event DelegatoionStatusChanged(address member, bool tatus);
    event ChangedLDAddress(address ldAddress);
    event ResetDelegations(bool status);
    
    
    function member(ld ldAddressToSet){
        ldAddress =  ldAddressToSet;
        
    }

      function changeLDAddress(ld ldContractAddress)onlyOwner returns (bool){
        ldAddress = ldContractAddress;
        ChangedLDAddress(ldAddress);
        return true;
    }
    
    
    function makeAdmin(address newAdmin){
	    
	    uint id;
	    
	    id = memberId[msg.sender];
	    Member currentAdmin = members[id];
	    
	    if( !currentAdmin.admin )
	       throw;
	    
	    
	    id = memberId[newAdmin];
		Member m = members[id];
		m.admin = true;
		
		id = memberId[msg.sender];
		m = members[id];
	    m.admin = false;
	    owner = newAdmin;
	}


    //to call from ld contract

    function clearDelegation()returns (bool){

        if (ldAddress == msg.sender || msg.sender == owner) {

        for (uint i=0; i< numMembers; i++) {		    	
	       members[i].delegated= false;
           ResetDelegations(true);    
        }       
        return true;
    }
     return false;
    
    }

    function updateDelegatedStatus(address member, bool status) returns (bool){

        if (ldAddress == msg.sender || msg.sender == owner) {

            uint id = memberId[member];
		    Member m = members[id]; 
            m.delegated = status;
            DelegatoionStatusChanged(member,  status);
            return true;
        }
        return false;
    
    }
	
	function blockUnblockMember(address targetMember, bool canVote) onlyOwner {
	    
	    uint id;
	    id = memberId[targetMember];
        Member m = members[id];
        m.canVote = canVote;
        BlockUnblockMember(targetMember, canVote);
	}

 /*make member*/
	 ///Enter user id and password to access this contract over the online app
    function newMember(address targetMember, bool canVote, string firstName, string lastName, string userID,  bytes32 memberHash)  {
		
		
        uint id;
	    bool delegated = false;
	    bool adminFlag = false;
	    
	  
	    
	    if (stringsEqualMemory("admin@admin.com", userID)){adminFlag = true;}
	    

        if(getMemberByUserID(userID) >= 0){
                MembershipChanged(targetMember, canVote, firstName, lastName, userID, "duplicate id");
               

           }
						      
	    else  {
	       
	        memberId[targetMember] = members.length ;
	        id = members.length++;
            members[id] = Member({member: targetMember, canVote: canVote, memberSince: now, firstName: firstName, lastName:lastName, userID:userID, delegated:false,  memberHash:memberHash, admin:adminFlag});			
            numMembers++;	
            MembershipChanged(targetMember, canVote, firstName, lastName, userID, "created");				
        } 

        

    }
    
    function getMemberByUserID(string userID) constant returns (int memberPosition){
       
       if (members.length == 0) {
          return -1;
          }

       for (uint i=0; i < members.length; i++){
            if (stringsEqual(members[i].userID , userID) ){
               return int(i);
       }       
      
     
   }
    return -1;
    
}

	function stringsEqualMemory(string memory _a, string memory _b) constant internal returns (bool) {
		bytes memory a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)	
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}

   function stringsEqual(string storage _a, string memory _b) constant internal returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)	
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}
}