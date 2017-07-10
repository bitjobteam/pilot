"use strict";

var proposalHash, totalVotes, proposal, totalPro, totalAgainst, proposalID, beneficiary, etherAmount, jobDescription, userAccount, supportsProposal, proposalNumber, yea, nay, quorum, proposalPassed, canVote, firstName, lastName, userID, minimumSharesToPassAVote, minutesForDebate, nominatedAddress, sender, voteIndex, status, minimumMembers, numOfTokens, actionButton, proposalTitle, proposalDescription, buyer, creator, dateProposlaEntered, tokenAmountForProject, amountSpent, refernce;


var addr;



var startingBlock = 1800000;
var Web3;
var web3;
var logedIn = false;
var message;
var gasAmount;
var gasPrice;
var currAccount;
var supportEmail;
var token;
var eventsMinDistance = 50;
var timelines;
var memberContrat;
var memberHandle;
var ledgerHandle;
var ldHandle;
var singleTokenCost = 1000000000000000;
var valueIinFIAT;
var exchangeFIAT;
var totalTokens;
var tokenBalance;
var votingPower;
var ownedPercentage;
var accountBalance;



function init() {

    var proposal,
        mode,
        newProposalInput,
        newRegistration,
        newProposalButton,
        loginButton,
        newRegistrationButton,
        rulesChangeButton,
        investButton;


    currAccount = getCookie("account");


    $("#title-brand").text(organizationName);
    $("#page-title").text(organizationName);
    $("#logo-title-link").html('<a href="http://' + domainLink + '" class="simple-text"> <img style="width:160px" src="../dist/img/bitJobwhitelogo.png"  alt="BitJob">  </a>');
    $("#logo-mini-link").html('<a href="http://' + domainLink + '" class="simple-text">' + organizationName + ' </a>');
    $("#copyright").html("<a href='" + domainLink + "'>" + organizationName + "<Ledger></Ledger></a>")





    // mode = decodeURI(getParameterByName('mode'));
    //document.getElementById('proposal').textContent = proposal;

    if (getCookie("emailAddress") != "") {
        //$("#menu-signup").html( "<span class='glyphicon glyphicon-user'></span> " + getCookie("firstName") + " " + getCookie("lastName") );
        $("#user-drop-down").prepend(getCookie("firstName") + " " + getCookie("lastName"));

        $("#menu-signup").hide();
        $("#menu-login").hide();
        $("#menu-signup").css("background-color", "lightgreen");
    }

    /*
    if (addr.length === 42 && addr.includes("0x", 0)) {
		logedIn = true;
		enableMenuAll();
	} */






    // Checks Web3 support
    if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        //var Method = require('./web3/methods/personal');
        web3 = new Web3(new Web3.providers.HttpProvider(connectionString));

        if (!web3.isConnected()) {

            $("#alert-danger-span").text(" Problem with connection to the newtwork. Please contact " + supportEmail + " abut it. ");
            $("#alert-danger").show();
            return;
        }
    } else if (typeof web3 == 'undefined' && typeof Web3 == 'undefined') {

        Web3 = require('web3');
        web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider(onnectionString));
    }









    memberContrat = web3.eth.contract(ldABI);
    memberHandle = memberContrat.at(ldAddress);


    var ledgerContract = web3.eth.contract(ldABI);
    ledgerHandle = ledgerContract.at(ldAddress);

    var ldContradct = web3.eth.contract(ldABI);
    ldHandle = ldContradct.at(ldAddress);

    gasPrice = web3.eth.gasPrice;
    gasAmount = 4000000;

    var etherTokenContract = web3.eth.contract(toeknContractABI);
    token = etherTokenContract.at(tokenContractAddress);



    viewAbout();
    checkBalance();
    enableMenu();



    // renderFrontPage();
    // watchevents();


    //       $("#includedContent").load("investment.html"); 


    //printTransaction("0xf28b5331e2171f50dfb25d18a5cb0de7cfc5f67f8c8f5943de7eb2ecb468e25d");

}


function printTransaction(txHash) {
    var tx = web3.eth.getTransaction(txHash);
    if (tx != null) {
        console.log("  tx hash          : " + tx.hash + "\n"
            + "   nonce           : " + tx.nonce + "\n"
            + "   blockHash       : " + tx.blockHash + "\n"
            + "   blockNumber     : " + tx.blockNumber + "\n"
            + "   transactionIndex: " + tx.transactionIndex + "\n"
            + "   from            : " + tx.from + "\n"
            + "   to              : " + tx.to + "\n"
            + "   value           : " + tx.value + "\n"
            + "   gasPrice        : " + tx.gasPrice + "\n"
            + "   gas             : " + tx.gas + "\n"
            + "   input           : " + tx.input);
    }
}

function renderPage() {


    if (window.location.href.indexOf("wallet.html") > 0) renderWallet();
    else if (window.location.href.indexOf("adminStats.html") > 0) renderAdmin();
    else if (window.location.href.indexOf("adminMembers.html") > 0) renderMembers();
    else if (window.location.href.indexOf("myProfile.html") > 0) renderProfile();
    else if (window.location.href.indexOf("proposals.html") > 0) renderProposals();
    else if (window.location.href.indexOf("adminProposals.html") > 0) renderAdminProposals();
    else if (window.location.href.indexOf("projectsVoting.html") > 0) renderProjects("voting");
    else if (window.location.href.indexOf("projectsFunded.htm") > 0) renderProjects("funded");
    else if (window.location.href.indexOf("delegations.htm") > 0) renderMembers("delegate");
    else if (window.location.href.indexOf("index.html?ref=true") > 0) $("#modal-register").modal();
    else if (window.location.href.indexOf("mining.html") > 0) listReferrals();
    else if (window.location.href.indexOf("funding.html") > 0) renderFunding();





}



function renderFunding() {

    getInvestmentProjects(getCookie("account"));

}

function renderAdminProposals() {

    getInvestmentProjects();

}


function renderProfile() {



    var profileTable = "<tr><td>Ethereum address</td>" +
        "<td style='text-align:right'>" + getCookie("account") + "</td></tr>" +
        "<tr><td>First Name</td>" +
        "<td style='text-align:right'>" + getCookie("firstName") + "</td></tr>" +
        "<tr><td>Last Name</td>" +
        "<td style='text-align:right'>" + getCookie("lastName") + "</td></tr>" +
        "<tr><td>Email Address</td>" +
        "<td style='text-align:right'>" + getCookie("emailAddress") + "</td></tr>" +
        "<tr><td>Can Vote</td>" +
        "<td style='text-align:right'>" + getCookie("canvote") + "</td></tr>" +
        "<tr><td>Delegated Votes</td>" +
        "<td style='text-align:right'>" + getCookie("delegated") + "</td></tr>"


    $("#profile-table").append(profileTable);


}

function renderAdmin() {


    totalTokens = ledgerHandle.tokensInCirculation();
    var totalProposals = ldHandle.numProposals();
    var totalAllocatedTokens = ledgerHandle.totalLockedToken();
    var tokenPrice = ledgerHandle.singleTokenCost();
    var tokenPriceETH = tokenPrice / 1000000000000000000;
    var totalEth = Math.round(ledgerHandle.tokensInCirculation() / 1000);
    var totalEthAllocated = Math.round(totalAllocatedTokens / 1000);
    var totalMembers = memberHandle.numMembers();
    var memberWithTokens = 5; //to be implemented
    var blockedMembers = 1; // to be implemented
    var newMembers = 1; // to be implemented
    var totalProjects = 10; //to be implemented
    var projectAwaitingFunding = 3; // to be implemented
    var projectFundedNotCompleted = 4; // to be completed
    var projectsCompleted = 3; // to be completed

    var ideaProposals = 4; //to be implementd
    var projectProposals = 6; // to be implemnted
    var executedProposals = 4; // to be implemented


    var minimumQuorum = ldHandle.minimumQuorum({ from: adminAccount });
    var debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes({ from: adminAccount });
    var profits = ledgerHandle.calculateTotalRewards();



    var tokenTable = "<tr><td>Tokens in circulation</td>" +
        "<td style='text-align:right'>" + formatNumber(totalTokens) + "</td></tr>" +
        "<tr><td>Tokens allocated</td>" +
        "<td style='text-align:right'>" + formatNumber(totalAllocatedTokens) + "</td></tr>" +
        "<tr><td>Total value of Ether</td>" +
        "<td style='text-align:right'>" + totalEth.formatMoney(2, '.', ',') + "</td></tr>" +
        "<tr><td>Ether allocated</td>" +
        "<td style='text-align:right'>" + totalEthAllocated.formatMoney(2, '.', ',') + "</td></tr>" +
        "<tr><td>Profits to date</td>" +
        "<td style='text-align:right'>" + formatNumber(profits[0]) + "</td></tr>" +
        "<tr><td>Profits pending</td>" +
        "<td style='text-align:right'>" + formatNumber(profits[1]) + "</td></tr>";

    var memberTable = "<tr><td>Total members</td>" +
        "<td style='text-align:right'>" + totalMembers + "</td></tr>" +
        "<tr><td>Members with tokens</td>" +
        "<td style='text-align:right'>" + memberWithTokens + "</td></tr>" +
        "<tr><td>Blocked members</td>" +
        "<td style='text-align:right'>" + blockedMembers + "</td></tr>" +
        "<tr><td>New Members</td>" +
        "<td style='text-align:right'>" + newMembers + "</td></tr>"


    var proposalTable = "<tr><td>Total proposals</td>" +
        "<td style='text-align:right'>" + totalProposals + "</td></tr>" +
        "<tr><td>Idea proposals</td>" +
        "<td style='text-align:right'>" + ideaProposals + "</td></tr>" +
        "<tr><td>Project proposals</td>" +
        "<td style='text-align:right'>" + projectProposals + "</td></tr>" +
        "<tr><td>Executed proposals</td>" +
        "<td style='text-align:right'>" + executedProposals + "</td></tr>"

    var projectTable = "<tr><td>Total Projects</td>" +
        "<td style='text-align:right'>" + totalProjects + "</td></tr>" +
        "<tr><td>Projects awaiting funding</td>" +
        "<td style='text-align:right'>" + projectAwaitingFunding + "</td></tr>" +
        "<tr><td>Funded not completed</td>" +
        "<td style='text-align:right'>" + projectFundedNotCompleted + "</td></tr>" +
        "<tr><td>Completed Projects</td>" +
        "<td style='text-align:right'>" + projectsCompleted + "</td></tr>"


    var votingRulesTable = "<tr><td>Quorum</td>" +
        "<td style='text-align:right'>" + minimumQuorum + "</td></tr>" +
        "<tr><td>Debating periods (min)</td>" +
        "<td style='text-align:right'>" + debatingPeriodInMinutes + "</td></tr>"


    $("#token-table").append(tokenTable);
    $("#member-table").append(memberTable);
    $("#proposal-table").append(proposalTable);
    $("#project-table").append(projectTable);
    $("#voting-rules-table").append(votingRulesTable);

}

