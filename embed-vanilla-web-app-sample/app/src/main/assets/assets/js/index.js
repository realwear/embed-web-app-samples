const counterEl = document.getElementById("counter")
let counter = 0

function updateUi() {
    counterEl.textContent = `${counter}`
}

function increment() {
    counter++
    updateUi()
}

function decrement() {
    counter--
    updateUi()
}

updateUi()
