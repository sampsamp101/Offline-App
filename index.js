const leftchevron = document.getElementById("left-chevron");
const rightchevron = document.getElementById("right-chevron");
const currentScreenMiddle = document.querySelector(".current-page-minor-animation h3");
const currentScreenDemoMsg = document.getElementById("screen-demo-msg");

const captions = [
    "Simple to set up",
    "Set up things to send out to target users",
    "Update status/notes and upload documents to users",
    "Update things to mention while you are away...",
    "Upload important documents while you are away...",
    "Sit back and relax!",
    "Using our app won't be a pain",
];

const totalPages = captions.length;
let currentPage = 1;

function showPage(page) {
    for (let i = 1; i <= totalPages; i++) {
        document.getElementById(`screen${i}`).classList.toggle("hidden", i !== page);
    }
    currentScreenDemoMsg.textContent = `${page}. ${captions[page - 1]}`;
    currentScreenMiddle.textContent = page;
    leftchevron.classList.toggle("disabled", page <= 1);
    rightchevron.classList.toggle("disabled", page >= totalPages);
}

leftchevron.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        showPage(currentPage);
    }
});

rightchevron.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage += 1;
        showPage(currentPage);
    }
});

showPage(currentPage); // page 1 on load