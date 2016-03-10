//Global Scope :(
var displayId = document.getElementById("display-container")
var deleteItem = document.getElementById("cart")
var addedObjects = []
var tempVar;

// EVENT DELEGATION
document.body.addEventListener('click', function(e){
  var target = e.target
  console.log(e)
  if(target.id == "searchClick" ){ mainSearch(e) }
  if(target.id == "searchClick2" ){ secondarySearch(e) }
  if(target.textContent == "Add Cart"){ addItems(e) }
  if(target.textContent == "Delete") { deleteItems(e) }
  if(target.id == "checkout") { checkOut(e) }
  if(target.id == "formSubmit") { formData(e) }
  if(target.id == "back" || target.id == "home") { toggleDisplay(e, "title") }
  if(target.id == "back2") { toggleDisplay(e, "items") }
  if(target.nodeName == "BUTTON" && isTrue(target.textContent, "read")){ reviewItems(e) }
  if(target.nodeName == "BUTTON" && isTrue(target.textContent, "write")){ reviewItems(e); tempVar = target.id }
  if(target.id == "reviewSubmit"){ writeSubmit(e, tempVar) }
})

var mainSearch = function(e){
  var itemSearched = e.target.previousElementSibling.value
  clearDom(displayId)
  searchItem(itemSearched)
  toggleDisplay(e, "items")
  e.preventDefault()
}

var secondarySearch = function(e){
  var itemSearched = e.target.parentElement.firstElementChild.value
    clearDom(displayId)
    searchItem(itemSearched)
    e.preventDefault()
}

//Add Items to the Cart
var addItems = function(e){
  var addedCount = document.getElementById("number")
  var elementId = e.target.id
  var itemObject = {
    id: elementId,
    quantity: parseInt(e.target.offsetParent.childNodes[3].value)
  }

  if(addedObjects.length == 0){
    addedObjects.push(itemObject)
  } else if(valueCheck(addedObjects, elementId)){
    addedObjects.forEach(function(items){
      if(items.id == elementId){
        items.quantity += itemObject.quantity
        return;
      }
    })
  } else {
    addedObjects.push(itemObject)
  }
  addedCount.innerHTML = objectAddProperty(addedObjects, "quantity")
  e.preventDefault()
}

//Delete Items from the Cart
var deleteItems = function(e){
    var elementId = e.target.id
    var itemToRemove = elementId.slice(0, (elementId.length - 6))
    addedObjects.forEach(function(items){
      var selectedQuantity = e.target.offsetParent.childNodes[3].value
      if(items.id == itemToRemove){
        if(items.quantity == selectedQuantity){
            var objectPosition = objectIndexOf(addedObjects, itemToRemove, "id")
            addedObjects.splice(objectPosition, 1)
        } else {
          items.quantity -= selectedQuantity
        }
      }
    })
    clearDom(deleteItem)
    itemsInCart("cart")
}

//OnClick will send you to the checkout page
var checkOut = function(e){
  clearDom(deleteItem)
  itemsInCart("cart");
  toggleDisplay(e, "payment-container")
  e.preventDefault();
}

//Append thee reviews and ratings on the hidden modal
var appendModal = function(rowClass, colClass, col2Class, itemRating, itemReview){
  var modalBody = document.getElementById("modalContainer")
  var modalContainer = document.createElement("div")
  var modalStar = document.createElement("div")
  var modalReview = document.createElement("div")
  var starText = document.createTextNode(itemRating)
  var reviewText = document.createTextNode(itemReview)
  var hr = document.createElement("hr")
  ratings(modalStar, itemRating, "blah")
  modalContainer.className = rowClass
  modalStar.className = colClass
  modalReview.className = col2Class
  modalReview.appendChild(reviewText)
  modalContainer.appendChild(modalStar)
  modalContainer.appendChild(modalReview)
  modalBody.appendChild(modalContainer)
  modalBody.appendChild(hr)
}

//Call all the reviews from the object
var reviewItems = function(e){
  clearDom(modalContainer)
  var index = ((e.target.id.length - 6) * -1)
  var clickType = e.target.id.slice(e.target.id, 6)
  var clickName = e.target.id.slice(index)
  if(clickType == "review"){
    data.forEach(function(items){
      if(items.id == clickName){
        items["review"].forEach(function(review){
          appendModal("row","col-md-4", "col-md-8", review.rating, review.review)
        })
      }
    })
  }
}

