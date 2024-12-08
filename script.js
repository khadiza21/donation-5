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
        description: "The recent floods in Noakhali have caused significant damage to homes and infrastructure. Your donation will help provide essential supplies to those affected by this disaster.",
        image: "./assets/noakhali.png",
        amount: 0
    },
    {
        title: "Donate for Flood Relief in Feni, Bangladesh",
        description: "The recent floods in Feni have devastated local communities. Your generous donation will help provide immediate aid, including food, clean water, and medical supplies.",
        image: "./assets/feni.png",
        amount: 600
    },
    {
        title: "Aid for Injured in the Quota Movement",
        description: "The recent Quota movement has resulted in numerous injuries. Your support is crucial in providing medical assistance and rehabilitation.",
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
                <div class="d-flex">
                    <input type="number" class="form-control me-2 donationAmount" placeholder="Write Donation Amount (BDT)" />
                    <button class="btn btn-success donateBtn">Donate Now</button>
                </div>
            </div>
        </div>
    `).join('');
}


function updateCampaignAmounts() {
    const donations = getDonations();

    donationCampaigns.forEach(campaign => {

        const initialAmount = campaign.amount;


        campaign.amount = donations
            .filter(donation => donation.title === campaign.title)
            .reduce((sum, donation) => sum + parseFloat(donation.amount), initialAmount);
    });

    document.querySelectorAll('.campaign-amount').forEach((el, index) => {
        el.innerText = donationCampaigns[index].amount;
    });
}

function handleDonation(campaignIndex) {
    const inputField = document.querySelectorAll('.donationAmount')[campaignIndex];
    const inputAmount = parseFloat(inputField.value);
    const campaign = donationCampaigns[campaignIndex];

    if (inputAmount && inputAmount > 0) {
        const newDonation = {
            title: campaign.title,
            amount: inputAmount,
            date: new Date().toLocaleString()
        };

        const donations = getDonations();
        donations.push(newDonation);
        saveDonations(donations);

        inputField.value = '';
        showSuccessModal();
        refreshData();
    }
}


function renderDonationHistory() {
    const donations = getDonations();
    const container = document.getElementById('donationHistory');
    if (!donations.length) {
        container.innerHTML = '<p>No donation history available.</p>';
        return;
    }

    container.innerHTML = donations.map(donation => `
        <div class="list-group-item my-2 border-2 rounded">
            <p><span>${donation.amount}</span> BDT donated for <strong>${donation.title}</strong></p>
            <small>${donation.date}</small>
        </div>
    `).join('');
}


function calculateTotalDonation() {
    const donations = getDonations();
    const total = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 5500);
    document.getElementById('totalDonationAmount').innerText = total;
}


function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('congratulationsModal'));
    modal.show();
}


function refreshData() {
    updateCampaignAmounts();
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
    refreshData();
    attachEventListeners();
}

initialize();
