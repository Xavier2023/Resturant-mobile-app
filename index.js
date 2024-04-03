import { menuArray } from "./data.js";
const completeOrderBtn = document.getElementById('complete-order')
const cancelBtn = document.getElementById('cancel')
const payBtn = document.getElementById('pay')
let menuItems = document.getElementById('menu-items')
let orderItems = document.getElementById('orders')
let paymentCard = document.querySelector('.payment-card')
let body = document.querySelector('body')
let orderCompleted = document.getElementById('order-complete')

let orderPlaced = []
let orderItemsArr = []

document.addEventListener('click', function(e){
    if(e.target.dataset.add) {
        document.getElementById('order-section').style.display='block'
        getOrder(e.target.dataset.add)
        orderItemsArr = getOrderItem(orderPlaced)
        renderOrderItem(orderItemsArr)
    } else if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove, orderItemsArr)
    }
})

cancelBtn.addEventListener('click',function(){
    paymentCard.style.display='none'
    body.style.backgroundColor='white'
})

completeOrderBtn.addEventListener('click', function(){
    paymentCard.style.display='block'
    body.style.backgroundColor='#d2d2d2'
  
})

payBtn.addEventListener('click', function(e){
    e.preventDefault()
    const orderName = document.getElementById('name').value
    const orderCard = document.getElementById('card').value
    const orderCVV = document.getElementById('cvv').value
    if(orderName.length > 0 && orderCard.length == 12 && orderCVV.length == 3){
        paymentCard.style.display='none'
        body.style.backgroundColor='white'
        orderItems.style.display='none'
        document.getElementById('order-section').style.display='none'
        renderOrderStatus(orderName)
    } else {
        alert('Please enter the correct details')
    }
 
})

document.querySelector("form").addEventListener("submit", function (event) {
    if (orderCard.value.length < 12) {
      event.preventDefault();
      alert("Card number must be 12 digits long.");
    }
  });

document.querySelector("form").addEventListener("submit", function (event) {
    if (orderCVV.value.length < 3) {
      event.preventDefault();
      alert("CVV number must be 3 digits long.");
    }
  });

function getOrder(menuId) {
    const targetMenuObj = menuArray.filter(function(menu){
        return menu.id == menuId
    })[0]
    orderPlaced.push({ name: targetMenuObj.name, price: targetMenuObj.price });
}

function getOrderItem(orderPlaced) {
    let orderItemsObj = {}
    orderPlaced.forEach(order => {
        let key = `${order.name}:${order.price}`
        orderItemsObj[key] = (orderItemsObj[key] || 0) + 1
    });

    let orderItemsArr = Object.keys(orderItemsObj).map((key) => {
        let [name, price] = key.split(":"); 
        return {
            name: name,
            price: price,
            count: orderItemsObj[key]
        }
    })
    return orderItemsArr

}


function renderOrderItem(orderItemsArr) {
    let orderItemsHtml =""

    orderItemsHtml += orderItemsArr.map((item) => {
        return `
            <div id="order">
                <h3>${item.name} <sup> * ${item.count}</sup> <span id="remove-item" data-remove="${item.name}">remove</span></h3>
                <p>$${item.price * item.count}</p>
            </div>
        `
    }).join('')
    orderItems.innerHTML = orderItemsHtml

    let total = getTotal(orderItemsArr)
    document.getElementById('total-price').innerHTML = `
    <h2>Total price:</h2>
    <p>$${total}</p>
    `
}

function getTotal(orderItemsArr) {
    let total = 0;
    orderItemsArr.forEach((items) => {
      const { price, count } = items;
      total += price * count;
    });
    return total;
  }

function removeItem(itemRemoved, orderItemsArr) {
    const targetOrderedItem = orderItemsArr.find((order) => {
        return order.name === itemRemoved
    })
    if (targetOrderedItem && targetOrderedItem.count > 1) {
        targetOrderedItem.count--
    } else if(targetOrderedItem && targetOrderedItem.count === 1) {
        const itemIndex = orderItemsArr.indexOf(targetOrderedItem)
        if (itemIndex !== -1) {
            orderItemsArr.splice(itemIndex, 1)
        }
    } 
    renderOrderItem(orderItemsArr)
   
}  

function getMenu() {
    let menuHtml = ''
    menuArray.map(function(menu) {
        menuHtml += `
        <div class="menu-item">
            <div class="menu">
                <i class="menu-icon">${menu.emoji}</i>
                <div class="menu-content">
                <h1>${menu.name}</h1>
                    <p>${menu.ingredients}</p>
                    <h2>$${menu.price}</h2>
                </div>
            </div>
            <button id="add-item-btn"
            data-add="${menu.id}"
            >+</button>
        </div>
    `
    })
    return menuHtml
}

function renderOrderStatus(orderName) {
    orderCompleted.innerHTML = `
    <div class="message">
        <p>Thanks ${orderName}! Your order is on its way</p>
    </div>
    `
}

function render() {
    menuItems.innerHTML = getMenu()
}

render()