//Write a review and save it to the object
var writeSubmit = function(e, id) {
  var review = document.getElementById("reviewText")
  var radio = document.getElementsByName("inlineRadioOptions")
  var quantity = 0;
  var index = ((id.length - 6) * -1)
  var clickName = id.slice(index)
  var reviewObject = {}
  for(var i = 0; i<radio.length; i++){
    if(radio[i].checked){
      quantity = radio[i].value
    }
  }
  data.forEach(function(items){
    if(items.id == clickName){
      reviewObject = {rating: quantity, review: review.value}
      items.review.push(reviewObject)
      reviewObject = {}
      review.value = ""
    }
  })
}

//Display star ratings
var ratings = function(col, rating, id){
  var divRating = document.createElement("div")
  divRating.id = id
  var fullStars = rating
  for(var i = 0; i < 5; i++){
    var element = document.createElement("i")
    if(fullStars > 0){
      element.className = "fa fa-star fa-2x stars"
      fullStars -= 1;
    } else {
      element.className = "fa fa-star-o fa-2x stars"
    }
    divRating.appendChild(element)
  }
  col.appendChild(divRating)
}

//Search the data object based on the input value of the user
var searchItem = function(item){
  for(var i = 0; i<data.length; i++){
    if((data[i].category).indexOf(item) !== -1 || data[i].keyword == item){
      var prop = data[i]
      var name = prop.name
      var highlights = prop.highlights
      var description = prop.description
      var id = prop.id
      var image = prop.image
      var price = prop.price
      var stars = prop.stars
      createItems(name, highlights, description, id, image, price, "display-container", stars)
    }
  }
}

//Create several divs and columns that will append in the item container values from the data object.
var createItems = function(name, highlights, description, id ,image, price, elementContainer, stars, quantity){
  var d = document
    , rowDiv = d.createElement("div")
    , colDiv1 = d.createElement("div")
    , colDiv2 = d.createElement("div")
    , hr = d.createElement("hr")
    , strong = d.createElement("strong")
    , colText = d.createTextNode(name)
    , colText2 = d.createTextNode(highlights)
    , colText3 = d.createTextNode("$" + price + "   -   ")
    , innerContainer = d.getElementById(elementContainer)
    , columnClass = "col-md-8 col-md-offset-1"
    , imgClass = "col-md-2 align-center box-size"
    , rowClass = "row"
  var list = function(array){
    for(i=0; i<array.length; i++){
      var list = d.createElement("li")
      var space = d.createElement("br")
      var listText = d.createTextNode(array[i])
      list.appendChild(listText)
      colDiv2.appendChild(list)
    }
    colDiv2.appendChild(space)
  }
  var append = function(row, col, rowClass, colClass, colText){
    row.className = rowClass
    col.className = colClass
    col.appendChild(colText)
    row.appendChild(col)
  }
  var select = function(value, colDiv){
    var select = d.createElement("select")
    for(var i = 1; i<= value; i++){
      var optionName = "option" + i
      var optionName = d.createElement("option")
      optionName.value = i
      select.className = "quantity"
      optionName.appendChild(d.createTextNode(i))
      select.appendChild(optionName)
      colDiv.appendChild(select)
    }
  }

  var links = function(text, id, className, col, modal, modalId){
    var linkText = d.createTextNode(text)
    var divContainer = d.createElement("div")
    var element = d.createElement("button")
    element.type = "button"
    element.className = "btn btn-primary btn-sm"
    divContainer.className = className
    element.id = id
    if(modal != undefined){
      var dataAttr = document.createAttribute("data-toggle")
      var dataAttr1 = document.createAttribute("data-target")
      dataAttr.value = modal
      dataAttr1.value = modalId
      element.setAttributeNode(dataAttr)
      element.setAttributeNode(dataAttr1)
    }
    element.appendChild(linkText)
    divContainer.appendChild(element)
    col.appendChild(divContainer)
  }
  var img = function(image, col, id){
    var element = d.createElement("img")
    col.appendChild(element)
    element.src = image
    element.className = "img-responsive img-test"
    if(elementContainer == "display-container"){
      links("Add Cart", id, "divLink", col)
      select(9, col)

    } else {
      var deleteId = (id + "delete")
      links("Delete", deleteId, "divLink", col)
      select(quantity, col)
    }
  }
  var review = function(id) {
    var reviewId = "review" + id
    var writeId = "create" + id
    links("Read a review", reviewId, "divLink", colDiv2, "modal", "#myModal")
    links("Write a review", writeId, "divLink", colDiv2, "modal", "#writeModal")
  }

  strong.appendChild(colText3)
  append(rowDiv, colDiv1, rowClass, imgClass, colText)
  append(rowDiv, colDiv2, rowClass, columnClass, strong)
  append(rowDiv, colDiv2, rowClass, columnClass, colText2)
  img(image, colDiv1, id)
  list(description)
  ratings(colDiv1, stars, "starContainer")
  review(id)
  innerContainer.appendChild(rowDiv)
  innerContainer.appendChild(hr)
}