function renderProposals() {

    listProposals();

}

function renderMembers(flag) {

    if (getCookie("delegated") == 1) {
        $("#delegation-note").text("Click this button to withdraw delgation of your vote from the member which you delegated it to before.");
    } else {
        $("#withdraw-delegation").attr('disabled', 'disabled');
        $("#delegation-note").text("You are currently not delegating your votes.");
    }
    listMembers(flag);

}

function listReferrals() {



    var numOfReferrals = 0;
    var totalTokenEarned = 0;
    var totalTokenClaimed = 0;
    var totalTokenUnclaimed = 0;

    setTimeout(function () {
        var numMembers = memberHandle.numMembers();

        var htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
            "<tr>" +
            "<th>User Name</th>" +
            "<th>Date Joined</th>" +
            "<th>Ethereum address</th>" +
            "<th>User ID</th>" +
            "<th>Tokens Amt</th>" +
            "<th>Ether Value</th>" +
            "</tr>"

        for (var i = numMembers - 1; i >= 0; i -= 1) {
            var member = memberHandle.members(i);
            if (member[9] == getCookie("account") && member[0] != getCookie("account")) {

                numOfReferrals++;

                // voteStrength = ldHandle.voteWeight(member[0])
                var tokenBalance = token.balanceOf(member[0]);
                var firstLastName = member[3] + "+" + member[4]
                var tokenPrice = ledgerHandle.singleTokenCost();

                var tokenPriceETH = tokenPrice / 1000000000000000000;
                var totalEthValue = tokenPriceETH * tokenBalance;


                htmlString += "<tr>" +
                    "<td style='text-align:left'>" + member[3] + " " + member[4] + " </td>" +
                    "<td style='text-align:left'>" + convertTimestamp(member[2]) + "</td>" +
                    "<td>" + member[0] + "</td>" +
                    "<td>" + member[5] + "</td>" +
                    "<td style='text-align:center'>" + formatNumber(tokenBalance) + "</td>" +
                    "<td style='text-align:center'>" + formatNumber(totalEthValue) + "</td>" +
                    "</tr>"



            }


        }
        htmlString += "</table></div>";
        $("#list-text").text("Members list");
        $("#referral-list").html(htmlString);

        var htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
            "<tr>" +
            "<th>Ethereum address</th>" +
            "<th>Referral type</th>" +
            "<th style='text-align:right'>Tokens earned</th>" +
            "<th style='text-align:right'>Tokens paid</th>" +
            "</tr>"

        for (var i = 0; i < numOfReferrals; i++) {
            var references = memberHandle.returnReferrals(getCookie("account"), i);
            var referenceAllocatedTokens = ledgerHandle.returnAllocatedTokensForMember(references[0])

            totalTokenEarned += Number(referenceAllocatedTokens);
            totalTokenClaimed += Number(references[3]);

            totalTokenUnclaimed += referenceAllocatedTokens - references[3];




            htmlString += "<tr>" +
                "<td style='text-align:left'>" + references[0] + " </td>" +
                "<td style='text-align:center'>" + references[1] + "</td>" +
                "<td style='text-align:right'>" + formatNumber(referenceAllocatedTokens) + "</td>" +
                "<td style='text-align:right'>" + formatNumber(references[3]) + "</td>" +
                "</tr>"

        }


        htmlString += "</table></div>";

        $("#total-earned").text("Total earned:" + formatNumber(totalTokenEarned));
        $("#total-claimed").text("Total Claimed:" + formatNumber(totalTokenClaimed));
        $("#total-unclaimed").text("Total Unclaimed:" + formatNumber(totalTokenUnclaimed));


        $("#mining-rewards").html(htmlString);


    }, 3);


    if (totalTokenUnclaimed == 0) {


        swal({
            title: 'Good News',
            html: $('<div>')
                .addClass('some-class')
                .text('You have unclaimed tokens. Click button "Claim Mining Rewards" to get ' + '424,058' + ' tokens.'),
            animation: false,
            customClass: 'animated tada'
        })
    }

}


function changeTokenParms() {

    var minimumSharesToPassVote,
        minutesForDebate,
        minMembers, TokenPrice, startDate, endDate;



    if (!handlePassword("modal-change-token-parms", 0)) return;

    var newTokenPrice = document.getElementById("new-token-price").value;
    var newTokenSaleStartDate = document.getElementById("new-token-sale-start-date").value

    if (newTokenSaleStartDate != "")
        newTokenSaleStartDate = convertDateToTimeStamp(newTokenSaleStartDate);

    var newTokenSaleEndtDate = document.getElementById("new-token-sale-end-date").value;
    if (newTokenSaleEndtDate != "")
        newTokenSaleEndtDate = convertDateToTimeStamp(newTokenSaleEndtDate);

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.changeTokenParms(newTokenSaleStartDate, newTokenSaleEndtDate, newTokenPrice, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logTokensParmChange = ldHandle.TokenParmsChange({ start: startDate }, { end: endDate }, { tokenPrice: TokenPrice });

        logTokensParmChange.watch(function (error, res) {
            var message = "New parms successfully applied to tokens.";
            progressActionsAfter(message, true);
        });
    }, 10);

}


