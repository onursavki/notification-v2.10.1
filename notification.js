document.addEventListener('DOMContentLoaded', function() {
    const notifications = [
        "📧 1 Davet Mektubunuz Var.<br/><a href='https://kick.com/ekipgamestv' target='_blank'>kick.com/EkipGamesTV</a>",
        "Discord'a gelmeyi unutmayın.<br/><a href='https://discord.gg/Scsxdnv3xw' target='_blank'>Ekip Games™</a>",
        "Assassins Creed Shadows.<br/><a href='https://www.ekipgames.com/2025/03/Assassins-Creed-Shadows.html' target='_blank'>Oyunu İncele</a>",
        "Nodric Horizons Haritası Yayınlandı.<br/><a href='https://www.ekipgames.com/2025/03/Euro-Truck-Simulator-2-Nordic-Horizons.html' target='_blank'>Haritayı İncele</a>",
        "Euro Truck Simulator 2 v1.54 Yayınlandı.<br/><a href='https://www.ekipgames.com/2025/02/Euro-Truck-Simulator-2-v1-54.html' target='_blank'>Değişikliklere Gözat</a>",
        "Sid Meier’s Civilization® VII.<br/><a href='https://www.ekipgames.com/2025/12/Sid-Meiers-Civilization-VII.html' target='_blank'>Oyunu İncele</a>"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentNotificationIndex')) || 0;
    let lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime')) || Date.now();
    let notificationInterval;
    let pauseStartTime;
    let hideTimeout;
    let notificationCount = notifications.length;
    let remainingTime = notificationCount * 10000;
    let startTime;

    function updateNotification() {
        const now = Date.now();
        const notificationContent = document.getElementById('notification-content');
        if (notificationContent) {
            if (currentIndex >= notifications.length) {
                currentIndex = 0;
            }
            notificationContent.innerHTML = notifications[currentIndex];
            notificationContent.style.display = 'block';
        } else {
            console.error("Element with ID 'notification-content' not found.");
        }

        currentIndex = (currentIndex + 1) % notifications.length;
        localStorage.setItem('currentNotificationIndex', currentIndex);
        updateNotificationCount();

        lastUpdateTime = now;
        localStorage.setItem('lastUpdateTime', lastUpdateTime);
    }

    function updateNotificationCount() {
        const countElement = document.querySelector('.notification-no');
        if (countElement) {
            countElement.textContent = notifications.length;
        } else {
            console.error("Element with class 'notification-no' not found.");
        }
    }

    function hideNotificationFor10Minutes() {
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        const hideUntil = now + tenMinutes;

        localStorage.setItem('notification-hide-until', hideUntil);
        const notificationBox = document.getElementById('notification-box');
        if (notificationBox) {
            notificationBox.style.display = 'none';
        } else {
            console.error("Element with ID 'notification-box' not found.");
        }
    }

    function checkNotificationVisibility() {
        const hideUntil = localStorage.getItem('notification-hide-until');
        const now = Date.now();

        if (hideUntil && now < hideUntil) {
            document.getElementById('notification-box').style.display = 'none';
        } else {
            document.getElementById('notification-box').style.display = 'block';
            localStorage.removeItem('notification-hide-until');
        }
    }

    function startNotificationInterval() {
        notificationInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastUpdateTime;

            if (elapsed >= 10000) {
                updateNotification();
            }
        }, 1000);
    }

    function stopNotificationInterval() {
        clearInterval(notificationInterval);
        pauseStartTime = Date.now();
    }

    function resumeNotificationInterval() {
        const now = Date.now();
        const pauseDuration = now - pauseStartTime;

        lastUpdateTime += pauseDuration;
        localStorage.setItem('lastUpdateTime', lastUpdateTime);

        startNotificationInterval();
    }

    function autoHideNotification() {
        startTime = Date.now();
        hideTimeout = setTimeout(() => {
            const notificationBox = document.getElementById('notification-box');
            if (notificationBox) {
                notificationBox.style.display = 'none';
            } else {
                console.error("Element with ID 'notification-box' not found.");
            }
        }, remainingTime);
    }

    function pauseAutoHide() {
        clearTimeout(hideTimeout);
        const now = Date.now();
        remainingTime -= (now - startTime);
    }

    function resumeAutoHide() {
        startTime = Date.now();
        autoHideNotification();
    }

    setTimeout(() => {
        checkNotificationVisibility();
        updateNotification();
        startNotificationInterval();
        autoHideNotification();
    }, 2000);

    const closeButton = document.getElementById('close-notification');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideNotificationFor10Minutes();
            notifications.splice(currentIndex, 1);
            notificationCount = notifications.length;
            remainingTime = notificationCount * 10000;
            updateNotificationCount();

            if (currentIndex >= notificationCount) {
                currentIndex = 0;
            }
            updateNotification();
        });
    } else {
        console.error("Element with ID 'close-notification' not found.");
    }

    const notificationBox = document.getElementById('notification-box');
    if (notificationBox) {
        notificationBox.addEventListener('mouseenter', function() {
            stopNotificationInterval();
            pauseAutoHide();
        });

        notificationBox.addEventListener('mouseleave', function() {
            resumeNotificationInterval();
            resumeAutoHide();
        });
    } else {
        console.error("Element with ID 'notification-box' not found.");
    }
});