//Checks items added to the cart
var itemsInCart = function(id_target){
  var sub_total = 0;
  for(var i = 0; i < addedObjects.length; i++){
    for(var j = 0; j < data.length; j++){
      if (addedObjects[i].id == data[j].id){
        var prop = data[j]
        var name = prop.name
        var highlights = prop.highlights
        var description = prop.description
        var id = prop.id
        var image = prop.image
        var price = prop.price
        var stars = prop.stars
        sub_total += (price * addedObjects[i].quantity)
        createItems(name, highlights, description, id, image, price, id_target, stars, addedObjects[i].quantity)
      }
    }
  }
  updateTotal(sub_total)
}

//Loops through the form elements creating an object of data to be processed for payment
var formData = function(e){
  var form = e.target.form.elements
  var dataObject = {}
  for(var i = 0; i<form.length; i++){
    dataObject[form[i].id] = form[i].value;
  }
  return dataObject
  e.preventDefault()
}

//Update the number of items in the cart
var updateTotal = function(sub_total){
  var subtotalSpan = document.getElementById("subtotal")
  var taxSpan = document.getElementById("tax")
  var shippingSpan = document.getElementById("shipping")
  var totalSpan = document.getElementById("total_sum")

  var tax = (sub_total * 0.08)
  var shipping = 25.00
  var total = (sub_total + tax + shipping)
  subtotalSpan.innerHTML = formatting(sub_total.toFixed(2))
  taxSpan.innerHTML = formatting(tax.toFixed(2))
  shippingSpan.innerHTML = formatting(shipping)
  totalSpan.innerHTML = formatting(total.toFixed(2))
}

//UTILITY FUNCTIONS
//Clear all childNodes as a new search is entered.
var clearDom = function(clearId){
  while(clearId.hasChildNodes()){
    clearId.removeChild(clearId.lastChild)
  }
}

//Formatting for the numbers by adding commas
var formatting = function(number){
  var numToString = number.toString();
  var formatted = numToString >= 1000 ? '$' + numToString.charAt(0) + ',' + numToString.slice(1, numToString.length) : '$' + numToString
  return formatted
}

//Function for indexOf Objects
var objectIndexOf = function(objectArray, id, property){
  for(var i = 0; i < objectArray.length; i++){
    if(objectArray[i][property] == id){
      return i
    }
  }
  return -1
}

//Sums up the total value of the specified object value
var objectAddProperty = function(objectArray, property){
  var sum = 0
  for(var i = 0; i < objectArray.length; i++){
    sum += parseInt(objectArray[i][property])
  }
  return sum
}

//To toggle between states for which page the user is currently on.
var toggleDisplay = function(e, state){
  var containers = document.getElementsByClassName("container")
  var titleClasses = containers[0]
  var itemClasses = containers[1]
  var paymentClasses = containers[2]

  if(state == "title"){
    itemClasses.classList.add("hidden")
    paymentClasses.classList.add("hidden")
    titleClasses.classList.remove("hidden")
  } else if(state == "items"){
    titleClasses.classList.add("hidden")
    paymentClasses.classList.add("hidden")
    itemClasses.classList.remove("hidden")
  } else {
    titleClasses.classList.add("hidden")
    itemClasses.classList.add("hidden")
    paymentClasses.classList.remove("hidden")
  }
  e.preventDefault()
}

//Checks to see if a value exists
var valueCheck = function(object, id){
  var status = false;
  object.forEach(function(items){
    if(items.id === id){
      status = true
    }
  })
  return status
}

//Check to see if a word is within a string
var isTrue = function(stringName, word){
  var string = stringName.toLowerCase()
  var substring = word
  return (string.indexOf(substring) > -1)
}
