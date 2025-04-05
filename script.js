document.addEventListener('DOMContentLoaded', () => {
    // === index.html functionality ===
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('userName').value.trim();
            const guestCount = parseInt(document.getElementById('guestCount').value);

            if (name && guestCount >= 2 && guestCount <= 16) {
                localStorage.setItem('userName', name);
                localStorage.setItem('guestCount', guestCount);
                window.location.href = 'seating.html';
            } else {
                alert("Please enter a valid number of guests (2–16).");
            }
        });
    }

    // === seating.html functionality ===
    const userDisplay = document.getElementById("userDisplay");
    const chairArea = document.getElementById("chairArea");
    const saveButton = document.getElementById("saveButton");
    const message = document.getElementById("message");

    if (userDisplay && chairArea) {
        const name = localStorage.getItem("userName");
        const guestCount = parseInt(localStorage.getItem("guestCount"));
        userDisplay.textContent = name;

        if (guestCount < 2 || guestCount > 16) {
            chairArea.innerHTML = `<p>⚠️ Layout supports 2–16 guests only.</p>`;
            return;
        }

        const table = document.querySelector(".table-rect");

        let topCount = 0, bottomCount = 0, leftCount = 0, rightCount = 0;

        if (guestCount <= 7) {
            topCount = Math.floor(guestCount / 2);
            bottomCount = guestCount - topCount;
        } else if (guestCount <= 13) {
            topCount = Math.ceil(guestCount / 2);
            bottomCount = guestCount - topCount;
        } else {
            topCount = 6;
            bottomCount = 6;
            const remaining = guestCount - 12;
            leftCount = Math.floor(remaining / 2);
            rightCount = remaining - leftCount;
        }

        // Resize table based on seat layout
        const tableWidth = 100 + Math.max(topCount, bottomCount) * 50;
        const tableHeight = 60 + Math.max(leftCount, rightCount) * 50;

        table.style.width = `${tableWidth}px`;
        table.style.height = `${tableHeight}px`;
        table.style.left = `${(500 - tableWidth) / 2}px`;
        table.style.top = `${(300 - tableHeight) / 2}px`;

        let seatNumber = 1;
        createSeats("top", topCount, seatNumber); seatNumber += topCount;
        createSeats("bottom", bottomCount, seatNumber); seatNumber += bottomCount;
        createSeats("left", leftCount, seatNumber); seatNumber += leftCount;
        createSeats("right", rightCount, seatNumber);

        saveButton.addEventListener("click", () => {
            message.textContent = "✅ Reservation saved successfully!";
        });
    }

    function createSeats(side, count, startNumber) {
        const seatSize = 60;
        const containerWidth = 500;
        const containerHeight = 300;
        const spacing = (side === "top" || side === "bottom")
            ? (containerWidth - (count * seatSize)) / (count + 1)
            : (containerHeight - (count * seatSize)) / (count + 1);

        for (let i = 0; i < count; i++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.textContent = `Seat ${startNumber + i}`;

            if (side === "top") {
                seat.style.top = "10px";
                seat.style.left = `${spacing + i * (seatSize + spacing)}px`;
            } else if (side === "bottom") {
                seat.style.bottom = "10px";
                seat.style.left = `${spacing + i * (seatSize + spacing)}px`;
            } else if (side === "left") {
                seat.style.left = "10px";
                seat.style.top = `${spacing + i * (seatSize + spacing)}px`;
            } else if (side === "right") {
                seat.style.right = "10px";
                seat.style.top = `${spacing + i * (seatSize + spacing)}px`;
            }

            seat.addEventListener("click", () => {
                const guestName = prompt(`Enter name for ${seat.textContent}:`);
                if (guestName) {
                    seat.textContent = guestName;
                }
            });

            document.getElementById("chairArea").appendChild(seat);
        }
    }
});
