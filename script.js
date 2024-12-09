function donationContentShow(activeTab, inactiveTab, activeContent, inactiveContent) {

    activeContent.classList.remove("d-none");
    inactiveContent.classList.add("d-none");

    activeTab.classList.remove("btn-outline-success");
    activeTab.classList.add("btn-success");

    inactiveTab.classList.remove("btn-success");
    inactiveTab.classList.add("btn-outline-success");
}

document.addEventListener("DOMContentLoaded", () => {
    const donationTab = document.getElementById("donation-tab");
    const historyTab = document.getElementById("history-tab");
    const donationContent = document.getElementById("donation-content");
    const historyContent = document.getElementById("history-content");

    donationTab.addEventListener("click", () => {
        donationContentShow(donationTab, historyTab, donationContent, historyContent);
    });

    historyTab.addEventListener("click", () => {
        donationContentShow(historyTab, donationTab, historyContent, donationContent);
    });
});

const donationCampaigns = [
    {
        title: "Donate for Flood at Noakhali, Bangladesh",
        description: "The recent floods in Noakhali have caused significant damage to homes and infrastructure. Your donation will help provide essential supplies to those affected by this disaster. Every contribution, big or small, makes a difference. Please join us in supporting the relief efforts and making a positive impact on the lives of those in need.",
        image: "./assets/noakhali.png",
        amount: 0
    },
    {
        title: "Donate for Flood Relief in Feni, Bangladesh",
        description: "The recent floods in Feni have devastated local communities, leading to severe disruption and loss. Your generous donation will help provide immediate aid, including food, clean water, and medical supplies, to those affected by this calamity. Together, we can offer crucial support and help rebuild lives in the aftermath of this disaster. Every contribution counts towards making a real difference. Please consider donating today to assist those in urgent need.",
        image: "./assets/feni.png",
        amount: 600
    },
    {
        title: "Aid for Injured in the Quota Movement",
        description: "The recent Quota movement has resulted in numerous injuries and significant hardship for many individuals. Your support is crucial in providing medical assistance, rehabilitation, and necessary supplies to those affected. By contributing, you help ensure that injured individuals receive the care and support they need during this challenging time. Every donation plays a vital role in alleviating their suffering and aiding in their recovery. Please consider making a donation to support these brave individuals in their time of need.",
        image: "./assets/quota-protest.png",
        amount: 2400
    }
];



const getDonations = () => JSON.parse(localStorage.getItem('donations')) || [];
const saveDonations = (donations) => localStorage.setItem('donations', JSON.stringify(donations));


function renderDonationCards() {
    const container = document.getElementById('donationCards');
    container.innerHTML = donationCampaigns.map((campaign, index) => `
        <div class="card d-flex flex-row p-4" data-index="${index}">
            <img src="${campaign.image}" class="card-img-left rounded shadow-lg" alt="Campaign Image"
                style="width: 500px; height: 80%; object-fit: cover" />
            <div class="card-body py-2 ps-5">
                <span class="badge rounded-pill text-bg-secondary mb-3">
                    <img src="./assets/coin.png" alt="" style="width: 20px; object-fit: cover" />
                    <span class="campaign-amount">${campaign.amount}</span> <span>BDT</span>
                </span>
                <h5 class="card-title mb-3 fw-bold">${campaign.title}</h5>
                <p class="card-text text-muted mb-2">${campaign.description}</p>
                <div>
                    <input type="text" class="form-control me-2 donationAmount w-100" placeholder="Write Donation Amount (BDT)" />
                    <button class="w-100 mt-3 btn btn-success donateBtn">Donate Now</button>
                </div>
            </div>
        </div>
    `).join('');
    attachEventListeners();
}


const updateDonationAmount = (campaignTitle, donationAmount) => {
    const campaign = donationCampaigns.find(c => c.title === campaignTitle);
    if (campaign) {
        campaign.amount += donationAmount;
        saveDonations(donationCampaigns);
        renderDonationCards();
    } else {
        console.error("Campaign not found: ", campaignTitle);
    }
};


let accountBalance = 5500; 

function handleDonation(campaignIndex) {
    const inputField = document.querySelectorAll('.donationAmount')[campaignIndex];
    const inputAmount = inputField.value.trim();
    const campaign = donationCampaigns[campaignIndex];

  
    if (inputAmount === '') {
        alert("Please enter a donation amount.");
        inputField.value = ''; 
        return; 
    }

 
    if (!/^\d+(\.\d+)?$/.test(inputAmount) || parseFloat(inputAmount) <= 0) {
        alert("Please enter a valid positive number.");
        inputField.value = '';
        return;
    }

   
    const donationAmount = parseFloat(inputAmount);
    if (donationAmount > accountBalance) {
        alert("Insufficient balance. Please enter an amount less than or equal to your account balance.");
        inputField.value = ''; 
        return; 
    }


    const formattedDate = new Date().toString(); 
    const newDonation = {
        title: campaign.title, 
        amount: donationAmount,
        date: formattedDate
    };
    const donationHistory = JSON.parse(localStorage.getItem('donateHistory')) || [];
    donationHistory.push(newDonation);
    localStorage.setItem('donateHistory', JSON.stringify(donationHistory));


    inputField.value = '';
    showSuccessModal();
    updateDonationAmount(campaign.title, donationAmount);

    const totalElement = document.getElementById('totalDonationAmount');
    let currentTotal = parseFloat(totalElement.innerText) || 5500;
    currentTotal -= donationAmount; 
    totalElement.innerText = currentTotal >= 0 ? currentTotal : 0; 

    accountBalance -= donationAmount;
    renderDonationHistory();
}


function renderDonationHistory() {
    const donationHistory = JSON.parse(localStorage.getItem('donateHistory')) || [];
    const container = document.getElementById('donationHistory');

    if (!donationHistory.length) {
        container.innerHTML = '<p>No donation history available.</p>';
        return;
    }

    container.innerHTML = donationHistory.map(donation => `
        <div class="list-group-item my-2 border-2 rounded">
            <p><span>${donation.amount}</span> BDT donated for <strong>${donation.title}</strong></p>
            <small>Date: ${donation.date}</small>
        </div>
    `).join('');
}


function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('congratulationsModal'));
    modal.show();
}

function refreshData() {
    renderDonationHistory();
    calculateTotalDonation();
}

function attachEventListeners() {
    document.querySelectorAll('.donateBtn').forEach((btn, index) => {
        btn.addEventListener('click', () => handleDonation(index));
    });
}

function initialize() {
    renderDonationCards();
    renderDonationHistory();
    refreshData();
}

initialize();
