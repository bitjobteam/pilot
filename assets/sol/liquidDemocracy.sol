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
                function clearDelegation() returns (bool success);
                function updateDelegatedStatus(address member, bool status) returns (bool);
    }

contract ledger {
    
     uint public tokensInCirculation;
     function allocateTokens(uint _tokensToLock, uint _proposalId)  returns (bool);
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


contract ld is owned {
    
    /* Contract Variables and events */
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    Proposal[] public proposals;
    mapping (address => uint) public voteWeight;
    DelegatedVote[] public delegatedVotes;
    token public sharesTokenAddress;
    member public memberAddress;
    uint public numProposals;
    ledger public ledgerAddress;
    
    struct DelegatedVote {
        address nominee;
        address voter;
        uint weight;
    }
    
    
    event ProposalAdded(uint proposalID, string description, string title, address creator, uint dateEntered, uint tokenAmount, string refernce);
    event Voted(uint proposalID, bool position, address voter);
    event ProposalTallied(uint proposalID, uint yea , uint nay, uint quorum, uint executed);
    event NoQuorum(uint proposalID, uint yea , uint nay, uint quorum, bool proposalPassed);				
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes);
    event Delegated(address nominatedAddress, address voters, uint voteIndex);
    event DelegationReset(bool status);
    event DelegationExecuted(bool result);
    event CancelDelegation(address  nominatedAddress);
    event ChangedTokenAddress(address newTokenAddress);
    event ChangedLedgerAddress(address newLedgerAddress);
    event ChangedMemberAddress(address memberAddressToSet);
    event VoteWeightUpdated(address member, uint weightAdded, uint totalWeight);
    
    
    
     /* modifier that allows only shareholders to participate in auction */
    modifier onlyShareholders() {
        if (sharesTokenAddress.balanceOf(msg.sender) == 0) throw;
             _;
    }
    
    
    struct Proposal {
        address recipient;
        uint amount;
        string description;
        string title;
        uint tokens;
        string reference;
        uint votingDeadline;
        uint executed;
        bytes32 proposalHash;
        Vote[] votes;
        mapping (address => bool) voted;
        string proposalStats;
    }

    struct Vote {
        bool inSupport;
        address voter;
    }
    
    
    
     /* First time setup */
    function ld(uint minimumSharesToPassAVote, uint minutesForDebate,  token sharesAddress, member memberAddressToSet, ledger ledgerAddressToSet) {
        changeVotingRules(minimumSharesToPassAVote, minutesForDebate);
        sharesTokenAddress = sharesAddress;
        memberAddress = memberAddressToSet;
        ledgerAddress = ledgerAddressToSet;
        ChangedTokenAddress(sharesAddress);
    }
    

    function updateVoteWeight(address member, uint numTokens) returns (bool success){

          if ( ledgerAddress == msg.sender || owner == msg.sender) {
                voteWeight[member] += numTokens;
                VoteWeightUpdated(member, numTokens, voteWeight[member]);
                return true;
           }
        return false;
    }


 


    /*change rules*/
    function changeVotingRules( uint minimumSharesToPassAVote, uint minutesForDebate) onlyOwner {
        
        if (minimumSharesToPassAVote == 0 ) minimumSharesToPassAVote = 1;
        
        minimumQuorum = minimumSharesToPassAVote;
        debatingPeriodInMinutes = minutesForDebate;
        
        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes);
    }
    
    function changeTokenAddress (token sharesAddress ) onlyOwner returns (bool){
        sharesTokenAddress = sharesAddress;
        ChangedTokenAddress(sharesAddress);
        return true;
    }
    
    
    function changeLedgerAddress(ledger newLedgerAddress)onlyOwner returns (bool){
        ledgerAddress = newLedgerAddress;
        ChangedLedgerAddress(newLedgerAddress);
        return true;
    }

       function changeMemberAddress(member memberAddressToSet)onlyOwner returns (bool){
        memberAddress = memberAddressToSet;
        ChangedMemberAddress(memberAddressToSet);
        return true;
    }
    
    	function resetDelegation() onlyOwner returns (bool result) 
	{
		for (uint i=0; i< memberAddress.numMembers(); i++) {		  
          memberAddress.clearDelegation();
         }		
		delete delegatedVotes;
		DelegationReset(true);
		return true;
	}


