const toCurrency = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat('en-En', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

M.Tabs.init(document.querySelectorAll('.tabs'));

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, options);
});

M.Sidenav.init(document.querySelectorAll('.sidenav'));

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach((node) => {
  node.textContent = toDate(node.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/' + id + '/remove', {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((cart) => {
          console.log(cart);
          if (cart.courses.length > 0) {
            const html = cart.courses
              .map((c) => {
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.price}₽</td>
                  <td>${c.count}</td>
                  <td>
                    <button
                      class="btn btn-small deep-orange darken-2 waves-effect waves-dark js-remove"
                      data-id="${c._id}"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                 `;
              })
              .join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $cart.innerHTML = `<p>Your cart is empty</p>`;
          }
        });
    }
  });
}
