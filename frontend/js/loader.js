function showLoader() {

    document
        .getElementById("loader")
        .classList
        .remove("hidden");

    document
        .getElementById("loader")
        .classList
        .add("flex");

}

function hideLoader() {

    document
        .getElementById("loader")
        .classList
        .add("hidden");

    document
        .getElementById("loader")
        .classList
        .remove("flex");

}