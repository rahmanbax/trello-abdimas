<div id="loading-overlay" style="display: flex;">
    <div class="spinner"></div>
</div>

<style>
    #loading-overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.75);
        z-index: 9999;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        border: 6px solid #f3f3f3;
        border-top: 6px solid oklch(62.3% 0.214 259.815);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>

<script>
    const overlay = document.getElementById('loading-overlay');
    let activeFetches = 0;

    // Override global fetch
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        if (activeFetches === 0) {
            overlay.style.display = 'flex';
        }

        activeFetches++;

        return originalFetch(...args)
            .finally(() => {
                activeFetches--;
                if (activeFetches === 0) {
                    overlay.style.display = 'none';
                }
            });
    };

    // Sembunyikan overlay jika tidak ada fetch saat window sudah sepenuhnya dimuat
    window.addEventListener('load', function () {
        if (activeFetches === 0) {
            overlay.style.display = 'none';
        }
    });

    // Untuk semua form
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                overlay.style.display = 'flex';
            });
        });
    });
</script>