function listMembers(action) {

    var htmlString,
        delegated,
        i,
        member,
        memberNumberToDisplay,
        voteStrength,
        htmlString;

    setTimeout(function () {


        var numMembers = memberHandle.numMembers();


        if (numMembers > 0) {
            htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
                "<tr>" +
                "<th>User Name</th>" +
                "<th>Date Joined</th>" +
                "<th>Can Vote</th>" +
                "<th>User ID</th>" +
                "<th style='text-align:center'>Voting Power</th>" +
                "<th>Delegate Status</th>" +
                "<th style='text-align:center'>Delegate</th>" +
                "<th>Ban/Unban</th>" +
                "<th>Make admin</th>" +
                "<th>Add tokens</th>" +
                "</tr>";
            delegated = getCookie("delegated");

            for (i = numMembers - 1; i >= 0; i -= 1) {
                member = memberHandle.members(i, { from: adminAccount });
                voteStrength = ldHandle.voteWeight(member[0], { from: adminAccount })
                memberNumberToDisplay = i + 1;
                var firstLastName = member[3] + "+" + member[4]

                htmlString += "<tr>" +
                    "<td style='text-align:left'>" + member[3] + " " + member[4] + " </td>" +
                    "<td style='text-align:right'>" + convertTimestamp(member[2]) + "</td>" +
                    "<td>" + member[1] + "</td>" +
                    "<td>" + member[5] + "</td>";


                if (member[6]) {
                    htmlString += "<td align='center'> <font color='red'><B>" + voteStrength + "</B></font></td>";
                    htmlString += "<td align='center'> <font color='red'><B>" + member[6] + "</B></font></td>";

                }
                else {
                    htmlString += "<td align='center'>" + voteStrength + "</td>";
                    htmlString += "<td align='center'>" + member[6] + "</td>";
                }

                if (delegated == 1 || member[0] == currAccount || delegated == "1") {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';
                } else {
                    htmlString += "<td align='center'> <a class='linkDelegateClass' data-toggle='modal' id='urldelegate" + i + "' href='index.html?mode=d&pn=" + i + "&ui=" + member[5] + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Delegate your vote'>"
                        + "<img  style='max-width:42px;' src='../dist/img/delegate.png' alt='Delegate Vote' title='Delegate Vote' align='top'></td>";

                }
                //display icons for blocking and unblocking members
                //show not allowed for non admin
                if (getCookie("admin") == 0 || member[0] == currAccount) {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';

                } else {

                    if (member[1]) {
                        htmlString += "<td align='center'> <a class='linkbanClass' data-toggle='modal' id='urlban" + i + "' href='index.html?mode=0&pn=" + i + "&mi=" + member[0] + "&action=0&flname=" + firstLastName + "#myModal' title='Block member'>"
                            + "<img style='max-width:42px;' src='../dist/img/allow.png' alt='Block member' title='Block member' align='top' ></td>";
                    }
                    else {
                        htmlString += "<td align='center'> <a class='linkbanClass' data-toggle='modal' id='urlban" + i + "' href='index.html?mode=1&pn=" + i + "&mi=" + member[0] + "&action=1&flname=" + firstLastName + "#myModal' title='Unblock member'>"
                            + "<img  style='max-width:42px;' src='../dist/img/ban.png' alt='Unblock member' title='Unblock member' align='top' ></td>";

                    }
                }

                if (member[8] || getCookie("admin") == 0) {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';
                }
                else {

                    htmlString += "<td align='center'> <a class='linkAdminClass' data-toggle='modal' id='urladmin" + i + "' href='index.html?mode=admin&pn=" + i + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Transfer ownership'>"
                        + "<img style='max-width:42px;' src='../dist/img/admin.png' alt='Transfer ownership' title='Transfer ownership	' align='top'></td>";
                }

                htmlString += "<td align='center'> <a class='linkAdminTokens' data-toggle='modal' id='urladmin" + i + "' href='index.html?mode=admin&pn=" + i + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Add more tokens'>"
                    + "<img style='max-width:42px;' src='../dist/img/add.png' alt='Add more tokens' title='Add tokens' align='top'></td></tr>";



            }

            htmlString += "</table></div>";
            $("#list-text").text("Members list");
            $("#member-table").html(htmlString);

            if (action == "delegate") {

                $('#responstable tr > *:nth-child(2)').hide();
                $('#responstable tr > *:nth-child(3)').hide();
                $('#responstable tr > *:nth-child(4)').hide();
                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(8)').hide();
                $('#responstable tr > *:nth-child(9)').hide();
                $('#responstable tr > *:nth-child(10)').hide();
            } else if (action == "ban") {

                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(9)').hide();

            } else if (action == "transferadmin") {

                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(8)').hide();

            } else if (action == "front") {

                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(8)').hide();
                $('#responstable tr > *:nth-child(9)').hide();

            }

        }
    }, 3);

}

function listProposals() {


    var numProposals,
        numRegisteredMembers,
        i,
        closedMessage = "";

    setTimeout(function () {

        numProposals = ldHandle.numProposals();
        $("#list-body").html("<BR><i>*Click vote down or vote up icon to vote</i><BR><BR><BR>");

        if (numProposals > 0) {

            var htmlString = "<div class='table-responsive'><table id='proposals' class='table table-hover'  id='responstable' align='center'>" +
                "<tr>" +
                "<th>No.</th>" +
                "<th style='width:30%;'>Proposal title</th>" +
                "<th style='width:30%;'>Proposal Description</th>" +
                "<th ><span  class='glyphicon glyphicon-time'></th>" +
                "<th>Yes</th>" +
                "<th>No</th>" +
                "<th ><span  class='glyphicon glyphicon-info-sign'></th>" +
                "<th ><span  class='glyphicon glyphicon-pencil'></th>" +
                "<th ><span  class='glyphicon glyphicon-stats'></th>" +
                "<th ><span  class='glyphicon glyphicon-education'></th>" +
                "</tr>";

            for (i = numProposals - 1; i >= 0; i -= 1) {
                var result,
                    proposalNumberToDisplay;

                result = ldHandle.proposals(i);
                proposalNumberToDisplay = i + 1;

                htmlString += "<tr>" +
                    "<td>" + proposalNumberToDisplay + " </td>" +
                    "<td style='word-wrap: break-word; white-space:normal;' align='left;' width='30%'>" + result[3] + " </td>" +
                    "<td style='word-wrap: break-word; white-space:normal;' align='left;' width='30%'>" + result[2] + " </td>" +
                    "<td><div  style='float:left; font-size: 10px; color:red;' id='timemessage" + i + "'>&nbsp;</div></td>" +
                    "<td><a data-toggle='modal' id='urlvup" + i + "'   href='index.html?mode=v&pn=" + i + "&up=true#myModal' title='Vote Up' class='linkVoteClass'> <img align = 'top' id='voteup" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></a></td>" +
                    "<td><a data-toggle='modal' id='urlvdown" + i + "' href='index.html?mode=v&pn=" + i + "&up=false#myModal' title='Vote Down' class='linkVoteClass'><img id='votedown" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></a> </td>" +
                    "<td><a data-toggle='modal' id='p-info" + i + "'   href='index.html?mode=r&pn=" + i + "#myModal' title='View proposal info' class='linkProposalViewClass'><img src='../dist/img/view.png' height='38' width='38' alt='View' ></a></td>" +
                    "<td><a data-toggle='modal' id='urlsum" + i + "'   href='index.html?mode=s&pn=" + i + "#myModal' title='Sum results' class='linkTallyClass'><img id='sum" + i + "' src='../dist/img/gavel.png' height='38' width='38' alt='Sum results'></a></td>" +
                    "<td id='updown" + i + "'></td>" +
                    "<td id='yesno" + i + "'></td>" +
                    "</tr>"




            }


            htmlString += "</table></div>"

            $("#proposal-table").append(htmlString);


            for (i = numProposals - 1; i >= 0; i -= 1) {

                var result,
                    proposalNumberToDisplay;

                result = ldHandle.proposals(i);
                proposalNumberToDisplay = i + 1;



                // check if voting deadline has passed
                var deadline = result[5];
                var nowInseconds = Date.now() / 1000;

                if (nowInseconds >= deadline) {

                    document.getElementById("sum" + i).style.opacity = "1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "index.html?mode=s&pn=" + i;
                    document.getElementById("voteup" + i).style.opacity = "0.1";
                    document.getElementById("votedown" + i).style.opacity = "0.1";
                    document.getElementById("urlvup" + i).style.pointerEvents = "none";
                    document.getElementById("urlvdown" + i).style.pointerEvents = "none";
                    document.getElementById("timemessage" + i).innerHTML = "CLOSED <BR>for voting"
                } else {
                    var start1 = document.getElementById("timemessage" + i);
                    var tempMessageID = "timemessage" + i;
                    var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
                    countdown(tempMessageID, timeLeft, deadline);
                }


                // check if proposl can be still voted on
                // make sure that tally button is disabled

                if (deadline - nowInseconds > 0) {

                    document.getElementById("sum" + i).style.opacity = "0.1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "none";
                }

                // check if proposal has been executed
                if (result[6] > 0) {
                    document.getElementById("sum" + i).style.opacity = "0.1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "none";
                    //check if proposal passed
                    if (result[6] == 1) {
                        document.getElementById("updown" + i).innerHTML += "<img src='../dist/img/arrowup.png' title='Proposal passed' height='40' width='43'>";
                        //check how many votes it received
                    } else {
                        document.getElementById("updown" + i).innerHTML += "<img src='../dist/img/arrowdown.png' title='Proposal didn't pass' height='40' width='43'>";
                    }


                    var results = result[9];

                    results = results.replace(/'/g, "\"");
                    var myObj = JSON.parse(results);
                    var votes = myObj.votes;

                    document.getElementById("yesno" + i).innerHTML = votes;
                    document.getElementById("voteup" + i).style.opacity = "0.1";
                    document.getElementById("votedown" + i).style.opacity = "0.1";
                    document.getElementById("urlvup" + i).style.pointerEvents = "none";
                    document.getElementById("urlvdown" + i).style.pointerEvents = "none";
                }
            }
        } else {
            htmlString = "<BR>   No proposals yet <BR>";

            $("#proposal-table").append(htmlString);
        }
    }, 3);
}


function showTimeNotification(from, align, text) {

    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
        icon: "notifications",
        message: text

    }, {
            type: type[color],
            timer: 30000,
            z_index: 10031,
            placement: {
                from: from,
                align: align
            }
        });
}

function enableMenu() {

    if (currAccount != "") {

        $("#buy-tokens").show();

        $("#sign-out").show();

        if (getCookie("admin") == "1") {
            $("#menu-admin").show();

        }

        if (getCookie("delegated") == "1") {
            $("#cancel-delegation-menu").show();
            $("#delegate-votes-menu").hide();
        }
    }
    else { $("#sidebar-menu").hide(); }
}

