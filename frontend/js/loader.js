function showLoader() {
    const loader = document.getElementById("loader");

    if (!loader) return;

    loader.classList.remove("hidden");
    loader.classList.add("flex");
}

function hideLoader() {
    const loader = document.getElementById("loader");

    if (!loader) return;

    loader.classList.add("hidden");
    loader.classList.remove("flex");
}