console.log("JavaScript berhasil terhubung!");

document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript berhasil terhubung!");

    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");
    const installBtn = document.getElementById("installBtn");
    const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
    const toggleLightModeBtn = document.getElementById("toggleLightMode");
    const showAllBtn = document.getElementById("showAll");
    const showActiveBtn = document.getElementById("showActive");
    const showCompletedBtn = document.getElementById("showCompleted");
    const notifyBtn = document.getElementById("notifyBtn");

    if (!taskInput || !taskList || !addButton) {
        console.error("Elemen input, daftar tugas, atau tombol tambah tidak ditemukan!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let isDarkMode = false;
    let deferredPrompt;

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'active') return !task.completed;
            return true; // 'all'
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.completed);

            li.innerHTML = `
                <span>${task.text}</span>
                <button class="deleteBtn">Hapus</button>
                <button class="completeBtn">${task.completed ? 'Batal' : 'Selesai'}</button>
            `;
            taskList.appendChild(li);

            // Event listener untuk tombol hapus
            li.querySelector('.deleteBtn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            // Event listener untuk tombol selesai
            li.querySelector('.completeBtn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });
        });
    }

    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addButton.addEventListener("click", () => {
        if (taskInput.value.trim() === "") return;

        const newTask = {
            text: taskInput.value,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    });

    //mode
    toggleDarkModeBtn.addEventListener("click", () => {
        document.body.classList.add("dark-mode");
        toggleDarkModeBtn.style.display = "none"; // Sembunyikan tombol gelap
        toggleLightModeBtn.style.display = "inline-block"; // Tampilkan tombol terang
        isDarkMode = true;
    });

    // mode 
    toggleLightModeBtn.addEventListener("click", () => {
        document.body.classList.remove("dark-mode");
        toggleLightModeBtn.style.display = "none"; // Sembunyikan tombol terang
        toggleDarkModeBtn.style.display = "inline-block"; // Tampilkan tombol gelap
        isDarkMode = false;
    });

    showAllBtn.addEventListener("click", () => renderTasks('all'));
    showActiveBtn.addEventListener("click", () => renderTasks('active'));
    showCompletedBtn.addEventListener("click", () => renderTasks('completed'));

    // Notifikasi 
    notifyBtn.addEventListener("click", () => {
        if ("Notification" in window && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Pengingat: Jangan lupa tugas Anda!");
                }
            });
        } else {
            alert("Notifikasi tidak diizinkan!");
        }
    });

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((reg) => console.log("Service Worker terdaftar:", reg.scope))
                .catch((err) => console.log("Service Worker gagal:", err));
        });
    }

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Mencegah popup default
        deferredPrompt = event;
        console.log("Event beforeinstallprompt terdeteksi!");

        if (installBtn) {
            installBtn.style.display = "block"; 
            installBtn.addEventListener("click", async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt(); 
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(outcome === "accepted" ? "Aplikasi diinstall!" : "Instalasi dibatalkan!");
                    deferredPrompt = null; 
                    installBtn.style.display = "none"; 
                }
            });
        }
    });
    renderTasks();
});
