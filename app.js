// Routes being used for each template that is being cloned

const routes = {
  '/login': { templateId: 'login' },
  '/dashboard': { templateId: 'dashboard', init: updateDashboard }
};


let account = null;

// Updates the data to readable text
function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  element.textContent = '';
  element.append(textOrNode);
}

// Updates the route so that the browser remembers the data that has already been loaded

  function updateRoute() {
    const path = window.location.pathname;
    const route = routes[path];

    if (!route) {
      return navigate('/dashboard');
    }

    console.log(`ROUTE: ${routes}`);

    // Clones the template so that we can easily access the data within the API request

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(view);
    if (typeof route.init === 'function') {
      route.init();
    }
  
    document.title = route.title;
  }

  // Updates the title whenever the respected route is clicked

  document.getElementById('title').onclick = function() {
  updateRoute();
  };


  function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.href);
  }
  
  function navigate(path) {
    window.history.pushState({}, path, path);
    updateRoute();
  }
  

  window.onpopstate = () => updateRoute();
updateRoute();

// Allows the user to login and throw an error if there is no account with the data that is inputed

async function login() {
  const loginForm = document.getElementById('loginForm')
  const user = loginForm.user.value;
  if (data.error) {
    return updateElement('loginError', data.error);
  }

  account = data;
  navigate('/dashboard');
  updateDashboard();
}
// Using a GET request to ask for information about the specific useer that is being passed
// through this function.

async function getAccount(user) {
  try {
    const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

// Allows the user to create a new account and stores that data in json which is then accessed from the get request

async function register() {
  const registerForm = document.getElementById('registerForm');
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);

  const result = await createAccount(jsonData);

  if (result.error) {
    return console.log('An error occured:', result.error);
  }

  console.log('Account created!', result);
  navigate('/dashboard');
  updateDashboard();
}
// Using a POST request to create new data and be replaced with json

async function createAccount(account) {
  try {
    const response = await fetch('//localhost:5000/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: account
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

function updateDashboard() {
  if (!account) {
    return navigate('/login');
  }

  updateElement('description', account.description);
  updateElement('balance', account.balance.toFixed(2));
  updateElement('currency', account.currency);

  const transactionsRows = document.createDocumentFragment();
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRows.appendChild(transactionRow);
}
updateElement('transactions', transactionsRows);

}

function createTransactionRow(transaction) {
  const template = document.getElementById('transaction');
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector('tr');
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return transactionRow;
}


