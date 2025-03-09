document.addEventListener("DOMContentLoaded", function () {
  const carBrand = document.getElementById("car-brand");
  const carModel = document.getElementById("car-model");
  const engineVolume = document.getElementById("engine-volume");
  const carCondition = document.querySelectorAll("input[name='condition']");
  const ownersBlock = document.getElementById("owners-block");
  const fuelType = document.querySelectorAll("input[name='fuel-type']");
  const ownersOptions = document.querySelectorAll("input[name='owners']");
  const paymentOptions = document.querySelectorAll("input[name='payment']");
  const totalPrice = document.getElementById("total-price");
  const calculateBtn = document.getElementById("calculate-btn");
  const resetBtn = document.getElementById("reset-btn");
  const errorMessage = document.getElementById("error-message");

  const models = {
    Reno: ["Duster", "Logan", "Sandero"],
    Opel: ["Astra", "Corsa", "Insignia"],
    Mazda: ["CX-5", "Mazda3", "Mazda6"],
    Jaguar: ["XF", "XE", "F-Pace"],
  };

  function updateModels() {
    const brand = carBrand.value;
    carModel.innerHTML = "";
    models[brand]?.forEach((model) => {
      let option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      carModel.appendChild(option);
    });
    calculatePrice();
  }

  function calculatePrice() {
    let price = 10000;

    if (carBrand.value === "Jaguar") price += 20000;
    if (carBrand.value === "Mazda") price += 5000;
    if (carModel.value === "CX-5" || carModel.value === "F-Pace") price += 5000;

    let volume = parseFloat(engineVolume.value) || 1.1;
    price += volume * 1000;

    let isUsed = false;
    carCondition.forEach((radio) => {
      if (radio.checked && radio.value === "used") {
        price -= 3000;
        isUsed = true;
      }
    });

    ownersBlock.style.display = isUsed ? "block" : "none";
    ownersOptions.forEach((radio) => {
      if (radio.checked && radio.value === "3+") {
        price -= 2000;
      }
    });

    fuelType.forEach((radio) => {
      if (radio.checked) {
        if (radio.value === "diesel") price += 2000;
        if (radio.value === "gas") price -= 1000;
        if (radio.value === "electric") price += 5000;
      }
    });

    totalPrice.textContent = `Предварительный расчёт: $${price}`;
  }

  function finalizePrice() {
    const volume = engineVolume.value;
    const selectedPayment = document.querySelector(
      "input[name='payment']:checked"
    );

    if (!volume || !selectedPayment) {
      errorMessage.style.display = "block";
      return;
    } else {
      errorMessage.style.display = "none";
    }

    let finalPrice = parseFloat(totalPrice.textContent.replace(/[^\d]/g, ""));
    let paymentType = selectedPayment.value;

    if (paymentType === "card") finalPrice *= 1.02;
    if (paymentType === "cash") finalPrice *= 1.01;
    if (paymentType === "invoice") finalPrice *= 1.05;

    totalPrice.textContent = `Итоговая стоимость: $${Math.round(finalPrice)}`;
  }

  function resetCalculator() {
    carBrand.value = "Reno";
    updateModels();
    engineVolume.value = "";
    carCondition.forEach((radio) => (radio.checked = false));
    ownersOptions.forEach((radio) => (radio.checked = false));
    paymentOptions.forEach((radio) => (radio.checked = false));
    totalPrice.textContent = "Предварительный расчёт: $10000";
    errorMessage.style.display = "none";
  }

  carBrand.addEventListener("change", updateModels);
  carModel.addEventListener("change", calculatePrice);
  engineVolume.addEventListener("input", calculatePrice);
  carCondition.forEach((radio) =>
    radio.addEventListener("change", calculatePrice)
  );
  ownersOptions.forEach((radio) =>
    radio.addEventListener("change", calculatePrice)
  );
  fuelType.forEach((radio) => radio.addEventListener("change", calculatePrice));

  calculateBtn.addEventListener("click", finalizePrice);
  resetBtn.addEventListener("click", resetCalculator);

  updateModels();
});
