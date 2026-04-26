document.addEventListener('DOMContentLoaded', () => {

    // ─── State ────────────────────────────────────────────────
    let selectedMovie  = null;
    let selectedPrice  = 0;
    let selectedTiming = null;

    // ─── DOM refs ─────────────────────────────────────────────
    const movieCards    = document.querySelectorAll('.movie-card');
    const timingBtns    = document.querySelectorAll('.timing-btn');
    const seatGrid      = document.getElementById('seat-grid');
    const cinemaOverlay = document.getElementById('cinema-overlay');
    const checkoutBtn   = document.getElementById('checkout-btn');

    const sMovie  = document.getElementById('s-movie');
    const sTiming = document.getElementById('s-timing');
    const sSeats  = document.getElementById('s-seats');
    const sPrice  = document.getElementById('s-price');
    const sTotal  = document.getElementById('s-total');

    // ─── Generate Seat Grid ───────────────────────────────────
    const ROWS = ['A','B','C','D','E','F'];
    const COLS = 9; // seats per half

    function buildSeatGrid() {
        seatGrid.innerHTML = '';
        ROWS.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'seat-row';

            // Row label
            const label = document.createElement('span');
            label.className = 'row-label';
            label.textContent = row;
            rowEl.appendChild(label);

            // Left seats (1-4)
            for (let i = 1; i <= 4; i++) {
                rowEl.appendChild(createSeat(row, i));
            }

            // Aisle gap
            const aisle = document.createElement('div');
            aisle.className = 'aisle';
            rowEl.appendChild(aisle);

            // Right seats (5-8)
            for (let i = 5; i <= 8; i++) {
                rowEl.appendChild(createSeat(row, i));
            }

            seatGrid.appendChild(rowEl);
        });
    }

    function createSeat(row, col) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.id = `${row}${col}`;

        // Randomly mark some seats as occupied (30% chance)
        if (Math.random() < 0.30) {
            seat.classList.add('occupied');
        }

        seat.addEventListener('click', () => {
            if (seat.classList.contains('occupied')) return;
            seat.classList.toggle('selected');
            updateSummary();
        });

        return seat;
    }

    buildSeatGrid(); // build once on load

    // ─── Movie Selection ──────────────────────────────────────
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove highlight from all cards
            movieCards.forEach(c => c.classList.remove('selected-card'));
            card.classList.add('selected-card');

            // Update state
            selectedMovie = card.dataset.movie;
            selectedPrice = parseInt(card.dataset.price);

            // Update summary
            sMovie.textContent = selectedMovie;
            sPrice.textContent = '₹' + selectedPrice;

            // Enable timing buttons & reset old timing
            timingBtns.forEach(btn => {
                btn.removeAttribute('disabled');
                btn.classList.remove('active-timing');
            });
            selectedTiming = null;
            sTiming.textContent = '—';

            // Rebuild seat grid with fresh randomization
            buildSeatGrid();
            checkOverlay();
            updateSummary();
        });
    });

    // ─── Timing Selection ─────────────────────────────────────
    timingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timingBtns.forEach(b => b.classList.remove('active-timing'));
            btn.classList.add('active-timing');

            selectedTiming = btn.textContent.trim();
            sTiming.textContent = selectedTiming;

            // Rebuild seats to simulate different occupancy for each show
            buildSeatGrid();
            checkOverlay();
            updateSummary();
        });
    });

    // ─── Overlay Control ──────────────────────────────────────
    function checkOverlay() {
        if (selectedMovie && selectedTiming) {
            cinemaOverlay.style.display = 'none';
        } else {
            cinemaOverlay.style.display = 'flex';
        }
    }

    // ─── Summary Update ───────────────────────────────────────
    function updateSummary() {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const count = selectedSeats.length;
        const total = count * selectedPrice;

        sSeats.textContent = count + (count === 1 ? ' seat' : ' seats');
        sTotal.textContent = '₹' + total;

        // Enable checkout only when movie + timing + at least 1 seat chosen
        const canBook = selectedMovie && selectedTiming && count > 0;
        checkoutBtn.disabled = !canBook;
    }

    // ─── Checkout / Confirm ───────────────────────────────────
    checkoutBtn.addEventListener('click', () => {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const count = selectedSeats.length;
        const total = count * selectedPrice;

        // Seat IDs for display
        const seatIds = Array.from(selectedSeats).map(s => s.dataset.id).join(', ');

        // Fill toast details
        document.getElementById('m-movie').textContent  = selectedMovie;
        document.getElementById('m-timing').textContent = selectedTiming;
        document.getElementById('m-seats').textContent  = seatIds;
        document.getElementById('m-total').textContent  = '₹' + total;

        // Mark selected seats as occupied immediately
        selectedSeats.forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('occupied');
        });
        updateSummary();

        // Show Bootstrap Toast
        const toastEl = document.getElementById('bookingToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    });

});
