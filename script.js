
// ======================================
// 1. LẤY CÁC THÀNH PHẦN HTML
// ======================================

const giftBox = document.getElementById("giftBox");
const openButton = document.getElementById("openButton");
const cardPreview = document.getElementById("cardPreview");
const letterContainer = document.getElementById("letterContainer");
const replayButton = document.getElementById("replayButton");
const instruction = document.getElementById("instruction");

const petalsContainer = document.getElementById("petals");
const sparklesContainer = document.getElementById("sparkles");

const musicButton = document.getElementById("musicButton");

// ======================================
// 2. BIẾN ĐIỀU KHIỂN
// ======================================

let isOpened = false;
let musicPlaying = false;

let audioContext = null;
let musicTimer = null;
let noteIndex = 0;

// Giai điệu piano nhẹ nhàng
const melody = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 659.25, 698.46, 783.99,
    659.25, 587.33, 523.25, 587.33,
    523.25, 659.25, 698.46, 783.99
];

// ======================================
// 3. TẠO CÁNH HOA RƠI
// ======================================

function createPetals() {

    const flowers = ["🌸", "🌷", "🌺", "✿", "❀"];

    for (let i = 0; i < 22; i++) {

        const petal = document.createElement("div");

        petal.className = "petal";

        petal.textContent =
            flowers[Math.floor(Math.random() * flowers.length)];

        petal.style.left = Math.random() * 100 + "%";

        petal.style.fontSize =
            (12 + Math.random() * 15) + "px";

        petal.style.animationDuration =
            (7 + Math.random() * 9) + "s";

        petal.style.animationDelay =
            (-Math.random() * 15) + "s";

        petalsContainer.appendChild(petal);
    }
}

// ======================================
// 4. TẠO ÁNH SÁNG LẤP LÁNH
// ======================================

function createSparkles() {

    for (let i = 0; i < 35; i++) {

        const sparkle = document.createElement("div");

        sparkle.className = "sparkle";
        sparkle.textContent = "✦";

        sparkle.style.left =
            Math.random() * 100 + "%";

        sparkle.style.top =
            Math.random() * 100 + "%";

        sparkle.style.fontSize =
            (8 + Math.random() * 15) + "px";

        sparkle.style.animationDelay =
            Math.random() * 3 + "s";

        sparklesContainer.appendChild(sparkle);
    }
}

// ======================================
// 5. TẠO HIỆU ỨNG LẤP LÁNH KHI MỞ QUÀ
// ======================================

function createExtraSparkles() {

    for (let i = 0; i < 30; i++) {

        const star = document.createElement("div");

        star.className = "sparkle";
        star.textContent = "✧";

        star.style.left =
            (30 + Math.random() * 40) + "%";

        star.style.top =
            (25 + Math.random() * 40) + "%";

        star.style.fontSize =
            (15 + Math.random() * 20) + "px";

        star.style.animationDuration = "1.5s";

        sparklesContainer.appendChild(star);
    }
}

// ======================================
// 6. PHÁT MỘT NỐT NHẠC
// ======================================

function playNote(frequency) {

    if (!audioContext ||
        audioContext.state !== "running") {
        return;
    }

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.045,
        audioContext.currentTime + 0.1
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 1.2
    );

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1.3
    );
}

// ======================================
// 7. BẬT NHẠC TỰ ĐỘNG
// ======================================

function startMusic() {

    // Không tạo nhiều bộ phát nhạc cùng lúc
    if (musicPlaying) {
        return;
    }

    // Tạo AudioContext
    if (!audioContext) {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {

            musicButton.textContent =
                "Trình duyệt không hỗ trợ nhạc";

            return;
        }

        audioContext = new AudioContextClass();
    }

    // Mở quyền phát âm thanh
    audioContext.resume().then(() => {

        if (musicPlaying) return;

        musicPlaying = true;

        musicButton.textContent = "♫ Tắt nhạc";

        // Phát nốt đầu tiên
        playNote(melody[noteIndex]);

        // Phát nhạc liên tục
        musicTimer = setInterval(() => {

            noteIndex++;

            if (noteIndex >= melody.length) {
                noteIndex = 0;
            }

            playNote(melody[noteIndex]);

        }, 700);

    }).catch(error => {

        console.log("Không thể phát nhạc:", error);

    });
}

// ======================================
// 8. TẮT NHẠC
// ======================================

function stopMusic() {

    musicPlaying = false;

    if (musicTimer !== null) {

        clearInterval(musicTimer);

        musicTimer = null;
    }

    musicButton.textContent = "♫ Bật nhạc";
}

// ======================================
// 9. HIỆU ỨNG MỞ HỘP QUÀ
// ======================================

function openGift() {

    if (isOpened) return;

    isOpened = true;

    // TỰ ĐỘNG BẬT NHẠC KHI NHẤN MỞ QUÀ
    startMusic();

    // Vô hiệu hóa nút mở
    openButton.disabled = true;

    openButton.style.opacity = "0";

    instruction.textContent =
        "Món quà yêu thương đang được mở ra...";

    // Mở nắp hộp
    giftBox.classList.add("opened");

    // Tạo ánh sáng lung linh
    createExtraSparkles();

    // Thiệp bay lên
    setTimeout(() => {

        cardPreview.classList.add("fly");

    }, 500);

    // Hiện lá thư chính
    setTimeout(() => {

        letterContainer.classList.add("show");

        instruction.textContent =
            "Một lời tri ân gửi đến cô giáo kính yêu";

    }, 1900);
}

// ======================================
// 10. MỞ LẠI MÓN QUÀ
// ======================================

function replayGift() {

    isOpened = false;

    // Ẩn lá thư
    letterContainer.classList.remove("show");

    setTimeout(() => {

        // Đóng lại hộp quà
        giftBox.classList.remove("opened");

        // Đưa thiệp về vị trí ban đầu
        cardPreview.classList.remove("fly");

        // Cho phép mở lại
        openButton.disabled = false;

        openButton.style.opacity = "1";

        instruction.textContent =
            "Một món quà nhỏ dành tặng người lái đò thầm lặng";

    }, 700);

}

// ======================================
// 11. NÚT ĐIỀU KHIỂN ÂM NHẠC
// ======================================

musicButton.addEventListener("click", () => {

    if (musicPlaying) {

        stopMusic();

    } else {

        startMusic();

    }

});

// ======================================
// 12. CÁC SỰ KIỆN NÚT BẤM
// ======================================

openButton.addEventListener("click", openGift);

replayButton.addEventListener("click", replayGift);

// ======================================
// 13. KHỞI ĐỘNG WEBSITE
// ======================================

createPetals();

createSparkles();

console.log(
    "Website thiệp chúc mừng 20/11 đã sẵn sàng!"
);