function delegate(address nominatedAddress) returns (uint voteIndex) {
		  
		uint id;
               
        uint weight = 0;
		id = memberAddress.memberId(msg.sender);
		var (,canVoteSender,,,,,delegateSender,,) = memberAddress.members(id);
		//don't allow members delegation to themselves
		if (nominatedAddress != msg.sender){
			//test if member is not banned
			if (canVoteSender){
       			//check if member hasn't delegted their vote yet
				if (!delegateSender){
				    
				    weight = voteWeight[msg.sender] ;
                    voteWeight[msg.sender] -= weight;									
				    voteWeight[nominatedAddress] += weight;
				    if (! memberAddress.updateDelegatedStatus(msg.sender, true)) throw;
                    //mark delegating member as not delgated in case he/she delegated their votes before himself
				    
				    if (!memberAddress.updateDelegatedStatus(nominatedAddress, false)) throw;
				    				    
				    //check if this first delegation and handle resizing of array appropriatly	
				    if (delegatedVotes.length == 1 && delegatedVotes[0].nominee == 0  ){			
					    delegatedVotes[delegatedVotes.length -1] = DelegatedVote({nominee: nominatedAddress, voter: msg.sender, weight:weight});
				    }
				    else {
					    delegatedVotes.length ++;
					    delegatedVotes[delegatedVotes.length -1] = DelegatedVote({nominee: nominatedAddress, voter: msg.sender, weight:weight});
				    }
				    voteIndex = delegatedVotes.length -1;
                    Delegated( nominatedAddress, msg.sender , voteIndex);
                   // DelegatedVote v = delegatedVotes[delegatedVotes.length -1];
				   
			    }   
			}
		}
		
    }



    function removeDelegation() {
        
        uint id;
        uint weight = 0;
        
        id = memberAddress.memberId(msg.sender);
        var (,canVoteSender,,,,,delegateSender,,) = memberAddress.members(id);
        address nominee;


        for (uint i = 0; i < delegatedVotes.length; i++){

            if (delegatedVotes[i].voter== msg.sender){
                
                DelegatedVote v = delegatedVotes[i];                  
                voteWeight[v.nominee] -= v.weight ;									
				voteWeight[v.voter] += v.weight ;
				
				if (!memberAddress.updateDelegatedStatus(msg.sender, false)) throw;
                nominee = v.nominee;

                delete delegatedVotes[i];
            }
        }
        CancelDelegation(nominee);
    }

    function completeDelegation() returns (bool result) {
        
        uint weight = 0;
        DelegatedVote v = delegatedVotes[0];	
		uint i;
		bool executed;
		executed = false;		
				
        if (!executed) {                     
                for (i=0; i< delegatedVotes.length; i++){
                    v = delegatedVotes[i];					
                    if (v.nominee != v.voter && voteWeight[v.voter] > 0) {
                        weight = voteWeight[v.voter] ;
                        voteWeight[v.voter] -= weight;									
                        voteWeight[v.nominee] += weight;	
			executed = true;						
                    }                                   
               }
         }
	DelegationExecuted(executed);
        return executed;
    }
    
    /* Function to create a new proposal */
    function newProposal(
        string proposalDescription,
        string proposalTitle,
        uint tokenAmount,
        string reference,
        bytes transactionBytecode
    )
        onlyShareholders()
        returns (uint proposalID)
    {   
          proposalID = proposals.length++;
          Proposal p = proposals[proposalID];
          p.description = proposalDescription;
          p.title = proposalTitle;
          p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
          p.executed = 0;
          p.reference = reference;
          p.tokens = tokenAmount;
          numProposals = proposalID+1;
       
       ProposalAdded(numProposals, proposalDescription, proposalTitle, msg.sender, now, tokenAmount, reference);
    }
    
    
    function vote(uint proposalNumber, bool supportsProposal)
        onlyShareholders()
        returns (uint voteID)
    {
        Proposal p = proposals[proposalNumber];
        if (p.voted[msg.sender] == true ||  p.executed > 0) throw;

        voteID = p.votes.length++;
        p.votes[voteID] = Vote({inSupport: supportsProposal, voter: msg.sender});
        p.voted[msg.sender] = true;
       // p.numberOfVotes = voteID +1;
        Voted(proposalNumber,  supportsProposal, msg.sender);
    }
    
    function numOfVotes(uint proposalNumber) constant returns (uint){
        
        Proposal p = proposals[proposalNumber];
        return p.votes.length;
        
    }
    
    function hasVoted(uint proposalNumber, address voter) constant returns (bool){
        
         Proposal p = proposals[proposalNumber];
         return  p.voted[voter] ;
        
    }
    
    function howVoted(uint proposalNumber, address voter) constant returns (bool){
        
        Proposal p = proposals[proposalNumber];
        
        for (uint i = 0; i <  p.votes.length; ++i) {
            Vote v = p.votes[i];
            
            if (v.voter == voter) return v.inSupport;
	        
        }

        
    }

    function hasDelegateVoted(uint proposalNumber, address voter) constant returns (bool){
        
        for (uint i = 0; i < delegatedVotes.length; i++){
            if (delegatedVotes[i].voter== voter){
              return  hasVoted(proposalNumber, delegatedVotes[i].nominee );
            }
        }
    }
    
    function howDelegateVoted(uint proposalNumber, address voter) constant returns (bool){
        for (uint i = 0; i < delegatedVotes.length; i++){
            if (delegatedVotes[i].voter== voter){
              return  howVoted(proposalNumber, delegatedVotes[i].nominee );
            }
        }
        
    }

    
    function calculateVotes(uint proposalNumber) constant returns (string){
        
       
       uint quorum = 0;
       uint votes = 0;
       uint yea = 0;
       uint nay = 0;
       uint totalMemberCount = memberAddress.numMembers();
       
       Proposal p = proposals[proposalNumber];

        for (uint i = 0; i <  p.votes.length; ++i) {
            Vote v = p.votes[i];
	        uint voteWeightTmp = voteWeight[v.voter];
			
            votes += voteWeightTmp ;
            if (v.inSupport) {
                yea += voteWeightTmp ;
            } else {
                nay += voteWeightTmp ;
            }
        }

        quorum = votes * 100/ ledgerAddress.tokensInCirculation();
       
          string memory tempString = createVoteStatsString(yea, nay, quorum, votes);
       
       
            p.proposalStats = tempString; 
            
           
        return tempString;
    }
    

    function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (uint256 result) {
        Proposal p = proposals[proposalNumber];
        /* Check if the proposal can be executed */
        
        
        if (now < p.votingDeadline  /* has the voting deadline arrived? */
           ||  p.executed   > 0   )  /* has it been already executed? */
     //       ||  p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)) /* Does the transaction code match the proposal? */
              throw; 
            

        /* tally the votes */
       uint quorum = 0;
       uint votes = 0;
       uint yea = 0;
       uint nay = 0;
       uint totalMemberCount = memberAddress.numMembers();
       

        for (uint i = 0; i <  p.votes.length; ++i) {
            Vote v = p.votes[i];
	        uint voteWeightTmp = voteWeight[v.voter];
			
            votes += voteWeightTmp ;
            if (v.inSupport) {
                yea += voteWeightTmp ;
            } else {
                nay += voteWeightTmp ;
            }
        }
        
        quorum = votes * 100/ ledgerAddress.tokensInCirculation();
       

      
                    
          if (yea > nay ) {
            /* has quorum and was approved */
            p.executed = 1;  
            if (quorum >= minimumQuorum && p.tokens > 0) {
                 if (!  ledgerAddress.allocateTokens(p.tokens, proposalNumber)) {
                     throw;
                 }
            }
           
            }
         else {
            p.executed = 2;
            }
     //   }

           
      p.proposalStats = createVoteStatsString(yea, nay, quorum, votes); 
        
    // Fire Events
    ProposalTallied(proposalNumber, yea, nay, quorum, p.executed);
    result = p.executed;
    }
    

    function createVoteStatsString(uint yea, uint nay, uint quorum, uint votes) constant returns (string){
           
           string memory tempString = strConcat( "{'yea':", uintToString(yea), ", 'nay':", uintToString(nay));
            tempString = strConcat( tempString, ", 'quorum':", uintToString(quorum), ", 'votes':");
            tempString = strConcat( tempString, uintToString(votes), "}", "");
            
            return tempString; 
        
    }



function strConcat(string _a, string _b, string _c, string _d, string _e)  constant returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
   
}

function strConcat(string _a, string _b, string _c, string _d)  constant returns (string) {
    return strConcat(_a, _b, _c, _d, "");
}



function uintToString(uint a)  constant returns (string){
    
    bytes32 st = uintToBytes(a);
    return bytes32ToString(st);
}

function uintToBytes(uint v)  constant returns (bytes32 ret) {
        if (v == 0) {
            ret = '0';
        }
        else {
            while (v > 0) {     
                ret = bytes32(uint(ret) / (2 ** 8));
                ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
                v /= 10;
            }
        }
        return ret;
    }
    
    
    function bytes32ToString(bytes32 x) internal constant returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
}

}   