<div id="loading-overlay" style="display: none;">
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
        display: none;
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
    (function () {
        const overlay = document.getElementById("loading-overlay");
        if (!overlay) return;

        let activeRequests = 0;

        function showOverlay() {
            overlay.style.display = "flex";
        }

        function hideOverlay() {
            overlay.style.display = "none";
        }

        function startLoading() {
            activeRequests += 1;
            showOverlay();
        }

        function stopLoading() {
            activeRequests = Math.max(0, activeRequests - 1);
            if (activeRequests === 0) {
                hideOverlay();
            }
        }

        // Track fetch requests
        const originalFetch = window.fetch;
        if (typeof originalFetch === "function") {
            window.fetch = function (...args) {
                startLoading();
                return originalFetch(...args).finally(stopLoading);
            };
        }

        // Track jQuery AJAX requests
        if (window.jQuery) {
            window.jQuery(document)
                .off("ajaxSend.loadingOverlay ajaxComplete.loadingOverlay")
                .on("ajaxSend.loadingOverlay", startLoading)
                .on("ajaxComplete.loadingOverlay", stopLoading);
        }

        // Show overlay only for normal form submission (non-AJAX)
        document.addEventListener(
            "submit",
            function (event) {
                const form = event.target;
                if (!(form instanceof HTMLFormElement)) return;

                // Wait submit handlers (that may call preventDefault) first
                setTimeout(function () {
                    if (!event.defaultPrevented && activeRequests === 0) {
                        showOverlay();
                    }
                }, 0);
            },
            true,
        );

        window.addEventListener("load", function () {
            if (activeRequests === 0) {
                hideOverlay();
            }
        });

        window.addEventListener("pageshow", function () {
            if (activeRequests === 0) {
                hideOverlay();
            }
        });
    })();
</script>