function getParameterByName(name, url) {

    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getCookie(cname) {

    var name = cname + "=", ca = document.cookie.split(';'), i, c;

    for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkBalance() {



    //   $.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
    //      function (data, status) {
    //        if (status == "success") {
    //  var myObj = JSON.parse(data);
    // var length = Object(myObj).length;

    //     exchangeFIAT = data.USD;

    exchangeFIAT = 9.88;

    if (currAccount != "") {
        accountBalance = web3.fromWei(web3.eth.getBalance(currAccount), "ether");
        tokenBalance = token.balanceOf(currAccount);
        votingPower = ldHandle.voteWeight(currAccount);
        totalTokens = ledgerHandle.tokensInCirculation();
        valueIinFIAT = exchangeFIAT * accountBalance;
        if (totalTokens == 0) ownedPercentage = 0
        else
            ownedPercentage = tokenBalance * 100 / totalTokens;

        $("#user-name").prepend(getCookie("firstName") + " " + getCookie("lastName"));


        if (accountBalance == 0) {
            $("#noticeModal").modal();
            $("#sidebar-menu").hide();
            $("#your-balance").hide();
        } else {
            $("#balance-ether").hide();
            //   $("#alert-success-span").html("You have " + formatNumber(accountBalance)+ "    Eth in your account.<BR>");
            $("#menu-balance-ether").append((accountBalance * 1).formatMoney(2, '.', ',') + " Eth/" + (valueIinFIAT * 1).formatMoney(2, '.', ',') + " USD");
            $("#menu-balance-ether").show();
            $("#your-balance").show();
        }

        if (tokenBalance == 0) {

            //  showTimeNotification('top','left', "You have 0 balance of tokens. You will be able only to view activity on this site but not participate. Please purchase some tokens <a id='buy-tokens-message'  href='#' >here.</a>")
            //  $("#alert-warning-span").append("You have 0 balance of tokens. You will be able only to view activity on this site but not participate. Please purchase some tokens <a id='buy-tokens-message'  href='#' >here.</a>");

            $("#noticeModal").modal();
            $("#alert-warning").show();
            $("#sidebar-menu").hide();
        } else {
            //  $("#alert-success-span").append("You have " + tokenBalance + " tokens in your account</span>");
            $("#menu-voting-power").append("<span title='Your voting power'>" + formatNumber(votingPower));
            //document.getElementById("menu-voting-power").innerText = votingPower;
            $("#menu-voting-power").show();
            //  $("#alert-success").show();
            $("#menu-balance-tokens").append("<span title='Amount of tokens you own and your percentage. '>" + formatNumber(tokenBalance) + "/" + Math.round(ownedPercentage * 100) / 100 + "%</span>");
            $("#menu-balance-tokens").show();
            $("#your-balance").show();

        }


    }
    else $("#sidebar-menu").hide();
    renderPage();

    //          }
    //      });

}

function fundAccount() {


    var message = confirm("Are you sure you want to add some Ether for free to your account?")
    if (message) {

        $("#alert-success-span").text("Sending money to you. Should be there shortly... :) Refresh page in a few minutes. ");
        $("#alert-success").show();


        web3.eth.sendTransaction({
            from: adminAccount,
            to: currAccount,
            value: web3.toWei(10000, "ether")
        });

    }


}


function createNewMember() {

    var target,
        targetElement,
        password,
        firstName,
        lastName,
        userID,
        memberHash,
        emailAddress,
        memberPosition;

    emailAddress = document.getElementById("email-address").value;



    memberPosition = memberHandle.getMemberByUserID(emailAddress);

    // if (memberPosition.c[0] >= 0 && memberPosition.s == 1) {

    if (memberPosition >= 0) {



        $("#message-status-title").text("");
        message = "This email has been already taken."
        progressActionsAfter(message, false);
        $("#progress").modal();



    }
    else {

        firstName = document.getElementById("first-name").value;
        lastName = document.getElementById("last-name").value;
        password = document.getElementById("inputPassword").value;

        document.cookie = "firstName=" + firstName;
        document.cookie = "lastName=" + lastName;
        document.cookie = "emailAddress=" + emailAddress;
        document.cookie = "delegated=" + "0";
        document.cookie = "admin=" + "0";

        $("#modal-register").modal("hide");
        progressActionsBefore();

        // Case of creating admin account
        if (emailAddress == "admin@admin.com") {
            var account = adminAccount;
            document.cookie = "account=" + account;

            setTimeout(function () {
                memberHash = web3.sha3(emailAddress + password);
                var referral = currAccount;

                try {
                    memberHandle.newMember(account, true, firstName, lastName, emailAddress, memberHash, defulatTokenAmount, referral, { from: adminAccount, gasprice: gasPrice, gas: gasAmount });
                }
                catch (err) {
                    displayExecutionError(err);
                    return;
                }

                watchNewMembership();
            }, 3);
        }

        //we need to generate new key for new member. 
        else {



            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var account = "0x" + this.responseText;
                    $("#message-status-body").text("Your Ethereum address is: " + account);
                    document.cookie = "account=" + account;

                    web3.eth.sendTransaction({
                        from: adminAccount,
                        to: account,
                        value: web3.toWei(1, "ether")
                    });

                    setTimeout(function () {
                        memberHash = web3.sha3(emailAddress + password);
                        var referral = getCookie("ref");

                        if (referral == "undefined") referral = adminAccount;

                        try {
                            memberHandle.newMember(account, true, firstName, lastName, emailAddress, memberHash, defulatTokenAmount, referral, { from: adminAccount, gasprice: gasPrice, gas: gasAmount });
                        }
                        catch (err) {
                            displayExecutionError(err);
                            return;
                        }

                        watchNewMembership();
                    }, 3);
                }
            };
            var parms = "password=" + password;
            xhttp.open("POST", nodejsUrl, true);
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.send(parms);
        }
    }
}

function watchNewMembership() {


    var logAccount, message, refAddress;



    // logAccount is an event on the contract. Read all since block 1 million
    logAccount = memberHandle.MembershipChanged({ member: userAccount }, { canVote: canVote }, { firstName: firstName }, { lastName: lastName }, { userID: userID }, { referralAddress: refAddress });

    // Wait for the events to be loaded
    logAccount.watch(function (error, res) {

        if (res.args.userID == getCookie("emailAddress")) {

            message = '<B><BR>Account successfully created...' + '  <BR><B>First Name:</B>' + res.args.firstName + '<BR><B>Last Name:</B>' + res.args.lastName + '<BR><B>user ID:</B>'
                + res.args.userID + '<BR><B>Can vote:</B>' + res.args.isMember + '<BR><BR>Referral Addres:' + res.args.memberReferral + "<BR>" +
                "We have added " + defulatTokenAmount + " tokens to your account just for signing up. " +
                '<div class="footer text-center">' +
                '<a id="modal-action"  href=" ' + linkAfterSignup + '" class="btn btn-primary btn-round">Continue ..</a>' +
                '</div>';

            progressActionsAfter(message, true);
        } else {
            message = '<B><BR>Account note created due to duplicate user id or other network issues. Try again....';
            progressActionsAfter(message, false);
            clearCookies();
        }
    });

}


function userLogin() {




    var password,
        userID,
        memberPosition,
        member,
        firstName,
        lastName,
        memberHash,
        addr,
        delegated,
        userIDFromBlockChain,
        isAdmin;

    clearCookies();
    password = document.getElementById("inputPassword-login").value;
    userID = document.getElementById("email-address-login").value;
    memberPosition = memberHandle.getMemberByUserID(userID);

    if (memberPosition >= 0) {
        member = memberHandle.members(memberPosition);
        firstName = member[3];
        lastName = member[4];
        memberHash = member[7];
        addr = member[0];
        delegated = member[6] ? 1 : 0;
        userIDFromBlockChain = member[5];
        isAdmin = member[8] ? 1 : 0;
        canVote = member[1] ? 1 : 0;




        if (memberHash === web3.sha3(userID + password) && userID === userIDFromBlockChain) {
            document.cookie = "firstName=" + firstName;
            document.cookie = "lastName=" + lastName;
            document.cookie = "emailAddress=" + userID;
            document.cookie = "account=" + addr;
            document.cookie = "delegated=" + delegated;
            document.cookie = "admin=" + isAdmin;
            document.cookie = "canvote=" + canVote;
            // location.replace('index.html');
            $("#alert-success-span").text(" Welcome " + firstName + " " + lastName);
            $("#alert-success").show();
            //$("#dashboard").append(" for " + " (" + getCookie("emailAddress") + ")");
            location.replace('');
            // enableMenuAll();
        } else {
            showTimeNotification('top', 'right', "Problem with your credentials. Your password user combination might be wrong.")

        }


    } else {
        showTimeNotification('top', 'right', "Problem with your credentials. This members doesn't exist.")
        $("#alert-warning-span").text(" Problem with your credentials. This members doesn't exist.");
    }

    $("#modal-login").modal("hide");
}

function clearCookies() {
    document.cookie = "firstName=";
    document.cookie = "lastName=";
    document.cookie = "emailAddress=";
    document.cookie = "account=";
    document.cookie = "admin=";

}


