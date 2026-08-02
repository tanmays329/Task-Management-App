function showToast(message, type = "success") {

    const oldToast = document.getElementById("toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.id = "toast";

    toast.className = `
        fixed top-6 right-6 z-50
        px-6 py-4
        rounded-xl
        text-white
        shadow-2xl
        transition-all
        duration-500
        translate-x-full
    `;

    if (type === "success") {

        toast.classList.add("bg-green-600");

    }

    else if (type === "error") {

        toast.classList.add("bg-red-600");

    }

    else {

        toast.classList.add("bg-blue-600");

    }

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.remove("translate-x-full");

    }, 100);

    setTimeout(() => {

        toast.classList.add("translate-x-full");

        setTimeout(() => {

            toast.remove();

        }, 500);

    }, 3000);

}