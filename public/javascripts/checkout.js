var stripe = Stripe('');
var elements = stripe.elements();
var style = {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',
  
      '::placeholder': {
        color: '#CFD7E0',
      },
    },
};
  
var cardNumberElement = elements.create('cardNumber', {
    style: style
});
cardNumberElement.mount('#card-number-element');
  
var cardExpiryElement = elements.create('cardExpiry', {
    style: style
});
cardExpiryElement.mount('#card-expiry-element');
  
var cardCvcElement = elements.create('cardCvc', {
    style: style
});
cardCvcElement.mount('#card-cvc-element');

var cardBrandToPfClass = {
    'visa': 'pf-visa',
    'mastercard': 'pf-mastercard',
    'amex': 'pf-american-express',
    'discover': 'pf-discover',
    'diners': 'pf-diners',
    'jcb': 'pf-jcb',
    'unknown': 'pf-credit-card',
}
function setBrandIcon(brand) {
	var brandIconElement = document.getElementById('brand-icon');
  var pfClass = 'pf-credit-card';
  if (brand in cardBrandToPfClass) {
  	pfClass = cardBrandToPfClass[brand];
  }
  for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
  	brandIconElement.classList.remove(brandIconElement.classList[i]);
  }
  brandIconElement.classList.add('pf');
  brandIconElement.classList.add(pfClass);
}

function setOutcome(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');
  
    if (result.token) {
        var form = document.querySelector('form');
        form.querySelector('input[name="token"]').setAttribute('value', result.token.id);
        form.submit();
    } else if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
      document.getElementById('buttonPay').disabled = false;
    }
  }
cardNumberElement.on('change', function(event) {
	// Switch brand logo
	if (event.brand) {
  	setBrandIcon(event.brand);
  }
	setOutcome(event);
});


document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('buttonPay').disabled = true;
    var options = {
        name: document.getElementById('name').value,
        address_zip: document.getElementById('postal-code').value,
        address_line1: document.getElementById('adress-line1').value,
        address_line2: document.getElementById('adress-line2').value,
        address_city: document.getElementById('city').value,
        address_state: document.getElementById('state').value,
        address_country: document.getElementById('country').value
    };
    stripe.createToken(cardNumberElement, options).then(setOutcome);
});
