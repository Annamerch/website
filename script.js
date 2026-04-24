// Produktdaten
const products = [
    {
        id: 1,
        name: "T-Shirt",
        price: 20.00,
        image: "https://via.placeholder.com/150",
        description: "Ein bequemes T-Shirt"
    },
    {
        id: 2,
        name: "Hoodie",
        price: 35.00,
        image: "https://via.placeholder.com/150",
        description: "Ein warmer Hoodie"
    },
    {
        id: 3,
        name: "Cap",
        price: 15.00,
        image: "https://via.placeholder.com/150",
        description: "Eine coole Cap"
    },
    {
        id: 4,
        name: "Jeans",
        price: 40.00,
        image: "https://via.placeholder.com/150",
        description: "Eine stylische Jeans"
    },
    {
        id: 5,
        name: "Sneakers",
        price: 50.00,
        image: "https://via.placeholder.com/150",
        description: "Bequeme Sneakers"
    }
];

// Funktion zum Erstellen der Produktkarten
function createProductCards() {
    const gridContainer = document.querySelector('.grid-container');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;

        const productName = document.createElement('h3');
        productName.textContent = product.name;

        const productPrice = document.createElement('p');
        productPrice.textContent = `€${product.price.toFixed(2)}`;

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);

        gridContainer.appendChild(productCard);
    });
}

// Modal öffnen
function openModal(productId) {
    document.getElementById('orderModal').style.display = 'block';
    // Hier könnte man die Produktdaten in das Formular laden
}

// Modal schließen
function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Event-Listener für das Schließen des Modals
document.querySelector('.close').addEventListener('click', closeModal);

// Event-Listener für das Öffnen des Modals beim Klick auf eine Produktkarte
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        openModal(productId);
    });
});

// Formularvalidierung und E-Mail-Versand
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;

    // Validierung der Eingaben
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const grade = document.getElementById('grade').value;
    const classLetter = document.getElementById('class').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!size) {
        document.getElementById('sizeError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('sizeError').style.display = 'none';
    }

    if (!color) {
        document.getElementById('colorError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('colorError').style.display = 'none';
    }

    if (!gender) {
        document.getElementById('genderError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('genderError').style.display = 'none';
    }

    if (!grade) {
        document.getElementById('gradeError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('gradeError').style.display = 'none';
    }

    if (!classLetter) {
        document.getElementById('classError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('classError').style.display = 'none';
    }

    if (name.length < 3) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    if (!email.includes('@')) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('emailError').style.display = 'none';
    }

    if (isValid) {
        // Senden der Bestellung per EmailJS
        emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'ORDER_TEMPLATE_ID', {
            to_name: name,
            from_name: name,
            email: email,
            size: size,
            color: color,
            gender: gender.value,
            grade: grade,
            class: classLetter,
            product_name: "Produktname", // Hier könntest du den Produktnamen dynamisch einfügen
            product_price: 0, // Hier könntest du den Produktpreis dynamisch einfügen
        })
        .then(function(response) {
            console.log('E-Mail gesendet!', response.status, response.text);
            alert('Bestellung erfolgreich! Eine Bestätigung wurde an deine E-Mail gesendet.');
            closeModal();
        }, function(error) {
            console.error('Fehler beim Senden der E-Mail:', error);
            alert('Oops! Etwas ist schiefgelaufen. Bitte versuche es später noch einmal.');
        });

        // Senden der Bestätigungsmail an den Kunden
        emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'CONFIRMATION_TEMPLATE_ID', {
            to_name: name,
            from_name: 'Anna Merch Shop',
            email: email,
            subject: 'Bestätigung deiner Bestellung',
            message: `Vielen Dank für deine Bestellung!\n\nHier sind deine Bestelldetails:\n- Name: ${name}\n- E-Mail: ${email}\n- Größe: ${size}\n- Farbe: ${color}\n- Geschlecht: ${gender.value}\n- Jahrgangsstufe: ${grade}\n- Klassenbuchstabe: ${classLetter}\n\nDein Produkt wird bald versendet.\n\nBei Fragen kontaktiere uns unter: st.anna.merch@protonmail.com`,
        });
    }
});

// PayPal Button
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '0.01' // Hier den Preis dynamisch einfügen
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Zahlung erfolgreich! Vielen Dank für deine Bestellung.');
        });
    }
}).render('#paypal-button-container');
