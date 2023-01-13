const priceProduct = document.querySelector(".priceProduct");
const numberStock = document.querySelector(".number-stock");
const buttonPay = document.querySelector(".button-pay");

const splitPrice = priceProduct.textContent.split(":");
const splitNPrice = splitPrice[1].split("\n");
const realPrice = Number(splitNPrice[0]);

numberStock.addEventListener("input", function () {
  priceProduct.textContent = "Price: " + realPrice * Number(numberStock.value);
});

buttonPay.addEventListener("click", async function () {
  const valid = await swal({
    title: "Pembelian Berhasil!",
    text: "Anda Berhasil memesan Barang ini!",
    icon: "success",
    button: "Lanjutkan!",
  });
  if (valid) window.location.href = "http://localhost:5000/shop";
});