function newProposal() {

    var description, title, etherAmount, beneficiary, proposalID;

    if (!handlePassword("modal-idea-proposal", 4)) return;

    var newProposaDescription = $("#new-proposal-description-idea").val();
    var newProposalTitle = $("#new-proposal-title-idea").val();

    try {
        ldHandle.newProposal("", 0, newProposaDescription, newProposalTitle, "", { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logProposals = ldHandle.ProposalAdded({ proposalId: proposalID }, { beneficiary: beneficiary }, { etherAmount: etherAmount }, { description: description }, { title: title });
        logProposals.watch(function (error, res) {

            var message;
            message = '<B>Proposal successfully added...<BR>Title:' + res.args.title + '<BR>Description:</B>' + res.args.description;
            progressActionsAfter(message, true);

        });
    }, 3);
}

function displayExecutionError(err) {


    showTimeNotification('top', 'right', err)
    setTimeout(function () {
        //   location.replace('index.html');
    }, 2000);


    //   $("#content-to-show").css("style='padding:40px 50px;'");
    //    $("#content-to-show").text(err);
    //    $("#content-header").html("<span class='fa fa-exclamation-triangle' style='color:orange;'>Warning </span> ")
    //   $("#show-content").modal()

}

function lockTokens() {

    if (!handlePassword("areYouSure", 1)) return;



    var tokenAmount = $("#token-amount-to-lock").val();
    var proposalID = $("#project-proposal-number").val();


    try {
        ledgerHandle.allocateTokens(tokenAmount, proposalID, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logEvent = ledgerHandle.TokensAllocated({ proposalID: proposalID, numOfTokens: numOfTokens });
        logEvent.watch(function (error, res) {



            var message = '<B><BR>	You allocated ' + res.args.numOfTokens + ' tokens to proposal id ' + res.args.proposalID;
            progressActionsAfter(message, true);


        });
    }, 3);


}

function buyTokens() {

    if (!handlePassword("buy-tokens-modal", 2)) return;



    var tokenAmount = $("#token-amount").val();

    singleTokenCost = ledgerHandle.singleTokenCost();



    var totalTokenCost = singleTokenCost * tokenAmount;
    var userBalance = web3.fromWei(web3.eth.getBalance(currAccount), "wei");

    var maxTokenToBuy = userBalance / singleTokenCost;


    if (totalTokenCost >= userBalance) {

        alert("You don't have enough funds in your account to buy this amount of tokens. You can buy max " + maxTokenToBuy + " of tokens.");
    } else {




        try {
            ledgerHandle.buyTokens(tokenAmount, { from: currAccount, gasprice: gasPrice, gas: gasAmount, value: totalTokenCost });
        }
        catch (err) {
            displayExecutionError(err);
            return;
        }

        progressActionsBefore();

        setTimeout(function () {

            var logEvent = ledgerHandle.BuyTokens({ numOfTokens: numOfTokens, buyer: buyer, value: amountSpent });
            logEvent.watch(function (error, res) {

                //  if (tokenAmount == res.args.numOfTokens ) {

                var message = '<B><BR>	You bought ' + res.args.numOfTokens + ' tokens and you have spent ' + res.args.value / 1000000000000000000 + " Eth";
                progressActionsAfter(message, true);
                //   }

            });
        }, 3);
    }

}



function addTokens() {

    var voteWeight, numOfTokens, member;

    if (!handlePassword("buy-tokens-modal", 2)) return;



    var tokenAmount = $("#token-amount").val();
    var member = $("#parm1").val();




    try {
        ledgerHandle.updateVoteWeight(member, tokenAmount, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logEvent = ledgerHandle.VoteWeightUpdated({ member: member, numOfTokens: numOfTokens, voteWeight: voteWeight });
        logEvent.watch(function (error, res) {

            //  if (tokenAmount == res.args.numOfTokens ) {

            var message = '<B><BR>	You have added ' + res.args.weightAdded + ' tokens for ' + res.args.member;
            progressActionsAfter(message, true);
            //   }

        });
    }, 3);


}


function voteProposal() {

    var proposalNumber,
        voteYes;

    if (!handlePassword("areYouSure", 1)) return;

    proposalNumber = document.getElementById("parm1").value;
    voteYes = document.getElementById("parm2").value === "true" ? true : false;


    //$("#areYouSure").modal("hide");
    progressActionsBefore();

    setTimeout(function () {

        ldHandle.vote(proposalNumber, voteYes, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logVote;
        logVote = ldHandle.Voted({ proposalNumber: proposalNumber }, { supportsProposal: supportsProposal }, { adminAccount: userAccount });

        logVote.watch(function (error, res) {
            var message = "Vote successfully executed...";
            progressActionsAfter(message, true);
        });
    }, 3);



}



function executeProposal() {




    if (!handlePassword("areYouSure", 1)) return;
    var proposalNumber = document.getElementById("parm1").value;

    var extendedValue = ldHandle.calculateVotes(proposalNumber, { from: adminAccount });

    var myObj = getExtendedProposalResults(extendedValue);

    if (Number(myObj.quorum) < Number(ldHandle.minimumQuorum())) {

        alert("The proposal can't be executed because there is no quorum.")
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.executeProposal(proposalNumber, 1, 1, "", { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logProposalExec = ldHandle.ProposalTallied({ proposalId: proposalID }, { yea: yea }, { nay: nay }, { quorum: quorum }, { proposalPassed: proposalPassed });

        logProposalExec.watch(function (error, res) {

            var message;

            if (!res.args.proposalExecuted == 2) {
                message = '<BR><B>Proposal didn\'t pass either due to insufficient quorum or too many voters against it.<B>';
                progressActionsAfter(message, true);
            } else {
                message = '<BR><B>Proposal successfully tallied and passed.<B>';

                progressActionsAfter(message, true);
            }
        });
    }, 3);
}



function resetDelegation() {

    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.resetDelegation({ from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logResetingDelegation = ldHandle.DelegationReset({ status: status });

        logResetingDelegation.watch(function (error, res) {
            message = "<B>Delegation has been reset.<BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "0";
        });
    }, 3);
}


function cancelDelegation() {


    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.removeDelegation(currAccount, 0, true, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logRemoveDelegation = ldHandle.CancelDelegation({ nominee: nominatedAddress });

        logRemoveDelegation.watch(function (error, res) {
            message = "<B>Delegation has been cancelled.<BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "0";
        });
    }, 10);
}









function blockUnblock() {


    if (!handlePassword("areYouSure", 1)) return;

    var banUnbanAddress = $("#parm1").val();
    var canVote = $("#parm2").val();
    canVote = canVote == 1 ? true : false;

    progressActionsBefore();

    setTimeout(function () {

        memberHandle.blockUnblockMember(banUnbanAddress, canVote, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
        var logBanUnban = memberHandle.BlockUnblockMember({ member: userAccount, status: status });

        logBanUnban.watch(function (error, res) {

            var status = canVote ? "Unblocked" : "Blocked";

            var message = "<BR>Member has been " + status + ".<BR>";
            progressActionsAfter(message, true);
        });
    }, 3);


}

function delegateVote() {






    if (!handlePassword("areYouSure", 1)) return;

    var nominatedAddress = $("#parm1").val();


    progressActionsBefore();
    setTimeout(function () {
        ldHandle.delegate(nominatedAddress, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
        var logDelegation = ldHandle.Delegated({ nominatedAddress: nominatedAddress }, { sender: sender }, { voteIndex: voteIndex });

        logDelegation.watch(function (error, res) {
            var message = "<B>Your vote has been successfully delegated <BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "1";
        });
    }, 3);



}

function transferOwnership() {


    if (!handlePassword("areYouSure", 1)) return;

    var newAdminAddress = $("#parm1").val();
    progressActionsBefore();
    setTimeout(function () {

        memberHandle.transferOwnership(newAdminAddress, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logMakeAdmin = memberHandle.OwnershipTransfer({ status: status });
        logMakeAdmin.watch(function (error, res) {
            var message = "<B>Admin rights have been transfered to new member. <BR>";
            progressActionsAfter(message, true);
            document.cookie = "admin=0";
        });

    }, 3);

}














function changeVotingRules() {

    var minimumSharesToPassVote,
        minutesForDebate,
        minMembers;



    if (!handlePassword("modal-change-rules", 3)) return;

    minimumSharesToPassVote = document.getElementById("new-quorum").value;
    minutesForDebate = document.getElementById("debating-period").value;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.changeVotingRules(minimumSharesToPassVote, minutesForDebate, 1, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logRulesChange = ldHandle.ChangeOfRules({ minimumSharesToPassAVote: minimumSharesToPassAVote }, { minutesForDebate: minutesForDebate });

        logRulesChange.watch(function (error, res) {
            var message = "New rules successfully applied..";
            progressActionsAfter(message, true);
        });
    }, 3);

}





function handlePassword(parentWindow, mode) {



    var password;

    try {
        if (mode == 0) password = $("#pass").val();
        else if (mode == 1) password = $("#pass-are-you-sure").val();
        else if (mode == 2) password = $("#pass-tokens").val();
        else if (mode == 3) password = $("#pass-rules-change").val();
        else if (mode == 4) password = $("#pass-proposal").val();

        web3.personal.unlockAccount(currAccount, password, 20);
        $("#modal-password").modal("hide");
        $("#" + parentWindow).modal("hide");
        $("#message-status-body").html("");

        return true;

    }
    catch (err) {
        $("#wrong-password-message").show();
        $("#wrong-password-message-integrated").show();
        $("#wrong-password-message-integrated-sure").show();

        return false;
    }
}

function userLogout() {

    clearCookies();
    //var initialPage = window.location.pathname;



    $("#alert-success").show();
    $("#dashboard").text("Dashboard");

    // $("#modal-message").html("You have been successfully logged out.");  
    //  $("#noticeModal").modal();

    showTimeNotification('top', 'right', "You have been successfully logged out.")
    setTimeout(function () {
        location.replace('index.html');
    }, 2000);




}

function progressActionsAfter(message, success) {

    if (success) {
        $("#message-status-title").html("Contract executed...<img src='../dist/img/checkmark.gif' height='40' width='43'>");
    }
    else {
        $("#message-status-title").html("Contract executed...<img src='../dist/img/no.png' height='40' width='43'>");
    }

    $("#message-status-body").html("<BR>" + message);

}


function progressActionsBefore() {


    $("#message-status-title").html("");
    $("#message-status-body").html("");
    $("#progress").modal();
    $("#message-status-title").html('Verifying contract... <i class="fa fa-refresh fa-spin" style="font-size:28px;color:red"></i>');
    setTimeout(function () {
        $("#message-status-title").html('Executing contract..<i class="fa fa-spinner fa-spin" style="font-size:28px;color:green"></i>');
    }, 1000);

}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursInt = hours;
    var days = Math.floor(hours / 24);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    if (hoursInt < 0) { return "CLOSED <BR>for voting" }
    else if (days == 0) {
        return hours + ':' + minutes + ':' + seconds + " Time left";
    }
    else
        return days + " days left";
}

function countdown(element, timeString, deadline) {
    // Fetch the display element
    var el = document.getElementById(element);


    // Set the timer
    var interval = setInterval(function () {

        var nowInseconds = Date.now() / 1000;
        var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
        el.innerHTML = timeLeft;
        document.getElementById(element).innerHTML = el.innerHTML;

        if (timeLeft == "CLOSED <BR>for voting") {
            clearInterval(interval);
            var countValue = element.substr(11);
            document.getElementById("voteup" + countValue).style.opacity = "0.1";
            document.getElementById("votedown" + countValue).style.opacity = "0.1";
            document.getElementById("urlvup" + countValue).style.pointerEvents = "none";
            document.getElementById("urlvdown" + countValue).style.pointerEvents = "none";
            document.getElementById("sum" + countValue).style.opacity = "1";
            document.getElementById("urlsum" + countValue).style.pointerEvents = "index.html?mode=s&pn=" + countValue;
        }
    }, 1000);
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        sec = d.getSeconds(),
        ampm = 'AM',
        time;


    yyyy = ('' + yyyy).slice(-2);

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM	
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    time = mm + '/' + dd + '/' + yyyy + '  ' + h + ':' + min + ':' + sec + ' ' + ampm;

    return time;
}





function formatDate(value, nohours) {

    value = new Date(value);

    if (nohours)
        return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
    return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear() + " " + value.getHours() + ":" + value.getMinutes();
}

//When investment property filed is saved
//sends its value to the database and handle controls





function changeDateFormat(date) {

    var dateParts = date.split("/");

    var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

    return dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
}







function verifyVotingStatus(proposalID, voter) {

    var result = ldHandle.proposals(proposalID, { from: adminAccount });






}



function renderWallet() {


    var numProposals = ldHandle.numProposals();

    var totalAllocatedTokens = ledgerHandle.totalLockedToken();
    var availableTokens = 0;
    var tokenPrice = ledgerHandle.singleTokenCost();

    var tokenPriceETH = tokenPrice / 1000000000000000000;
    var totalTokensInCirculation = ledgerHandle.tokensInCirculation();
    var tokensCommitedByMember = ledgerHandle.returnAllocatedTokensForMember(currAccount, true);






    // var totalEth = Math.round(ledgerHandle.tokensInCirculation() / 1000);
    var totalEth = web3.fromWei(web3.eth.getBalance(ledgerAddress), "ether").round(2);
    var totalEthAllocated = Math.round(totalAllocatedTokens * tokenPriceETH);
    var yourEther = web3.fromWei(web3.eth.getBalance(currAccount), "ether").round(2);
    var yourAllocatedEther = Math.round(tokensCommitedByMember * tokenPriceETH);
    var yourAvailableEther = Math.round(yourEther - yourAllocatedEther);
    var tokenBalance = token.balanceOf(currAccount);
    var yourEtherInTokens = tokenBalance * tokenPriceETH;
    availableTokens = tokenBalance - tokensCommitedByMember;
    var allocatedTokensLength = ledgerHandle.returnAllocatedTokensLength();
    var totalTokensEarnedMember = 0;
    var totalTokensEarned = 0
    var totalTokenToBeEarned = 0

    //  var yourInvestedEther = tokenBalance /

    for (var i = 0; i < allocatedTokensLength; i++) {
        var result = ledgerHandle.tokensLockedForProjects(i)

        if (result[0] == currAccount) {
            totalTokensEarnedMember += Number(result[6]);
        }

        if (result[5] > 0) {
            totalTokensEarned += Number(result[6]);
        }
        else {
            totalTokenToBeEarned += Number(result[6]);

        }
    }
    var totalTokensRewards = ledgerHandle.calculateTotalRewards();
    var userTokensRewards = ledgerHandle.calculateTotalRewardsMember(currAccount);








    $("#token-price").html((tokenPriceETH * 1).formatMoney(3, '.', ',') + " ETH/Token<BR>You have " + formatNumber(tokenBalance) + " tokens")
    $("#eth-price").html(exchangeFIAT + " USD/ETH<BR>You have " + (yourEther * 1).formatMoney(2, '.', ',') + " Eth ")


    $("#token-amount-stats").html("<B>Total circulation: </B>" + formatNumber(totalTokensInCirculation) +
        "<BR><B>Total allocated tokens: </B>" + formatNumber(totalAllocatedTokens) + "<HR>" +
        "<B>Your portion: </B>" + formatNumber(tokenBalance) +
        "<BR><B>Your percentage: </B>" + Math.round(ownedPercentage * 100) / 100 + "%" +
        "<BR><B>Your Allocated Tokens: </B>" + formatNumber(tokensCommitedByMember) +
        "<BR><B>Your Available Tokens: </B>" + formatNumber(availableTokens));



    $("#ether-usd-amount").html("Ξ" + (totalEth * 1).formatMoney(2, '.', ',') + "/$" + (totalEth * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>Ξ" + (totalEthAllocated).formatMoney(2, '.', ',') + "/$" + (totalEthAllocated * exchangeFIAT).formatMoney(2, '.', ',') + "<HR>" +
        "Ξ" + (yourEtherInTokens).formatMoney(2, '.', ',') + "/$" + (yourEtherInTokens * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>" + Math.round(ownedPercentage * 100) / 100 + "%" +
        "<BR>Ξ" + (yourAllocatedEther).formatMoney(2, '.', ',') + "/$" + (yourAllocatedEther * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>Ξ" + (yourAvailableEther).formatMoney(2, '.', ',') + "/$" + (yourAvailableEther * exchangeFIAT).formatMoney(2, '.', ','));


    var totalRewards = (userTokensRewards[0] * tokenPrice / Math.pow(10, 18)).formatMoney(2, '.', ',');



    $("#rewards").html("Your profit since inception: " + totalRewards + " ETH");
    $("#reward-amount").html("<B>Total rewards Paid: </B>" + formatNumber(totalTokensRewards[0]) +
        "<BR><B>Total rewards Pending: </B>" + formatNumber(totalTokensRewards[1]) + "<HR>" +
        "<BR><B>Your rewards Paid: </B>" + formatNumber(userTokensRewards[0]) +
        "<BR><B>Your rewards Pending: </B>" + formatNumber(userTokensRewards[1]));


}

function formatNumber(number) {
    number = number.toFixed(0) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}





function renderFrontPage() {

    var j = 0;
    var numProposals = ldHandle.numProposals();
    var debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes({ from: adminAccount });
    var url = window.location.href

    var projectPage = url.includes("projects.html");


    // <i> is used to iterate throug proposals
    // <j> is used to iterate through 7 hardcoed timeline elements.  

    if (numProposals > 0) {
        var i = numProposals - 1;

        $("#front-page-all-proposals").show();

        while (j < 7 && i >= 0) {

            var result,
                proposalNumberToDisplay,
                delegated,
                votedAlreadyMessage;

            result = ldHandle.proposals(i, { from: adminAccount });



            if ((projectPage && result[4] != "") || !projectPage) {


                delegated = getCookie("delegated")

                if (delegated == 1) {

                    var hasDelegateVoted = ldHandle.hasDelegateVoted(i, currAccount, { from: currAccount });
                    if (hasDelegateVoted) {
                        var howDelegateVoted = ldHandle.howDelegateVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "Your delegate has already voted";
                        votedAlreadyMessage += howDelegateVoted ? " for this proposal" : " against this proposal.";
                    } else {

                        votedAlreadyMessage = "Your delegate has not voted yet. To vote yourslef withdraw your delegation first. ";
                    }

                }
                else {
                    var hasVoted = ldHandle.hasVoted(i, currAccount, { from: currAccount });
                    if (hasVoted) {
                        var howVoted = ldHandle.howVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "You have already voted";
                        votedAlreadyMessage += howVoted ? " in favour of this proposal" : " against this proposal.";
                    }
                }



                proposalNumberToDisplay = j + 1;
                $("#proposal-title-" + j).text(result[3]);
                $("#proposal-body-" + j).text(result[2]);

                var noOfVotes = result[8];



                var extenedValue = ldHandle.calculateVotes(i);

                var extendedValue = getExtendedProposalResults(extenedValue);

                if (extendedValue.yea > 0) {
                    var percentageYes = Math.round(extendedValue.yea * 100 / extendedValue.votes);
                    percentageYes = Math.round(percentageYes / (100 / extendedValue.quorum));
                }
                else var percentageYes = 0;

                if (extendedValue.nay > 0) {
                    var percentageNo = Math.round(extendedValue.nay * 100 / extendedValue.votes);
                    percentageNo = Math.round(percentageNo / (100 / extendedValue.quorum));

                }
                else var percentageNo = 0;
                if (percentageYes > 0) {
                    $("#yes-bar-" + j).css("width", percentageYes + "%");
                    $("#yes-bar-" + j).text(percentageYes + "%")
                }

                if (percentageNo > 0) {
                    $("#no-bar-" + j).css("width", percentageNo + "%");

                    $("#no-bar-" + j).text(percentageNo + "%")
                }


                $("#proposal-view-" + j).attr("href", "?pn=" + i);

                var numOfVotes = ldHandle.numOfVotes(i);

                var strResults = "<BR>Yes:" + extendedValue.yea + "<BR>No:" + extendedValue.nay + "<BR>Quorum:" + extendedValue.quorum + "<BR>Tokens so far:" + extendedValue.votes + "<BR>Voters:" + numOfVotes;



                $("#proposal-title-" + j).text(result[3]);
                $("#proposal-body-" + j).text(result[2].substring(0, 250));
                $("#proposal-ext-" + j).html(strResults);


                var dateEntered = convertTimestamp(result[6]);
                var startdate = new Date(dateEntered);
                // startdate.setMinutes(dateEntered.getMinutes() - debatingPeriodInMinutes);

                var myStartDate = new Date(startdate - debatingPeriodInMinutes * 60000);
                var proposalTimeentered = "<time class='timeago' datetime='" + jQuery.timeago(myStartDate) + "'>" + jQuery.timeago(myStartDate) + "</time>";

                $("#proposal-time-entered-" + j).append("<time class='timeago' datetime='" + jQuery.timeago(myStartDate) + "'>" + jQuery.timeago(myStartDate) + "</time>");

                //check if proposal was funded

                // ledgerHandle.


                //render page for member who is logged in

                if (currAccount != "") {
                    $("#vote-down-front-" + j).append(" <a data-toggle='modal' id='urlvdown-front" + i + "' href='index.html?mode=v&pn=" + i + "&up=false#myModal' title='Vote Down' class='linkVoteClass'><img id='votedown-front" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></a>");

                    $("#vote-up-front-" + j).append(" <a data-toggle='modal' id='urlvup-front" + i + "'   href='index.html?mode=v&pn=" + i + "&up=true#myModal' title='Vote Up' class='linkVoteClass'> <img align = 'top' id='voteup-front" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></a>");


                    var deadline = result[6];
                    var nowInseconds = Date.now() / 1000;

                    if (nowInseconds >= deadline) {
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";

                        document.getElementById("proposal-debate-time-" + j).innerHTML = " CLOSED <BR>for voting"
                    } else {

                        var tempMessageID = "proposal-debate-time-" + j;
                        var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
                        countdown(tempMessageID, timeLeft, deadline);
                    }

                    // check if proposal has been executed, if yes disable voting buttons
                    if (result[7] > 0) {
                        //check if proposal passed
                        //check how many votes it received
                        if (result[7] == 1) {
                            document.getElementById("arrow-up-down-" + j).innerHTML += "<img src='../dist/img/arrowup.png' title='Proposal passed' height='40' width='43'>";

                        } else {
                            document.getElementById("arrow-up-down-" + j).innerHTML += "<img src='../dist/img/arrowdown.png' title='Proposal didn't pass' height='40' width='43'>";
                        }

                        document.getElementById("no-votes-" + j).innerHTML = numOfVotes;
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";
                    }


                    if (hasVoted || hasDelegateVoted || delegated == 1) {
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";


                        $("#voted-already-message-" + j).text(votedAlreadyMessage);
                        $("#voted-already-message-" + j).show();



                    }
                    else {

                        $("#voted-already-message-" + j).html("<BR>Please vote");
                        $("#voted-already-message-" + j).show();
                    }
                } else {
                    $("#proposals-front-panel").hide();
                    $("#members-front-panel").hide();
                    $("#vote-down-front-" + j).append("Login to vote");
                    $("#vote-down-front-" + j).css("color", "red")
                }

                $("#front-page-proposal-" + j).show();
                j++;
            }

            i--;
        }
    }
}


function convertDateToTimeStamp(dateString) {

    var dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = dateTimeParts[0].split('/'),
        date;


    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    return date.getTime() / 1000;


}



function setFormValidation(id) {
    $(id).validate({
        errorPlacement: function (error, element) {
            $(element).parent('div').addClass('has-error');
        }
    });
}


$(document).on('submit', '.validateDontSubmit', function (e) {
    //prevent the form from doing a submit
    e.preventDefault();
    return false;
});


$(document).on('submit', '#submit-proposal', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
    } else {
        e.preventDefault();
        // newProposal();

    }
});

// execute creation of new member


$(document).on('submit', '#register-form', '#register-form-initial', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
    } else {
        e.preventDefault();


    }
    createNewMember();
});




// execute login
$(document).on('submit', '#login-form', function (e) {
    if (e.isDefaultPrevented()) {


        userLogin();
        // handle the invalid form...
    } else {
        e.preventDefault();
        userLogin();

    }
});



// trigger function to fund account from alret waring mesage
$(document).on('click', '#fund-account-message', '#fund-account', function (e) {
    fundAccount();
});







// handle link to delegate votes to different member. 
$(document).on('click', '.linkDelegateClass', function (e) {

    e.preventDefault();
    var value = $(this).attr("href");

    var memberPosition = memberHandle.getMemberByUserID(getCookie("emailAddress"));
    var member = memberHandle.members(memberPosition);

    if (!member[1]) {
        $("#modal-message").html("You can't delegate your vote because your account is blocked from voting.");
        $("#noticeModal").modal();
        return;
    }

    var delegatedMemberEmail = decodeURI(getParameterByName('ui', value));

    memberPosition = memberHandle.getMemberByUserID(delegatedMemberEmail);
    member = memberHandle.members(memberPosition);

    if (!member[1]) {
        $("#modal-message").html("You can't delegate your vote to this member because his/her account is blocked from voting.");
        $("#noticeModal").modal();
        return;
    }


    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', delegateVote);


    var nominatedAddress = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));

    $("#parm1").val(nominatedAddress);

    $("#sure-mesasge").text("Are you sure you want to delegate your vote to " + actionName + "?");

    $("#modal-action-areyousure").text("Delegate")
    $("#are-you-sure-title").text("Delegating votes")


    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});

// handle link to ban or unban the user 

$(document).on('click', '.linkbanClass', function (e) {

    e.preventDefault();

    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', blockUnblock);

    var value = $(this).attr("href");
    var actionAddress = decodeURI(getParameterByName('mi', value));
    var action = decodeURI(getParameterByName('mode', value));
    var actionName = decodeURI(getParameterByName('flname', value));

    $("#parm1").val(actionAddress);
    var action = decodeURI(getParameterByName('mode', value));
    $("#parm1").val(actionAddress);
    $("#parm2").val(action);

    $("#sure-mesasge").text("Are you sure you want to ban " + actionName + "?");

    $("#modal-action-areyousure").text("Ban/Unban")
    $("#are-you-sure-title").text("Banning/Unbanning member")

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});

// handle link to view proposals details 
$(document).on('click', '.linkProposalViewClass', function (e) {



    e.preventDefault();
    var value = $(this).attr("href");
    var proposalNo = decodeURI(getParameterByName('pn', value));
    $("#content-header").html("<span class='glyphicon glyphicon-info-sign'></span> Proposal info")
    $("#show-content").modal();

    // $("#show-content").on('shown.bs.modal', function () {


    viewResults(proposalNo);
    //});
});




//handle link to tally proposals 

$(document).on('click', '.linkTallyClass', function (e) {

    e.preventDefault();
    var value = $(this).attr("href");

    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', executeProposal);
    var proposalNo = decodeURI(getParameterByName('pn', value));

    $("#parm1").val(proposalNo);

    proposalNo++;

    $("#sure-mesasge").text("Are you sure you want to tally  proposal No: " + proposalNo + "?");

    $("#modal-action-areyousure").text("Tally")
    $("#are-you-sure-title").text("Tally proposal");

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});



// handel link to vote on proposals 

$(document).on('click', '.linkVoteClass', function (e) {

    e.preventDefault();

    var value = $(this).attr("href");
    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', voteProposal);
    var proposalNo = decodeURI(getParameterByName('pn', value));
    var yesNo = decodeURI(getParameterByName('up', value));

    $("#parm1").val(proposalNo);
    $("#parm2").val(yesNo);

    proposalNo++;

    if (yesNo == "true") {
        $("#sure-mesasge").text("Are you sure you want to vote for proposal No: " + proposalNo + "?");
        $("#are-you-sure-title").text("Voting for proposal");
    }
    else {
        $("#sure-mesasge").text("Are you sure you want to vote against proposal No: " + proposalNo + "?");
        $("#are-you-sure-title").text("Voting against proposal");
    }

    $("#modal-action-areyousure").text("Vote");

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();

});



// Open change rules window
$("#change-token-parms").click(function () {
    $("#change-token-parms-form")[0].reset();
    $("#modal-change-token-parms").modal();

});




//handle submitting new parms for tokens window
$("#modal-action-new-token-parms").click(function () {


    actionButton = document.getElementById("modal-action-password");
    actionButton.addEventListener('click', changeTokenParms);
    $("#password-box-form")[0].reset();
    $("#modal-password").modal();

});

// handel link to pass admin 

$(document).on('click', '.linkAdminClass', function (e) {

    e.preventDefault();

    var value = $(this).attr("href");
    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', transferOwnership);
    var newAdmin = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));


    $("#parm1").val(newAdmin);
    var newAdmin = decodeURI(getParameterByName('mi', value));
    $("#sure-mesasge").text("Are you sure you want to pass admin rights to  " + actionName + "?");
    $("#modal-action-areyousure").text("Transfer Onwership")
    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();

});

$(document).on('click', '.linkAdminTokens', function (e) {

    e.preventDefault();


    actionButton = document.getElementById("modal-action-buy-tokens");
    actionButton.addEventListener('click', addTokens);
    $("#pass-tokens").val("");


    var value = $(this).attr("href");

    var member = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));
    $("#add-token-title").text("Add free tokens for " + actionName)
    $("#parm1").val(member);
    $("#buy-tokens-modal").modal();

});


