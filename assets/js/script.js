/* Saída de emergência */
function emergencyExit() {
    const exitUrl = "https://www.google.com/search?q=previsao+do+tempo";

    try {
        sessionStorage.setItem("quick-exit-triggered", "1");
    } catch (error) {
        console.warn("Não foi possível gravar no sessionStorage.", error);
    }

    document.documentElement.style.opacity = "0";
    document.documentElement.style.pointerEvents = "none";

    window.location.replace(exitUrl);
}

/* Tecla ESC */
window.addEventListener(
    "keydown",
    function (e) {
        if (e.key === "Escape" || e.keyCode === 27) {
            e.preventDefault();
            emergencyExit();
        }
    },
    true
);

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("safety-modal");
    const closeBtn = document.getElementById("close-modal");
    const exitBtn = document.getElementById("emergency-exit");
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const backToTopBtn = document.getElementById("back-to-top");
    const exitUrl = "https://www.google.com/search?q=previsao+do+tempo";

    /* Modal */
    if (modal && getComputedStyle(modal).display !== "none") {
        document.body.style.overflow = "hidden";
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    /* Botão de saída */
    if (exitBtn) {
        exitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            emergencyExit();
        });
    }

    /* Reforço contra voltar para a página após saída */
    function shouldRedirectAgain() {
        try {
            const exited = sessionStorage.getItem("quick-exit-triggered") === "1";
            const navEntries = performance.getEntriesByType("navigation");
            const isBackForward =
                navEntries.length > 0 && navEntries[0].type === "back_forward";

            return exited && isBackForward;
        } catch (error) {
            return false;
        }
    }

    if (shouldRedirectAgain()) {
        window.location.replace(exitUrl);
    }

    window.addEventListener("pageshow", function (event) {
        try {
            const exited = sessionStorage.getItem("quick-exit-triggered") === "1";

            if (exited && event.persisted) {
                window.location.replace(exitUrl);
            }
        } catch (error) {
            console.warn("Falha ao verificar restauração da página.", error);
        }
    });

    /* Menu mobile */
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("open");

            const isOpen = mainNav.classList.contains("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (isOpen) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");

                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    /* Voltar ao topo */
    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});