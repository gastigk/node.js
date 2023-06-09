const socket = io();

let productForm = document.querySelector('form#product-form');

productForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  let newProduct = {
    title: productForm.title.value,
    category: productForm.category.value,
    description: productForm.description.value,
    price: productForm.price.value,
    status: productForm.status.value,
    stock: productForm.stock.value,
    code: productForm.code.value,
    thumbnails: '/img/' + productForm.thumbnails.value.replace(/^.*\\/, ''),
  };

  socket.emit('product-list', { product: newProduct });
  let productListElement = document.querySelector(
    'div#product-list.d-flex.flex-wrap.justify-content-center'
  );

  socket.on('product', (newProduct) => {});

  let productCards = `<div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${newProduct.thumbnails}" alt="Card image cap">
        <div class="card-body">
            <h4 class="card-title">${newProduct.title}</h4>
            <p class="card-text">${newProduct.description} </p>
            <h5 class="card-text">$${newProduct.price}.- </h5>
              <button type="submit" class="btn btn-success">Comprar</button>                             
        </div>
      </div>`;

  productListElement.innerHTML += productCards;
  productForm.reset();
});