// switch arrows on the collapsible control

$(document).on('click', 'a[data-toggle=collapse]', function (e) {
    var urlClicked = e.currentTarget.hash;
    var id = urlClicked.substr(9);

    var status = $("#arrow" + id).css("transform");

    if (status == "matrix(1, 0, 0, 1, 0, 0)") $("#arrow" + id).css("transform", "rotate(270deg)");
    else $("#arrow" + id).css("transform", "rotate(0deg)");
});



//open new proposal window to make proposal on the blockchain from the local database placed 
//by develper.

$(document).on('click', '.admin-proposals', function (e) {

    $("#new-proposal").val("");
    var urlClicked = e.currentTarget.hash;
    var id = urlClicked.substr(26);
    var rowChoice = urlClicked.split("-");

    var proposalTitle = $("#project-title" + id).text();
    var proposalDescription = $("#project-info" + id).text();
    var beneficiaryAddress = $("#project-eth-address" + id).text();
    var proposalReference = $("#project-reference" + id).text();
    var interests = $("#project-proposal-interests" + id).text();
    var returnDate = $("#project-proposal-return-date" + id).text();



    $("#investment-proposal-title").val(proposalTitle);
    $("#investment-proposal-title").change();

    $("#investment-proposal-description").val(proposalDescription);
    $("#investment-proposal-description").change();
    $("#investment-proposal-reference").val(proposalReference);
    $("#investment-proposla-addr").val(beneficiaryAddress);
    $("#investment-proposal-interests").val(interests);
    $("#investment-proposal-return-date").val(returnDate);


    $("#modal-proposal-list").modal('hide');
    $("#modal-admin-investment-proposal").modal();
    //      $("#modal-admin-investment-proposal").reset();


});






