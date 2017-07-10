
pragma solidity ^0.4.2;


contract token { 
               mapping (address => uint256) public balanceOf;  
               function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
               function mintToken (address target, uint256 mintedAmount);
               }
               
               
contract member {
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
                
                Member[] public members;
                uint public numMembers;
                mapping (address => uint) public memberId;  
               
    }
    
    
contract ld {
    
    mapping (address => uint) public voteWeight;
    function updateVoteWeight(address sender, uint numTokens) returns (bool success);
}
               




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


contract ledger is owned {
    
    uint public singleTokenCost;
    uint public totalRewardToken;
    token public sharesTokenAddress;
    uint public tokensInCirculation;
    ld public ldContractAddress;
    member public memberAddress;
    AllocatedTokens[] public tokensLockedForProjects; 
    
    
       struct AllocatedTokens{
        address member;
        uint proposalID;
        uint tokenAmount;
    }
    
    
    event BuyTokens(uint numOfTokens, address buyer, uint value); 
    event ChangedLDAddress(address ldAddress);
    event ChangedTokenAddress(address sharesAddress);
    event ChangedMemberAddress(address memberAddress);   
    event TokensAllocated(uint proposalID, uint numOfTokens);
    
     /* modifier that allows only shareholders to participate in auction */
    modifier onlyShareholders() {
        if (sharesTokenAddress.balanceOf(msg.sender) == 0) throw;
             _;
    }
    
    function ledger(token _tokenAddress, ld _ldAddress, member _memberAddres, uint _tokenCost, uint _tokensNumInCicrculation) onlyOwner {
        sharesTokenAddress = _tokenAddress;
        ldContractAddress = _ldAddress;
        singleTokenCost =  _tokenCost;
        memberAddress = _memberAddres;
        tokensInCirculation = _tokensNumInCicrculation;
        
    }
    

    // used onloy for development
    function clearAllocatedToekens() onlyOwner {


        delete tokensLockedForProjects;
    }
    


    function returnTokenNoForProject(uint _proposalID) constant returns (uint){

        uint totalRewardTokenForProject;

         for (uint i=0; i< tokensLockedForProjects.length; i++ ){

           if (tokensLockedForProjects[i].proposalID ==_proposalID ){

               totalRewardTokenForProject += tokensLockedForProjects[i].tokenAmount;
           }
         }
         return totalRewardTokenForProject;
    }

    function returnTokenNoForProjectAndMember(uint _proposalID, address _member) constant returns(uint){
        uint amountRewardTokenForProjectAndMember;

         for (uint i=0; i< tokensLockedForProjects.length; i++ ){

           if (tokensLockedForProjects[i].proposalID == _proposalID  && tokensLockedForProjects[i].member == _member ){

               amountRewardTokenForProjectAndMember = tokensLockedForProjects[i].tokenAmount;
               return amountRewardTokenForProjectAndMember;
           }
         }
         
         return 0;

    }

    function allocateTokens(uint _tokensToLock, uint _proposalId)   returns (bool){

         if ( ldContractAddress == msg.sender || owner == msg.sender) {   

             if(  tokensInCirculation -  totalRewardToken >  _tokensToLock){
                        
               uint membersCount = memberAddress.numMembers();   
               uint allocationIndex;
               totalRewardToken += _tokensToLock;
               
                                         
               for (uint i=0; i < membersCount; i++){
                   
                    var (memberToProcess,,,,,,,,) = memberAddress.members(i);
                    uint tokenBalance = sharesTokenAddress.balanceOf(memberToProcess);
                    uint userTokensToLock = tokenBalance * _tokensToLock/ tokensInCirculation ;
                    
                    allocationIndex = tokensLockedForProjects.length++;
                    AllocatedTokens at = tokensLockedForProjects[allocationIndex];
                    at.member = memberToProcess;
                    at.proposalID = _proposalId;
                    at.tokenAmount = userTokensToLock;
               }
                TokensAllocated(_proposalId, _tokensToLock);
                return true;
            }
         }

         TokensAllocated(_proposalId, _tokensToLock);
         return false;
               
        
       
       
    }
    
      function changeTokenAddress (token sharesAddress ) onlyOwner returns (bool){
        sharesTokenAddress = sharesAddress;
        ChangedTokenAddress(sharesAddress);
        return true;
    }
    
     function changeLDAddress(ld ldAddress)onlyOwner returns (bool){
        ldContractAddress = ldAddress;
        ChangedLDAddress(ldAddress);
        return true;
    }
    
      function changeMemberAddress(member _member)onlyOwner returns (bool){
        memberAddress = _member;
        ChangedMemberAddress(_member);
        return true;
    }
    
    


 function buyTokens(uint numOfTokens) payable returns (bool){


       // BeforeCallingLD( this , numOfTokens, msg.sender, msg.value);

        if (msg.sender.balance == 0) throw;

         uint totalTokenCost = singleTokenCost * numOfTokens;
         uint userBalance = msg.sender.balance ;
         uint maxTokenToBuy = userBalance / singleTokenCost;

        
        
           if ( numOfTokens >= maxTokenToBuy || totalTokenCost > msg.value){               
                 BuyTokens(0, msg.sender, msg.value);               
                 throw; 
                 } 
         
          sharesTokenAddress.mintToken(msg.sender, numOfTokens);
          tokensInCirculation += numOfTokens;
         
          if (!ldContractAddress.updateVoteWeight( msg.sender, numOfTokens)) throw;
          BuyTokens(numOfTokens, msg.sender, msg.value);

          return true; 
    }


}   