// trigger logout
$(document).on('click', '#menu-logout', function () {

    userLogout();
});

// open signup window
$(document).on('click', '#menu-signup', function () {
    $("#register-form")[0].reset();
    $("#modal-register").modal();
});

// open login window   
$(document).on('click', '#menu-login', function () {
    // $("#login-html").load("login.html", function () {
    $("#modal-login").modal();
    //  });

});


$(document).ready(function () {

    // Javascript method's body can be found in assets/js/demos.js
    //demo.initDashboardPageCharts();

    // demo.initVectorMap();

    setFormValidation('#login-form');
    setFormValidation('#register-form');
    setFormValidation('#buy-tokens');
    setFormValidation('#submit-proposal');
    setFormValidation('#submit-admin-proposal');
    setFormValidation('#register-form-initial');





    $('[data-toggle="popover"]').popover();



    $('.datetimepicker').datetimepicker({
        format: 'DD/MM/YYYY HH:MM',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });

    $('.datepicker').datetimepicker({
        format: 'MM/DD/YYYY',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove',
            inline: true
        }
    });




    //  $('.datepicker').datepicker({
    //      weekStart: 1
    //  });


    $("time.timeago").timeago();


   



    // clear the edit fileds to enter new milestone
    // and change its mode to update. 

    $("#new-milestone").click(function () {



        $("#investment-proposal-milestone-date").val("");
        $("#investment-proposal-milestone-amount").val("");
        $("#investment-proposal-milestone-description").val("");
        $("#investment-proposal-milestone-mode").val("new");


    });





    /*
        $(".alert").click(function () {
            $(this).hide();
        }); */

    // Remove custom error message from password box when user starts typing again .
    $("#pass").mousedown(function () {
        $("#wrong-password-message").hide();
    });

    // Remove custom error message from password box in the integrated window when user starts typing again .
    $("#pass-are-you-sure").keydown(function () {
        $("#wrong-password-message-integrated").hide();
    });


    // trigger function to add some ether to first time users. 
    $("#fund-account").click(function () {

        fundAccount();

    });



    // Opern new proposal window
    $("#start-idea-proposal").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-idea-proposal").modal();

    });


    // Opern new job window
    $("#start-new-job").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-new-job").modal();

    });


    // Opern new service window
    $("#start-new-service").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-new-service").modal();

    });









    // Open change rules window
    $("#change-rules-stats").click(function () {
        $("#modal-change-rules").modal();

    });

    // Notify users that any of this actions is not implemented yet. 
    $("#transfer-tokens, #sell-tokens, #mine-tokens, #start-new-debate, #current-debates, #live-projects, #funded-projects, #completed-projects").click(function () {
        alert("Feature not impleneted yet. ");

    });



    //handle opening rules change window
    $("#modal-action-new-rules").click(function () {

        // actionButton = document.getElementById("modal-action-new-rules");
        // actionButton.addEventListener('click', changeVotingRules);
        //  $("#modal-password").modal();

        changeVotingRules();

    });





    //Handle opening new idea proposal window
    $("#modal-action-new-proposal").click(function () {

        var form = $("#new-proposal-title-idea");
        form.validate();

        if (form.valid()) newProposal();


    });








    //handel opening of buy token window
    $("#buy-tokens, #buy-tokens-message").click(function () {

        actionButton = document.getElementById("modal-action-buy-tokens");
        actionButton.addEventListener('click', buyTokens);
        $("#pass-tokens").val("");
        $("#buy-tokens-modal").modal();
    });

    // open dialog box for reseting delgations

    $("#reset-delegation").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', resetDelegation);


        $("#sure-mesasge").text("This action will erase all delegations made by members and members will need to execute their delegations again, are you sure?");
        $("#modal-action-areyousure").text("Reset delegation")
        $("#are-you-sure-title").text("Reseting delegation")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();


    });

    // open dialog box for withdrawing delgations

    $("#withdraw-delegation").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', cancelDelegation);


        $("#sure-mesasge").text("This action will cancel your prior delegation of your voting rights, are you sure?");
        $("#are-you-sure-title").text("Withdrawing delegation")
        $("#modal-action-areyousure").text("Cancel delegation")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();


    });



    
    $(".chat").click(function () {

        $("#modal-message").modal();

    });

    $(".bid").click(function () {

        $("#modal-bid").modal();

    });



    // open list with all proposals
    $("#view-new-proposal, #vote-new-proposal, #tally-proposals").click(function () {



        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        // $("#modal-proposal-list").on('shown.bs.modal', function () {
        listProposals();
        // });

    });

    // open list with all members for delegation
    $("#delegate-votes-menu").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //  $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("delegate");
        //   });

    });

    // open list with all members to ban unban member
    $("#ban-member").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //  $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("ban");
        //   });

    });


    // open list with all members for admin transfer
    $("#transfer-owner").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //   $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("transferadmin");
        //   });

    });


    // hide wrong password message on integrated window when it closes
    $("#areYouSure").on('hidden.bs.modal', function () {
        $("#wrong-password-message-integrated").hide();
    });

    // hide wrong password message on regular password window when it closes
    $("#modal-password").on('hidden.bs.modal', function () {
        $("#wrong-password-message").hide();
    });




    // scripts for the investment proposal 

    $("ul.nav", "#tab4").click(function (e) {
        var urlClicked = e.target.hash;
        var id = urlClicked.substr(6);
        var rowChoice = urlClicked.split("-");
        var row = rowChoice[1];
        var choice = rowChoice[2];

        $("input[name=documents" + row + "]").val(choice);
    });





});









